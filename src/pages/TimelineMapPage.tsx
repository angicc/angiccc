import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import { addBonusXp } from '@/features/progress/progressStore';
import { TERRITORY_TOPICS, type TerritoryTopic, type MarkerType } from '@/features/content/timelineTerritoryData';
import type { Language } from '@/i18n/translations';
import { getTranslatedTerritoryDesc } from '@/i18n/territoryDescTranslations';
import { getQuestionsForTopic, getTranslatedTerritoryQuestion, type TerritoryQuizQuestion } from '@/i18n/territoryMapQuizData';
import { getTranslatedMarkerName, getTranslatedMarkerNote, getTranslatedMarkerType, getTranslatedPolyLabel } from '@/i18n/territoryMarkerTranslations';
import {
  Map as MapIcon, ChevronRight, Layers, Palette, BookOpen, HelpCircle, Play, Pause,
  SkipBack, SkipForward, ChevronDown, X, Trophy, Swords, Anchor, Clock,
  MapPin as MapPinIcon, PenLine, Eraser, Shield, Wheat, AlertTriangle, Eye,
} from 'lucide-react';
import {
  computeChokepoints, deriveTelemetry, loadExplored, saveExplored,
  loadAnnotations, saveAnnotations, ERA_TEXTURES, ensureEraTexturePattern,
  type MapAnnotations, type RegionTelemetry,
} from '@/features/map/tacticalLayers';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// ─── Constants ────────────────────────────────────────────────────────────────

const ERA_COLORS = { ancient: 'text-amber-400', medieval: 'text-blue-400', 'early-modern': 'text-emerald-400', modern: 'text-rose-400' } as const;
const ERA_BG    = { ancient: 'bg-amber-400/10', medieval: 'bg-blue-400/10', 'early-modern': 'bg-emerald-400/10', modern: 'bg-rose-400/10' } as const;
const ERA_BORDER= { ancient: 'border-amber-400/40', medieval: 'border-blue-400/40', 'early-modern': 'border-emerald-400/40', modern: 'border-rose-400/40' } as const;

const ERA_LABELS: Record<string, Record<Language, string>> = {
  ancient:        { en: 'Ancient World',  es: 'Mundo Antiguo',          ru: 'Древний мир',          mk: 'Античко доба' },
  medieval:       { en: 'Middle Ages',    es: 'Edad Media',              ru: 'Средние века',          mk: 'Среден век' },
  'early-modern': { en: 'Early Modern',   es: 'Época Moderna Temprana',  ru: 'Раннее Новое время',   mk: 'Рано модерно доба' },
  modern:         { en: 'Modern Era',     es: 'Era Moderna',             ru: 'Современная эпоха',    mk: 'Модерна ера' },
};

interface CartographicStyle {
  id: string;
  nameKey: keyof Record<string, string>;
  url: string;
  attribution: string;
  filter: string;
  subdomains?: string;
}

const CART_STYLES: CartographicStyle[] = [
  {
    id: 'dark',
    nameKey: 'tmap_style_dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    filter: '',
  },
  {
    id: 'military',
    nameKey: 'tmap_style_military',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    filter: 'hue-rotate(100deg) saturate(1.3) brightness(0.75)',
  },
  {
    id: 'terrain',
    nameKey: 'tmap_style_terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>',
    filter: '',
    subdomains: 'abc',
  },
  {
    id: 'clean',
    nameKey: 'tmap_style_clean',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    filter: '',
  },
  {
    id: 'satellite',
    nameKey: 'tmap_style_satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    filter: '',
    subdomains: undefined,
  },
];

type MapMode = 'explore' | 'story' | 'quiz';
type LayerKey = 'territory' | 'capitals' | 'cities' | 'battles' | 'ports' | 'resources' | 'routes';
type AnnMode = 'off' | 'pin' | 'draw';

// Multi-category data filter matrix — each strategic category governs a group
// of concrete layer toggles.
const FILTER_MATRIX: { labelKey: 'tmap_cat_assets' | 'tmap_cat_diplomatic' | 'tmap_cat_resources' | 'tmap_cat_enemy'; keys: LayerKey[] }[] = [
  { labelKey: 'tmap_cat_assets',     keys: ['territory', 'capitals', 'cities', 'ports'] },
  { labelKey: 'tmap_cat_diplomatic', keys: ['routes'] },
  { labelKey: 'tmap_cat_resources',  keys: ['resources'] },
  { labelKey: 'tmap_cat_enemy',      keys: ['battles'] },
];

// Crossfade the previous territory out instead of hard-clearing it, so
// timeline scrubs and topic switches read as fluid border transitions.
function fadeOutAndClear(lg: L.LayerGroup, durationMs = 320) {
  const doomed: L.Layer[] = [];
  lg.eachLayer(l => doomed.push(l));
  doomed.forEach(l => {
    const el = (l as unknown as { getElement?: () => Element | null }).getElement?.();
    if (el instanceof SVGElement || el instanceof HTMLElement) {
      el.style.transition = `opacity ${durationMs}ms ease-out`;
      el.style.opacity = '0';
    }
  });
  setTimeout(() => doomed.forEach(l => lg.removeLayer(l)), durationMs + 20);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const MARKER_COLORS: Record<MarkerType, string> = {
  capital:   '#fbbf24',
  city:      '#60a5fa',
  battle:    '#ef4444',
  port:      '#34d399',
  resource:  '#a78bfa',
  landmark:  '#f97316',
};

const MARKER_ICONS: Record<MarkerType, string> = {
  capital:  '★',
  city:     '●',
  battle:   '⚔',
  port:     '⚓',
  resource: '◆',
  landmark: '▲',
};

// Marker type priority for label de-cluttering (higher = more important)
const MARKER_PRIORITY: Record<MarkerType, number> = {
  capital:  6,
  city:     5,
  battle:   4,
  port:     3,
  resource: 2,
  landmark: 1,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTitle(topic: TerritoryTopic, language: Language): string {
  if (language === 'en') return topic.title;
  return topic.titleI18n[language as Exclude<Language, 'en'>] ?? topic.title;
}

// Get fill opacity based on zoom level — calibrated for gradient fills (no glow layers)
function getFillOpacityForZoom(zoom: number): number {
  if (zoom < 3) return 0.35;
  if (zoom <= 4) return 0.28;
  if (zoom <= 5) return 0.22;
  if (zoom <= 7) return 0.18;
  return 0.14;
}

// ── 3-tier border system + 60-30-10 colour layering ─────────────────────────
// 60% — neutral dark canvas (the dark Carto basemap tiles).
// 30% — structural layer: resting territory borders in calm slate tones.
// 10% — the brightest accent (gold) is reserved STRICTLY for interaction:
//        glowing active/hovered borders, player-drawn vector paths, map pins.
// PRIMARY:   country/empire boundaries — always visible
// SECONDARY: province/region subdivisions — visible at zoom ≥ 5
// TERTIARY:  internal/historical divisions — visible at zoom ≥ 7
// All tiers use clean, solid strokes — no dashes — for crisp professional
// frontiers. Tiers differ only in weight/opacity/colour by zoom level.
const ACCENT_GOLD = '#f5d77f';
const BORDER_STYLES = {
  primary:   { weight: 2.0, color: '#cbd5e1', opacity: 0.72, dashArray: undefined as string | undefined },
  secondary: { weight: 1.25, color: '#94a3b8', opacity: 0.6, dashArray: undefined as string | undefined },
  tertiary:  { weight: 0.75, color: '#64748b', opacity: 0.42, dashArray: undefined as string | undefined },
} as const;
type BorderTier = keyof typeof BORDER_STYLES;

function getBorderOpacity(tier: BorderTier, zoom: number): number {
  if (tier === 'secondary' && zoom < 5) return 0;
  if (tier === 'tertiary'  && zoom < 7) return 0;
  return BORDER_STYLES[tier].opacity;
}

// Period strings in the dataset carry English era tokens ("476–1453 CE");
// swap them for the locale's notation without touching the numerals.
function localizePeriod(period: string, bceLabel: string, ceLabel: string): string {
  return period.replace(/\bBCE\b/g, bceLabel).replace(/\bCE\b/g, ceLabel);
}

// Year → locale-aware human label (negative = before common era).
function formatYear(y: number, bceLabel: string, ceLabel: string): string {
  const v = Math.round(y);
  return v < 0 ? `${Math.abs(v)} ${bceLabel}` : `${v} ${ceLabel}`;
}

// Animate a polygon border "drawing" itself via stroke-dashoffset, then settle
// into its intended dash pattern. Gives frontiers a premium hand-drawn sweep on
// load and whenever the time scrubber morphs territories.
function animateBorderDraw(pathEl: SVGPathElement, finalDash: string | undefined, durationMs = 1100) {
  let len = 0;
  try { len = pathEl.getTotalLength(); } catch { return; }
  if (!len || !Number.isFinite(len)) return;
  let settled = false;

  pathEl.style.transition = 'none';
  pathEl.style.strokeDasharray = `${len}`;
  pathEl.style.strokeDashoffset = `${len}`;
  pathEl.style.fillOpacity = '0';
  // Force a reflow so the starting state is committed before transitioning.
  void pathEl.getBoundingClientRect();

  pathEl.style.transition = `stroke-dashoffset ${durationMs}ms cubic-bezier(0.45,0,0.25,1), fill-opacity ${durationMs}ms ease-out`;
  pathEl.style.strokeDashoffset = '0';
  pathEl.style.fillOpacity = '1';

  const settle = () => {
    if (settled) return;
    settled = true;
    pathEl.style.transition = '';
    pathEl.style.strokeDashoffset = '';
    // Restore the intended stroke — solid for all tiers (finalDash is undefined).
    pathEl.style.strokeDasharray = finalDash ?? '';
    pathEl.removeEventListener('transitionend', settle);
  };
  pathEl.addEventListener('transitionend', settle);
  // Safety net in case transitionend never fires (detached node, reduced motion).
  setTimeout(settle, durationMs + 120);
}

// SVG-based professional marker icons
function makeMarkerIcon(
  marker: { name: string; type: MarkerType },
  activeStyle: string,
  translatedName?: string,
  hideLabel = false,
) {
  const isDark = activeStyle === 'dark' || activeStyle === 'military';
  const labelBg = isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.92)';
  const labelColor = isDark ? '#fff' : '#111';
  const label = translatedName ?? marker.name;

  let svgIcon = '';
  let anchorX = 10;
  let anchorY = 10;

  switch (marker.type) {
    case 'capital':
      // Gold star with drop shadow, 20px
      anchorX = 10;
      anchorY = 10;
      svgIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.7))">
        <polygon points="10,1 12.4,7.5 19.5,7.5 13.9,11.8 16.2,18.5 10,14.5 3.8,18.5 6.1,11.8 0.5,7.5 7.6,7.5" fill="#fbbf24" stroke="#92400e" stroke-width="0.8"/>
      </svg>`;
      break;

    case 'city':
      // Blue dot with white border, 14px
      anchorX = 7;
      anchorY = 7;
      svgIcon = `<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.6))">
        <circle cx="7" cy="7" r="6" fill="#60a5fa" stroke="white" stroke-width="2"/>
      </svg>`;
      break;

    case 'battle':
      // Red crossed swords (✕), 16px
      anchorX = 8;
      anchorY = 8;
      svgIcon = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.7))">
        <circle cx="8" cy="8" r="7.5" fill="#ef4444" stroke="#7f1d1d" stroke-width="0.8"/>
        <line x1="4" y1="4" x2="12" y2="12" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="12" y1="4" x2="4" y2="12" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
      </svg>`;
      break;

    case 'port':
      // Cyan anchor, 14px
      anchorX = 7;
      anchorY = 7;
      svgIcon = `<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.6))">
        <circle cx="7" cy="7" r="6.5" fill="#0e7490" stroke="#34d399" stroke-width="1"/>
        <text x="7" y="11" font-size="9" text-anchor="middle" fill="#34d399" font-family="serif" font-weight="bold">⚓</text>
      </svg>`;
      break;

    case 'resource':
      // Purple diamond, 13px
      anchorX = 6.5;
      anchorY = 6.5;
      svgIcon = `<svg width="13" height="13" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.6))">
        <polygon points="6.5,0.5 12.5,6.5 6.5,12.5 0.5,6.5" fill="#a78bfa" stroke="#5b21b6" stroke-width="0.8"/>
      </svg>`;
      break;

    case 'landmark':
      // Orange triangle/pyramid, 14px
      anchorX = 7;
      anchorY = 13;
      svgIcon = `<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.6))">
        <polygon points="7,1 13.5,13 0.5,13" fill="#f97316" stroke="#9a3412" stroke-width="0.8"/>
      </svg>`;
      break;
  }

  const labelHtml = hideLabel ? '' : `
    <div style="background:${labelBg};color:${labelColor};font-size:10px;font-weight:700;padding:1px 6px;border-radius:5px;white-space:nowrap;margin-top:2px;font-family:system-ui,sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.4);border:1px solid rgba(255,255,255,0.2)">${label}</div>
  `;

  return L.divIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer">
      ${svgIcon}
      ${labelHtml}
    </div>`,
    className: '',
    iconAnchor: [anchorX, anchorY],
    iconSize: undefined as unknown as L.PointExpression,
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TimelineMapPage() {
  const { t, language } = useLanguage();
  const { currentUser, refreshProgress } = useAuth();
  const { canTerritoryMap } = useSubscription();

  const [selected, setSelected]       = useState<TerritoryTopic | null>(null);
  const [mode, setMode]               = useState<MapMode>('explore');
  const [styleId, setStyleId]         = useState('dark');
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [layers, setLayers]           = useState<Record<LayerKey, boolean>>({
    territory: true, capitals: true, cities: true, battles: true, ports: true, resources: true, routes: true,
  });

  // ── Fog of war: regions stay strategically opaque until scouted ────────────
  const [explored, setExplored] = useState<Set<string>>(() => loadExplored(currentUser?.id));
  const markExplored = useCallback((topicId: string) => {
    setExplored(prev => {
      if (prev.has(topicId)) return prev;
      const next = new Set(prev);
      next.add(topicId);
      saveExplored(next, currentUser?.id);
      return next;
    });
  }, [currentUser?.id]);

  // ── Hover telemetry card ────────────────────────────────────────────────────
  const [hoverCard, setHoverCard] = useState<
    { x: number; y: number; telemetry: RegionTelemetry; locked: boolean } | null
  >(null);

  // ── Annotation engine ───────────────────────────────────────────────────────
  const [annMode, setAnnMode] = useState<AnnMode>('off');
  const annModeRef = useRef<AnnMode>('off');
  annModeRef.current = annMode;
  const [annotations, setAnnotations] = useState<MapAnnotations>(() => loadAnnotations(currentUser?.id));
  const annLayerRef = useRef<L.LayerGroup | null>(null);
  const drawingRef  = useRef<{ points: [number, number][]; line: L.Polyline | null }>({ points: [], line: null });

  // ── Semantic zoom: parchment grade fades in on the global overview ─────────
  const [lowZoom, setLowZoom] = useState(false);

  // ── Time scrubber: drag across history to morph territories ────────────────
  const chronoTopics = useMemo(
    () => [...TERRITORY_TOPICS].sort((a, b) => a.yearRange[0] - b.yearRange[0]),
    [],
  );
  const [minYear, maxYear] = useMemo(() => {
    let lo = Infinity, hi = -Infinity;
    for (const tp of TERRITORY_TOPICS) {
      lo = Math.min(lo, tp.yearRange[0]);
      hi = Math.max(hi, tp.yearRange[1]);
    }
    return [lo, hi];
  }, []);
  const [scrubYear, setScrubYear] = useState(minYear);

  // Resolve the topic that best matches a given year (nearest range; later
  // periods win ties so overlapping empires reveal the most recent state).
  const topicForYear = useCallback((year: number): TerritoryTopic => {
    let best = chronoTopics[0];
    let bestDist = Infinity;
    for (const tp of chronoTopics) {
      const [s, e] = tp.yearRange;
      const dist = year < s ? s - year : year > e ? year - e : 0;
      if (dist <= bestDist) { bestDist = dist; best = tp; }
    }
    return best;
  }, [chronoTopics]);

  function handleScrub(year: number) {
    setScrubYear(year);
    if (mode === 'quiz') return;
    const tp = topicForYear(year);
    if (tp && tp.id !== selected?.id) setSelected(tp);
  }

  // Keep the scrubber thumb in sync when a topic is picked from the list.
  useEffect(() => {
    if (!selected) return;
    const [s, e] = selected.yearRange;
    if (scrubYear < s || scrubYear > e) setScrubYear(Math.round((s + e) / 2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // Story mode
  const [storyIdx, setStoryIdx]       = useState(0);
  const [storyPlaying, setStoryPlaying] = useState(false);
  const storyTimerRef                 = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Quiz mode
  const [quizQuestion, setQuizQuestion] = useState<TerritoryQuizQuestion | null>(null);
  const [quizTopic, setQuizTopic]     = useState<TerritoryTopic | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [quizScore, setQuizScore]     = useState(0);
  const [quizTotal, setQuizTotal]     = useState(0);
  const usedQuestionIds               = useRef<Set<string>>(new Set());
  const sessionXpEarned               = useRef<number>(0);
  const MAX_SESSION_XP                = 500; // cap XP per session from map quiz

  // Map refs
  const mapRef            = useRef<L.Map | null>(null);
  const containerRef      = useRef<HTMLDivElement>(null);
  const tileRef           = useRef<L.TileLayer | null>(null);
  const layerGroupRef     = useRef<L.LayerGroup | null>(null);
  const storyMarkerRef    = useRef<L.Marker | null>(null);
  // Current zoom-based fill opacity
  const zoomOpacityRef    = useRef<number>(0.22);

  // ── Init map ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { center: [30, 20], zoom: 2, zoomControl: true, scrollWheelZoom: true });
    const style = CART_STYLES.find(s => s.id === 'dark')!;
    const tile = L.tileLayer(style.url, { attribution: style.attribution, maxZoom: 18 });
    tile.addTo(map);
    tileRef.current = tile;
    layerGroupRef.current = L.layerGroup().addTo(map);
    annLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    if (containerRef.current) containerRef.current.style.filter = style.filter;

    // ── Annotation input: pins on click, path vertices in draw mode ──────────
    map.on('click', (e: L.LeafletMouseEvent) => {
      const mode = annModeRef.current;
      if (mode === 'pin') {
        setAnnotations(prev => ({ ...prev, pins: [...prev.pins, { lat: e.latlng.lat, lng: e.latlng.lng, label: '' }] }));
      } else if (mode === 'draw') {
        const d = drawingRef.current;
        d.points.push([e.latlng.lat, e.latlng.lng]);
        if (!d.line) {
          d.line = L.polyline(d.points, { color: '#f5d77f', weight: 2.5, dashArray: '6,5', opacity: 0.9 }).addTo(map);
        } else {
          d.line.setLatLngs(d.points);
        }
      }
    });
    map.on('dblclick', () => {
      const d = drawingRef.current;
      if (annModeRef.current !== 'draw' || d.points.length < 2) return;
      const committed = d.points.slice(0, -1); // dblclick fires an extra click
      if (d.line) { map.removeLayer(d.line); d.line = null; }
      d.points = [];
      setAnnotations(prev => ({ ...prev, paths: [...prev.paths, committed.length >= 2 ? committed : []] .filter(p => p.length >= 2) }));
    });

    // Zoom event listener — update fill opacity and border tier visibility
    map.on('zoomend', () => {
      const zoom = map.getZoom();
      setLowZoom(zoom < 3.5);
      zoomOpacityRef.current = getFillOpacityForZoom(zoom);
      const lg = layerGroupRef.current;
      if (!lg) return;
      lg.eachLayer(layer => {
        if (!(layer instanceof L.Polygon)) return;
        const opts = layer.options as L.PathOptions & { _isFillPoly?: boolean; _borderTier?: BorderTier; _isCasing?: boolean; _isGlow?: boolean };
        if (opts._isCasing) {
          layer.setStyle({ opacity: getBorderOpacity(opts._borderTier ?? 'primary', zoom) * 0.65 });
          return;
        }
        if (opts._isGlow) {
          layer.setStyle({ opacity: getBorderOpacity(opts._borderTier ?? 'primary', zoom) > 0 ? 0.16 : 0 });
          return;
        }
        if (!opts._isFillPoly) return;
        const tier = opts._borderTier ?? 'primary';
        layer.setStyle({
          fillOpacity: zoomOpacityRef.current,
          opacity: getBorderOpacity(tier, zoom),
        });
        const pathEl = layer.getElement() as SVGPathElement | null;
        if (pathEl) {
          const color = (layer.options.fillColor as string) ?? '';
          const gId = `hfg-${color.replace('#', '')}`;
          const svg = pathEl.closest('svg');
          if (svg?.querySelector(`#${gId}`)) {
            pathEl.setAttribute('fill', `url(#${gId})`);
            pathEl.setAttribute('fill-opacity', '1');
          }
        }
      });
    });

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // ── Tile layer swap on style change ────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const style = CART_STYLES.find(s => s.id === styleId)!;
    if (tileRef.current) { map.removeLayer(tileRef.current); }
    const opts: L.TileLayerOptions = { attribution: style.attribution, maxZoom: 18 };
    if (style.subdomains) opts.subdomains = style.subdomains;
    const tile = L.tileLayer(style.url, opts);
    tile.addTo(map);
    tileRef.current = tile;
  }, [styleId]);

  // ── Grounded semantic zoom: compose the style filter with a parchment grade
  // that fades in smoothly on the global overview — no jarring state change.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const base = CART_STYLES.find(s => s.id === styleId)!.filter;
    el.style.transition = 'filter 700ms ease';
    el.style.filter = lowZoom
      ? `${base} sepia(0.38) saturate(0.82) brightness(1.05) contrast(0.93)`.trim()
      : base;
  }, [styleId, lowZoom]);

  // ── Annotation mode side-effects: draw mode must own double-click ──────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (annMode === 'draw') map.doubleClickZoom.disable();
    else map.doubleClickZoom.enable();
    // Abandon any in-progress sketch when leaving draw mode.
    if (annMode !== 'draw') {
      const d = drawingRef.current;
      if (d.line) { map.removeLayer(d.line); d.line = null; }
      d.points = [];
    }
  }, [annMode]);

  // ── Render + persist annotations (pins with editable labels, drawn paths) ──
  useEffect(() => {
    const lg = annLayerRef.current;
    if (!lg) return;
    lg.clearLayers();

    annotations.paths.forEach(path => {
      L.polyline(path, { color: '#f5d77f', weight: 2.5, dashArray: '6,5', opacity: 0.85 }).addTo(lg);
    });

    annotations.pins.forEach((pin, idx) => {
      const label = pin.label || t.tmap_ann_pin_default;
      const icon = L.divIcon({
        className: '',
        iconAnchor: [9, 24],
        html: `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer">
          <svg width="18" height="24" viewBox="0 0 18 24" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.7))">
            <path d="M9 0C4 0 0 4 0 9c0 6.5 9 15 9 15s9-8.5 9-15c0-5-4-9-9-9z" fill="#f5d77f" stroke="#92400e" stroke-width="1"/>
            <circle cx="9" cy="9" r="3.4" fill="#1a1a2e"/>
          </svg>
          <div style="background:rgba(0,0,0,0.85);color:#f5d77f;font-size:10px;font-weight:700;padding:1px 6px;border-radius:5px;white-space:nowrap;margin-top:1px;border:1px solid rgba(245,215,127,0.35)">${escapeHtml(label)}</div>
        </div>`,
      });
      const marker = L.marker([pin.lat, pin.lng], { icon, zIndexOffset: 2000 }).addTo(lg);
      marker.bindPopup(
        `<div class="tmap-pin-editor">
          <input type="text" value="${escapeHtml(pin.label)}" placeholder="${escapeHtml(t.tmap_ann_pin_default)}" maxlength="40" />
          <button data-act="save">✓</button>
          <button data-act="del">✕</button>
        </div>`,
        { className: 'tmap-popup-custom', closeButton: false }
      );
      marker.on('popupopen', e => {
        const el = e.popup.getElement();
        if (!el) return;
        const input = el.querySelector('input');
        const save  = el.querySelector('button[data-act="save"]');
        const del   = el.querySelector('button[data-act="del"]');
        save?.addEventListener('click', () => {
          const value = (input as HTMLInputElement | null)?.value?.trim() ?? '';
          setAnnotations(prev => ({ ...prev, pins: prev.pins.map((p, i) => i === idx ? { ...p, label: value } : p) }));
          marker.closePopup();
        });
        del?.addEventListener('click', () => {
          setAnnotations(prev => ({ ...prev, pins: prev.pins.filter((_, i) => i !== idx) }));
        });
        (input as HTMLInputElement | null)?.focus();
      });
    });

    saveAnnotations(annotations, currentUser?.id);
  }, [annotations, t.tmap_ann_pin_default, currentUser?.id]);

  // ── Render map layers when topic/layers/style changes ──────────────────────
  const renderLayers = useCallback(() => {
    const map = mapRef.current;
    const lg  = layerGroupRef.current;
    if (!map || !lg) return;
    // Crossfade the outgoing territory instead of a hard clear.
    fadeOutAndClear(lg);
    setHoverCard(null);

    if (!selected) return;

    const isExplored = explored.has(selected.id);
    const currentZoom = map.getZoom();
    zoomOpacityRef.current = getFillOpacityForZoom(currentZoom);

    // Polygons — strict 3-tier border system, clean solid strokes.
    // Unexplored territories render as fog: desaturated slate fill, details
    // withheld until the user scouts the region with a click.
    if (layers.territory && selected.polygons) {
      selected.polygons.forEach(poly => {
        const latlngs = poly.coords.map(([lat, lng]) => [lat, lng] as [number, number]);

        const tier = ((poly as unknown as { borderTier?: string }).borderTier ?? 'primary') as BorderTier;
        const border = BORDER_STYLES[tier];
        const currentZoom = mapRef.current?.getZoom() ?? 5;

        const fillColor = isExplored ? poly.color : '#64748b';
        const strokeColor  = border.color;
        const strokeWeight = border.weight;
        const strokeDash   = isExplored ? border.dashArray : '5,7';
        const strokeOpacity = getBorderOpacity(tier, currentZoom);

        // Atlas-grade double border: a wide, dark casing stroke sits beneath
        // the frontier line, separating it from busy basemap detail exactly
        // like the halo line-work in professional editorial cartography.
        const casing = L.polygon(latlngs, {
          color: '#0b1220',
          weight: strokeWeight + 2.6,
          opacity: Math.min(0.55, strokeOpacity + 0.1),
          fill: false,
          interactive: false,
          lineJoin: 'round',
          lineCap: 'round',
          smoothFactor: 0.4,
          ...({ _isCasing: true, _borderTier: tier } as object),
        } as L.PathOptions);
        casing.addTo(lg);

        // Soft inner glow in the territory's own colour between casing and
        // crisp frontier — the layered multi-stroke look of premium atlases.
        const glow = L.polygon(latlngs, {
          color: fillColor,
          weight: strokeWeight + 4,
          opacity: strokeOpacity > 0 ? 0.16 : 0,
          fill: false,
          interactive: false,
          lineJoin: 'round',
          lineCap: 'round',
          smoothFactor: 0.4,
          ...({ _isGlow: true, _borderTier: tier } as object),
        } as L.PathOptions);
        glow.addTo(lg);

        const mainPoly = L.polygon(latlngs, {
          color: strokeColor,
          weight: strokeWeight,
          opacity: strokeOpacity,
          fillColor,
          fillOpacity: zoomOpacityRef.current,
          lineJoin: 'round',
          lineCap: 'round',
          smoothFactor: 0.4,
          dashArray: strokeDash,
          ...({ _isFillPoly: true, _borderTier: tier } as object),
        } as L.PathOptions);

        // ── Hover telemetry portal card + 10%-accent glow ────────────────────
        // Telemetry is derived from raw data, then localized at the render
        // boundary: faction falls back to the translated topic title and
        // resource names resolve through the marker-name dictionary.
        const rawTelemetry = deriveTelemetry(selected, poly);
        const telemetry: RegionTelemetry = {
          ...rawTelemetry,
          faction: poly.label ? getTranslatedPolyLabel(poly.label, language) : getTitle(selected, language),
          resources: rawTelemetry.resources.map(n => getTranslatedMarkerName(n, language)),
        };
        mainPoly.on('mousemove', (e: L.LeafletMouseEvent) => {
          const pt = map.latLngToContainerPoint(e.latlng);
          setHoverCard({ x: pt.x, y: pt.y, telemetry, locked: !isExplored });
        });
        // Active border = the 10% accent tier: gold stroke + gold glow. Fogged
        // regions stay in the neutral structural scale even while hovered.
        mainPoly.on('mouseover', () => {
          const el = mainPoly.getElement() as SVGPathElement | null;
          if (el) el.style.filter = `drop-shadow(0 0 7px ${isExplored ? ACCENT_GOLD : '#94a3b8'})`;
          mainPoly.setStyle({ weight: strokeWeight + 0.9, color: isExplored ? ACCENT_GOLD : strokeColor });
        });
        mainPoly.on('mouseout', () => {
          const el = mainPoly.getElement() as SVGPathElement | null;
          if (el) el.style.filter = '';
          mainPoly.setStyle({ weight: strokeWeight, color: strokeColor });
          setHoverCard(null);
        });
        // Scouting: clicking an unexplored claim lifts its fog (annotation
        // tools take precedence over scouting while active).
        mainPoly.on('click', () => {
          if (annModeRef.current !== 'off') return;
          if (!explored.has(selected.id)) {
            markExplored(selected.id);
            toast.success(t.tmap_fog_scouted);
          }
        });
        mainPoly.addTo(lg);

        // Inject SVG radial gradient for subtle depth — inner area brighter, edges fade
        requestAnimationFrame(() => {
          const pathEl = mainPoly.getElement() as SVGPathElement | null;
          if (!pathEl) return;
          const svgContainer = pathEl.closest('svg') as SVGElement | null;
          if (!svgContainer) return;
          let defs = svgContainer.querySelector('defs');
          if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            svgContainer.prepend(defs);
          }
          const gId = `hfg-${fillColor.replace('#', '')}`;
          if (!defs.querySelector(`#${gId}`)) {
            const grad = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
            grad.setAttribute('id', gId);
            grad.setAttribute('cx', '40%');
            grad.setAttribute('cy', '35%');
            grad.setAttribute('r', '65%');
            const s1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            s1.setAttribute('offset', '0%');
            s1.setAttribute('stop-color', fillColor);
            s1.setAttribute('stop-opacity', '0.42');
            const s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            s2.setAttribute('offset', '100%');
            s2.setAttribute('stop-color', fillColor);
            s2.setAttribute('stop-opacity', '0.10');
            grad.append(s1, s2);
            defs.appendChild(grad);
          }
          pathEl.setAttribute('fill', `url(#${gId})`);
          pathEl.setAttribute('fill-opacity', '1');

          // Sweep the frontier in on load / on morph.
          animateBorderDraw(pathEl, strokeDash);
        });

        // ── Biome-sensitive shading: era-keyed fractal-noise texture overlay ─
        if (isExplored) {
          const tex = ERA_TEXTURES[selected.era];
          const texPoly = L.polygon(latlngs, {
            stroke: false,
            fillColor: tex.tint,
            fillOpacity: tex.opacity,
            interactive: false,
            smoothFactor: 0.5,
          });
          texPoly.addTo(lg);
          requestAnimationFrame(() => {
            const texEl = texPoly.getElement() as SVGPathElement | null;
            const svgContainer = texEl?.closest('svg') as SVGElement | null;
            if (!texEl || !svgContainer) return;
            const patternId = ensureEraTexturePattern(svgContainer, tex);
            texEl.setAttribute('fill', `url(#${patternId})`);
            texEl.setAttribute('fill-opacity', String(tex.opacity * 4));
          });
        }
      });
    }

    // Routes — supply networks stay hidden under fog until the region is scouted
    if (layers.routes && selected.routes && isExplored) {
      selected.routes.forEach(route => {
        const color = route.type === 'trade' ? '#f59e0b' : route.type === 'military' ? '#ef4444' : '#a78bfa';
        const dash  = route.type === 'trade' ? '8,6' : route.type === 'religious' ? '4,8' : undefined;
        L.polyline(route.points.map(([lat, lng]) => [lat, lng] as [number, number]), {
          color: route.color ?? color,
          weight: 2.5,
          dashArray: dash,
          opacity: 0.8,
        }).bindPopup(
          `<strong style="overflow-wrap:break-word">${escapeHtml(getTranslatedMarkerName(route.name, language))}</strong><br/><em style="font-size:11px;color:#888">${escapeHtml(getTranslatedMarkerType(route.type, language))}</em>`
        ).addTo(lg);
      });

      // Pulsing chokepoints where supply lines cross — tactical bottlenecks.
      computeChokepoints(selected.routes).forEach(cp => {
        const icon = L.divIcon({
          className: '',
          iconAnchor: [9, 9],
          html: '<div class="tmap-choke"><div class="tmap-choke-core"></div></div>',
        });
        L.marker([cp.lat, cp.lng], { icon, zIndexOffset: 900 })
          .bindTooltip(
            `<div style="font-family:system-ui,sans-serif"><div style="font-weight:700;font-size:11px">${t.tmap_chokepoint}</div><div style="font-size:10px;color:#aaa">${escapeHtml(cp.routeA)} × ${escapeHtml(cp.routeB)}</div></div>`,
            { className: 'leaflet-tooltip-rich', direction: 'top' }
          )
          .addTo(lg);
      });
    }

    // Markers — compute which labels to hide due to proximity
    const typeVisible: Record<MarkerType, LayerKey> = {
      capital: 'capitals', city: 'cities', battle: 'battles',
      port: 'ports', resource: 'resources', landmark: 'cities',
    };

    // Filter to visible markers first — all withheld while the region is fogged
    const visibleMarkers = isExplored ? selected.markers.filter(m => layers[typeVisible[m.type]]) : [];

    // Determine which markers should hide their label due to proximity (within 0.5°)
    const hideLabelSet = new Set<number>();
    for (let i = 0; i < visibleMarkers.length; i++) {
      for (let j = i + 1; j < visibleMarkers.length; j++) {
        const a = visibleMarkers[i];
        const b = visibleMarkers[j];
        const latDiff = Math.abs(a.lat - b.lat);
        const lngDiff = Math.abs(a.lng - b.lng);
        if (latDiff < 0.5 && lngDiff < 0.5) {
          // Hide the less-important one
          const prioA = MARKER_PRIORITY[a.type];
          const prioB = MARKER_PRIORITY[b.type];
          if (prioA >= prioB) {
            hideLabelSet.add(j);
          } else {
            hideLabelSet.add(i);
          }
        }
      }
    }

    visibleMarkers.forEach((m, idx) => {
      const tName = getTranslatedMarkerName(m.name, language);
      const tNote = getTranslatedMarkerNote(m.name, m.note, language);
      const tType = getTranslatedMarkerType(m.type, language);
      const color = MARKER_COLORS[m.type];
      const yearStr = m.year ? formatYear(m.year, t.year_bce, t.year_ce) : '';

      const marker = L.marker([m.lat, m.lng], {
        icon: makeMarkerIcon(m, styleId, tName, hideLabelSet.has(idx)),
        zIndexOffset: MARKER_PRIORITY[m.type] * 100,
      })
        .bindPopup(`
          <div style="
            min-width:190px;
            background:#1a1a2e;
            color:#e2e8f0;
            border-radius:10px;
            overflow:hidden;
            font-family:system-ui,sans-serif;
            border:1px solid rgba(255,255,255,0.12);
            box-shadow:0 8px 24px rgba(0,0,0,0.5);
          ">
            <div style="
              background:${color}22;
              border-bottom:1px solid ${color}44;
              padding:6px 10px;
              display:flex;
              align-items:center;
              gap:6px;
            ">
              <span style="
                background:${color};
                color:#000;
                font-size:9px;
                font-weight:800;
                text-transform:uppercase;
                letter-spacing:0.08em;
                padding:2px 7px;
                border-radius:20px;
              ">${tType}</span>
              ${yearStr ? `<span style="font-size:10px;color:${color};margin-left:auto;font-weight:600">${yearStr}</span>` : ''}
            </div>
            <div style="padding:8px 10px">
              <div style="font-size:13px;font-weight:700;color:#f1f5f9;margin-bottom:4px;line-height:1.3">${tName}</div>
              ${m.note ? `<div style="font-size:11px;color:#94a3b8;line-height:1.5">${tNote}</div>` : ''}
            </div>
          </div>
        `, {
          className: 'tmap-popup-custom',
        })
        .addTo(lg);
      (marker as unknown as { _tmapType: string })._tmapType = m.type;
    });
  }, [selected, layers, styleId, language, explored, markExplored, t]);

  useEffect(() => {
    renderLayers();
  }, [renderLayers]);

  // Fly to topic on selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selected) return;
    map.flyTo(selected.center, selected.zoom, { duration: 1.4, easeLinearity: 0.3 });
    setStoryIdx(0);
    setStoryPlaying(false);
    if (mode === 'quiz') startNewQuiz(selected);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // ── Story mode ──────────────────────────────────────────────────────────────
  const storyMarkers = selected?.markers ?? [];

  useEffect(() => {
    if (mode !== 'story' || !selected || storyMarkers.length === 0) return;
    const m = storyMarkers[storyIdx];
    const map = mapRef.current;
    if (!map) return;

    if (storyMarkerRef.current) { map.removeLayer(storyMarkerRef.current); storyMarkerRef.current = null; }

    const marker = L.marker([m.lat, m.lng], { icon: makeMarkerIcon(m, styleId), zIndexOffset: 1000 })
      .addTo(map);
    marker.openPopup();
    storyMarkerRef.current = marker;
    map.flyTo([m.lat, m.lng], Math.max(selected.zoom, 6), { duration: 1.0 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyIdx, mode]);

  useEffect(() => {
    if (storyTimerRef.current) clearTimeout(storyTimerRef.current);
    if (storyPlaying && mode === 'story' && storyMarkers.length > 0) {
      storyTimerRef.current = setTimeout(() => {
        setStoryIdx(i => (i + 1) % storyMarkers.length);
      }, 4500);
    }
    return () => { if (storyTimerRef.current) clearTimeout(storyTimerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyPlaying, storyIdx, mode]);

  // ── Quiz mode ────────────────────────────────────────────────────────────────
  function startNewQuiz(topic?: TerritoryTopic | null) {
    const pool = topic ? [topic] : TERRITORY_TOPICS;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setQuizTopic(pick);
    const allQuestions = getQuestionsForTopic(pick.id);
    // Filter out already-used questions; if all used, reset for this topic
    let available = allQuestions.filter(q => !usedQuestionIds.current.has(q.id));
    if (available.length === 0) {
      // Reset used IDs for this topic only
      allQuestions.forEach(q => usedQuestionIds.current.delete(q.id));
      available = allQuestions;
    }
    const q = available[Math.floor(Math.random() * available.length)];
    if (q) usedQuestionIds.current.add(q.id);
    setQuizQuestion(q ?? null);
    setQuizAnswered(null);

    const map = mapRef.current;
    const lg = layerGroupRef.current;
    if (!map || !lg) return;
    lg.clearLayers();
    if (pick.polygons) {
      pick.polygons.forEach(poly => {
        const latlngs = poly.coords.map(([lat, lng]) => [lat, lng] as [number, number]);
        L.polygon(latlngs, { color: '#6366f1', weight: 2.5, fillColor: '#6366f1', fillOpacity: 0.35 }).addTo(lg);
      });
    }
    map.flyTo(pick.center, pick.zoom, { duration: 1.2 });
  }

  function handleQuizAnswer(idx: number) {
    if (quizAnswered !== null || !quizQuestion) return;
    setQuizAnswered(idx);
    setQuizTotal(q => q + 1);
    const correct = idx === quizQuestion.correctIndex;
    if (correct) {
      setQuizScore(s => s + 1);
      if (currentUser && sessionXpEarned.current < MAX_SESSION_XP) {
        const xpGain = Math.min(50, MAX_SESSION_XP - sessionXpEarned.current);
        sessionXpEarned.current += xpGain;
        addBonusXp(currentUser.id, xpGain, 'Map Quiz');
        refreshProgress();
      }
      toast.success(t.tmap_quiz_correct);
    } else {
      toast.error(t.tmap_quiz_wrong);
    }
  }

  // Mode switch cleanup
  useEffect(() => {
    setStoryPlaying(false);
    setStoryIdx(0);
    if (storyMarkerRef.current && mapRef.current) {
      mapRef.current.removeLayer(storyMarkerRef.current);
      storyMarkerRef.current = null;
    }
    if (mode === 'quiz') startNewQuiz(selected);
    else renderLayers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const eras = ['ancient', 'medieval', 'early-modern', 'modern'] as const;
  const currentStyle = CART_STYLES.find(s => s.id === styleId)!;

  const storyCurrentMarker = storyMarkers[storyIdx];

  if (!canTerritoryMap()) {
    return (
      <AppShell>
        <div className="max-w-lg mx-auto py-20">
          <UpgradePrompt
            title={t.tmap_pro_only}
            description={`${t.tmap_territories_hint}`}
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell compact>
      <div className="h-full flex overflow-hidden">

        {/* ════════════════════════════════════════════════════
            LEFT PANEL
        ════════════════════════════════════════════════════ */}
        <div className="w-60 sm:w-72 shrink-0 border-r border-border bg-card/95 backdrop-blur-sm flex flex-col overflow-hidden z-10">

          {/* Header */}
          <div className="px-3 pt-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2 mb-0.5">
              <MapIcon className="w-4 h-4 text-primary shrink-0" />
              <h1 className="font-heading font-bold text-sm leading-tight">{t.tmap_title}</h1>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">{t.tmap_subtitle}</p>

            {/* Mode selector */}
            <div className="flex gap-1 mt-2">
              {(['explore', 'story', 'quiz'] as MapMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn('flex-1 text-[10px] font-semibold py-1 rounded-md transition-all capitalize', mode === m ? 'bg-primary text-primary-foreground' : 'bg-muted/40 text-muted-foreground hover:bg-muted/70')}
                >
                  {m === 'explore' ? t.tmap_explore : m === 'story' ? t.tmap_story : t.tmap_quiz}
                </button>
              ))}
            </div>
          </div>

          {/* Quiz score strip */}
          {mode === 'quiz' && quizTotal > 0 && (
            <div className="px-3 py-2 bg-primary/5 border-b border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t.tmap_quiz_score}</span>
              <span className="font-bold text-primary">{quizScore}/{quizTotal}</span>
            </div>
          )}

          {/* Topic list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            {eras.map(era => {
              const topics = TERRITORY_TOPICS.filter(tp => tp.era === era);
              return (
                <div key={era}>
                  <p className={cn('text-[10px] font-bold uppercase tracking-widest px-2 pb-1', ERA_COLORS[era])}>
                    {ERA_LABELS[era][language]}
                  </p>
                  <div className="space-y-0.5">
                    {topics.map(topic => {
                      const isActive = selected?.id === topic.id;
                      return (
                        <button
                          key={topic.id}
                          onClick={() => setSelected(isActive && mode !== 'quiz' ? null : topic)}
                          className={cn(
                            'w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all flex items-center gap-2 group',
                            isActive
                              ? cn('font-semibold border', ERA_COLORS[era], ERA_BG[era], ERA_BORDER[era])
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                          )}
                        >
                          <ChevronRight className={cn('w-3 h-3 shrink-0 transition-transform', isActive ? 'rotate-90' : 'group-hover:translate-x-0.5')} />
                          <span className="leading-snug flex-1">{getTitle(topic, language)}</span>
                          {topic.markers.length > 0 && (
                            <span className="text-[9px] text-muted-foreground/60 shrink-0">{topic.markers.length}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Layer legend */}
          {selected && mode === 'explore' && (
            <div className="px-3 py-2 border-t border-border">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">{t.tmap_layers}</p>
              <div className="grid grid-cols-2 gap-0.5">
                {(Object.entries(MARKER_COLORS) as [MarkerType, string][]).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span style={{ color, fontSize: 11 }}>{MARKER_ICONS[type]}</span>
                    <span className="capitalize">{getTranslatedMarkerType(type, language)}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span style={{ color: '#f59e0b', fontSize: 11 }}>─ ─</span>
                  <span className="capitalize">{getTranslatedMarkerType('trade', language)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span style={{ color: '#ef4444', fontSize: 11 }}>───</span>
                  <span className="capitalize">{getTranslatedMarkerType('military', language)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════
            MAP PANEL
        ════════════════════════════════════════════════════ */}
        <div className="flex-1 relative">

          {/* Leaflet container */}
          <div ref={containerRef} className="absolute inset-0 z-0" />

          {/* ── TOP-RIGHT: Style + Layer controls ──────────── */}
          <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2 items-end">

            {/* Style switcher button */}
            <div className="relative">
              <button
                onClick={() => { setShowStylePanel(s => !s); setShowLayerPanel(false); }}
                className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15 shadow-lg hover:bg-black/90 transition-all"
              >
                <Palette className="w-3.5 h-3.5" />
                {(t as Record<string, string>)[currentStyle.nameKey] ?? currentStyle.nameKey}
                <ChevronDown className={cn('w-3 h-3 transition-transform', showStylePanel ? 'rotate-180' : '')} />
              </button>

              {showStylePanel && (
                <div className="absolute top-8 right-0 bg-black/90 backdrop-blur-md rounded-xl border border-white/15 shadow-xl overflow-hidden min-w-[160px]">
                  {CART_STYLES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => { setStyleId(s.id); setShowStylePanel(false); }}
                      className={cn('w-full text-left text-xs px-3 py-2 transition-colors flex items-center gap-2', styleId === s.id ? 'bg-primary/30 text-primary font-semibold' : 'text-white/80 hover:bg-white/10')}
                    >
                      {styleId === s.id && <span className="text-primary">✓</span>}
                      {(t as Record<string, string>)[s.nameKey] ?? s.id}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Layer toggle button */}
            {selected && mode === 'explore' && (
              <div className="relative">
                <button
                  onClick={() => { setShowLayerPanel(s => !s); setShowStylePanel(false); }}
                  className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15 shadow-lg hover:bg-black/90 transition-all"
                >
                  <Layers className="w-3.5 h-3.5" />
                  {t.tmap_layers}
                  <ChevronDown className={cn('w-3 h-3 transition-transform', showLayerPanel ? 'rotate-180' : '')} />
                </button>

                {showLayerPanel && (
                  <div className="absolute top-8 right-0 bg-black/90 backdrop-blur-md rounded-xl border border-white/15 shadow-xl p-3 min-w-[210px] space-y-2.5">
                    <button onClick={() => setShowLayerPanel(false)} className="absolute top-2 right-2 text-white/40 hover:text-white"><X className="w-3 h-3" /></button>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">{t.tmap_layers}</p>
                    {FILTER_MATRIX.map(cat => {
                      const colors: Record<LayerKey, string> = {
                        territory: '#6366f1', capitals: '#fbbf24', cities: '#60a5fa',
                        battles: '#ef4444', ports: '#34d399', resources: '#a78bfa', routes: '#f59e0b',
                      };
                      const CatIcon = cat.labelKey === 'tmap_cat_assets' ? Shield
                        : cat.labelKey === 'tmap_cat_diplomatic' ? Anchor
                        : cat.labelKey === 'tmap_cat_resources' ? Wheat : Swords;
                      const allOn = cat.keys.every(k => layers[k]);
                      return (
                        <div key={cat.labelKey}>
                          <button
                            onClick={() => setLayers(l => {
                              const next = { ...l };
                              cat.keys.forEach(k => { next[k] = !allOn; });
                              return next;
                            })}
                            className={cn('w-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider rounded-md px-1.5 py-1 transition-all', allOn ? 'text-white/85' : 'text-white/35')}
                          >
                            <CatIcon className="w-3 h-3 shrink-0" />
                            {t[cat.labelKey]}
                          </button>
                          <div className="pl-3 space-y-0.5 mt-0.5">
                            {cat.keys.map(key => {
                              const on = layers[key];
                              const label = (t as Record<string, string>)[`tmap_layer_${key}`] ?? key;
                              return (
                                <button
                                  key={key}
                                  onClick={() => setLayers(l => ({ ...l, [key]: !l[key] }))}
                                  className={cn('w-full flex items-center gap-2.5 text-xs rounded-md px-2 py-1 transition-all', on ? 'text-white' : 'text-white/30')}
                                >
                                  <div className="w-3 h-3 rounded-sm border-2 flex items-center justify-center shrink-0 transition-all" style={{ borderColor: colors[key], background: on ? colors[key] : 'transparent' }}>
                                    {on && <span style={{ fontSize: 8, color: 'white' }}>✓</span>}
                                  </div>
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Annotation toolbar: pins, freehand paths, clear ─────────── */}
            {mode === 'explore' && (
              <div className="flex flex-col gap-1 bg-black/80 backdrop-blur-md rounded-full border border-white/15 shadow-lg p-1">
                <button
                  title={t.tmap_ann_pin}
                  onClick={() => setAnnMode(m => m === 'pin' ? 'off' : 'pin')}
                  className={cn('w-7 h-7 rounded-full flex items-center justify-center transition-all', annMode === 'pin' ? 'bg-primary text-primary-foreground' : 'text-white/70 hover:text-white hover:bg-white/10')}
                >
                  <MapPinIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  title={t.tmap_ann_draw}
                  onClick={() => setAnnMode(m => m === 'draw' ? 'off' : 'draw')}
                  className={cn('w-7 h-7 rounded-full flex items-center justify-center transition-all', annMode === 'draw' ? 'bg-primary text-primary-foreground' : 'text-white/70 hover:text-white hover:bg-white/10')}
                >
                  <PenLine className="w-3.5 h-3.5" />
                </button>
                {(annotations.pins.length > 0 || annotations.paths.length > 0) && (
                  <button
                    title={t.tmap_ann_clear}
                    onClick={() => { setAnnotations({ pins: [], paths: [] }); setAnnMode('off'); }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── HOVER TELEMETRY PORTAL CARD ──────────────── */}
          {hoverCard && mode === 'explore' && (
            <div
              className="absolute z-[1100] pointer-events-none"
              style={{
                left: Math.min(hoverCard.x + 14, window.innerWidth - 300),
                top: Math.max(hoverCard.y - 10, 8),
              }}
            >
              <div className="bg-black/90 backdrop-blur-md text-white rounded-xl border border-white/15 shadow-2xl px-3 py-2.5 w-[220px] text-xs">
                {hoverCard.locked ? (
                  <div className="flex items-center gap-2 text-white/70">
                    <Eye className="w-4 h-4 text-primary shrink-0" />
                    <span className="leading-snug">{t.tmap_fog_locked}</span>
                  </div>
                ) : (
                  <>
                    <div className="font-bold text-[12px] leading-snug mb-1.5 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{hoverCard.telemetry.faction}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white/50">{t.tmap_tel_garrison}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden max-w-[80px]">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${hoverCard.telemetry.garrison}%` }} />
                        </div>
                        <span className="tabular-nums text-white/85 font-semibold">{hoverCard.telemetry.garrison}</span>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-white/50 shrink-0">{t.tmap_tel_resources}</span>
                        <span className="text-right text-white/85 leading-snug min-w-0 break-words">
                          {hoverCard.telemetry.resources.length > 0 ? hoverCard.telemetry.resources.join(', ') : t.tmap_tel_none}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white/50">{t.tmap_tel_battles}</span>
                        <span className="text-white/85 tabular-nums font-semibold">{hoverCard.telemetry.battles}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white/50">{t.tmap_tel_hazard}</span>
                        <span className="flex items-center gap-1 text-amber-300">
                          <AlertTriangle className="w-3 h-3" />
                          {(t as Record<string, string>)[hoverCard.telemetry.hazard]}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── SELECTED TOPIC INFO (top-left below header) ─ */}
          {selected && mode === 'explore' && (
            <div className="absolute top-3 left-3 max-w-[240px] z-[1000] bg-black/80 backdrop-blur-md text-white p-3 rounded-xl text-xs shadow-xl border border-white/10 pointer-events-none">
              <div className={cn('text-[9px] font-bold uppercase tracking-widest mb-1', ERA_COLORS[selected.era])}>
                {ERA_LABELS[selected.era][language]} · {localizePeriod(selected.period, t.year_bce, t.year_ce)}
              </div>
              <p className="font-bold text-sm leading-snug mb-1">{getTitle(selected, language)}</p>
              <p className="text-white/70 leading-relaxed text-[11px]">{getTranslatedTerritoryDesc(selected.id, language) ?? selected.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge variant="outline" className="text-[9px] border-white/20 text-white/60 h-4 px-1.5">
                  {selected.markers.length} {t.tmap_markers}
                </Badge>
                {selected.polygons && (
                  <Badge variant="outline" className="text-[9px] border-white/20 text-white/60 h-4 px-1.5">
                    {t.tmap_layer_territory}
                  </Badge>
                )}
                {selected.routes && (
                  <Badge variant="outline" className="text-[9px] border-white/20 text-white/60 h-4 px-1.5">
                    {selected.routes.length} {t.tmap_layer_routes}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* ── STORY MODE PANEL ─────────────────────────── */}
          {mode === 'story' && selected && storyCurrentMarker && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-lg bg-black/85 backdrop-blur-md text-white p-4 rounded-2xl border border-white/15 shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-base border-2 border-white/30"
                  style={{ background: MARKER_COLORS[storyCurrentMarker.type] + '33', borderColor: MARKER_COLORS[storyCurrentMarker.type] }}>
                  {MARKER_ICONS[storyCurrentMarker.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-sm truncate">{getTranslatedMarkerName(storyCurrentMarker.name, language)}</span>
                    {storyCurrentMarker.year && (
                      <span className="text-white/50 text-[10px] shrink-0">
                        {formatYear(storyCurrentMarker.year, t.year_bce, t.year_ce)}
                      </span>
                    )}
                  </div>
                  <p className="text-white/75 text-xs leading-relaxed">{getTranslatedMarkerNote(storyCurrentMarker.name, storyCurrentMarker.note, language) || getTranslatedMarkerName(storyCurrentMarker.name, language)}</p>
                  <p className="text-white/30 text-[10px] mt-1">{storyIdx + 1} / {storyMarkers.length}</p>
                </div>
              </div>
              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mt-3">
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-white/70 hover:text-white hover:bg-white/10" onClick={() => setStoryIdx(i => (i - 1 + storyMarkers.length) % storyMarkers.length)}>
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button size="sm" className="h-8 px-5 gap-2 text-xs" onClick={() => setStoryPlaying(p => !p)}>
                  {storyPlaying ? <><Pause className="w-3.5 h-3.5" />{t.tmap_story_pause}</> : <><Play className="w-3.5 h-3.5" />{t.tmap_story_play}</>}
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-white/70 hover:text-white hover:bg-white/10" onClick={() => setStoryIdx(i => (i + 1) % storyMarkers.length)}>
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
              {/* Progress bar */}
              <div className="h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${((storyIdx + 1) / storyMarkers.length) * 100}%` }} />
              </div>
            </div>
          )}

          {/* Story mode — no topic selected */}
          {mode === 'story' && !selected && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
              <div className="bg-black/70 backdrop-blur-sm text-white text-sm px-5 py-4 rounded-2xl text-center border border-white/15 shadow-xl max-w-xs">
                <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold mb-1">{t.tmap_story}</p>
                <p className="text-white/60 text-xs">{t.tmap_select_topic}</p>
              </div>
            </div>
          )}

          {/* ── QUIZ MODE PANEL ──────────────────────────── */}
          {mode === 'quiz' && quizTopic && quizQuestion && (() => {
            const tq = getTranslatedTerritoryQuestion(quizQuestion, language);
            return (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-[92%] max-w-lg bg-black/88 backdrop-blur-md text-white p-4 rounded-2xl border border-white/15 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                  <p className="font-semibold text-sm leading-snug flex-1 min-w-0 break-words">{tq.question}</p>
                  {quizTotal > 0 && <span className="ml-auto shrink-0 text-xs text-white/50">{quizScore}/{quizTotal}</span>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {tq.options.map((opt, idx) => {
                    const isCorrect = idx === quizQuestion.correctIndex;
                    const isSelected = quizAnswered === idx;
                    let cls = 'border-white/20 hover:border-white/50 hover:bg-white/10 text-white/80';
                    if (quizAnswered !== null) {
                      if (isCorrect) cls = 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold';
                      else if (isSelected) cls = 'border-red-500 bg-red-500/15 text-red-300';
                      else cls = 'border-white/10 text-white/30';
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={quizAnswered !== null}
                        className={cn('border rounded-xl text-xs font-medium px-3 py-2.5 text-left transition-all leading-snug', cls)}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quizAnswered !== null && (
                  <>
                    <p className="text-xs text-white/60 mt-3 leading-relaxed italic">{tq.explanation}</p>
                    <Button size="sm" className="w-full mt-2 gap-2" onClick={() => startNewQuiz(selected ?? undefined)}>
                      <Trophy className="w-3.5 h-3.5" />{t.tmap_quiz_next}
                    </Button>
                  </>
                )}
              </div>
            );
          })()}

          {/* Hint when nothing selected in explore mode */}
          {!selected && mode === 'explore' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
              <div className="bg-black/65 backdrop-blur-sm text-white text-sm px-5 py-4 rounded-2xl text-center border border-white/15 shadow-xl max-w-xs">
                <MapIcon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold mb-1">{t.tmap_select_topic}</p>
                <p className="text-white/55 text-xs">{t.tmap_territories_hint}</p>
              </div>
            </div>
          )}

          {/* ── TIME SCRUBBER ────────────────────────────── */}
          {mode === 'explore' && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-[94%] max-w-2xl">
              <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 truncate">
                      {t.tmap_timeline}
                    </span>
                  </div>
                  <span className="font-heading font-bold text-primary text-base tabular-nums shrink-0">{formatYear(scrubYear, t.year_bce, t.year_ce)}</span>
                </div>
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  step={10}
                  value={scrubYear}
                  onChange={e => handleScrub(Number(e.target.value))}
                  className="tmap-scrubber w-full"
                  aria-label={t.tmap_timeline}
                />
                <div className="flex items-center justify-between mt-1.5 text-[9px] text-white/40 tabular-nums">
                  <span className="shrink-0">{formatYear(minYear, t.year_bce, t.year_ce)}</span>
                  {selected && (
                    <span className="text-white/75 font-semibold truncate px-2 max-w-[60%]">
                      {getTitle(selected, language)} · {localizePeriod(selected.period, t.year_bce, t.year_ce)}
                    </span>
                  )}
                  <span className="shrink-0">{formatYear(maxYear, t.year_bce, t.year_ce)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global styles for custom Leaflet elements */}
      <style>{`
        .leaflet-tooltip-rich {
          background: rgba(15, 15, 30, 0.95) !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          border-radius: 8px !important;
          padding: 6px 10px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5) !important;
          color: #e2e8f0 !important;
          font-family: system-ui, sans-serif !important;
          pointer-events: none !important;
        }
        .leaflet-tooltip-rich::before {
          display: none !important;
        }
        .tmap-popup-custom .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          border-radius: 10px !important;
          overflow: hidden !important;
        }
        .tmap-popup-custom .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .tmap-popup-custom .leaflet-popup-tip-container {
          display: none !important;
        }
        /* Pulsing chokepoint vector — supply-line intersections */
        .tmap-choke {
          width: 18px; height: 18px; position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .tmap-choke::before {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          border: 2px solid rgba(245, 158, 11, 0.8);
          animation: tmapChokePulse 1.8s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .tmap-choke-core {
          width: 7px; height: 7px; border-radius: 50%;
          background: #f59e0b; box-shadow: 0 0 8px rgba(245,158,11,0.9);
        }
        @keyframes tmapChokePulse {
          0%   { transform: scale(0.6); opacity: 1; }
          80%  { transform: scale(1.9); opacity: 0; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        /* Annotation pin label editor popup */
        .tmap-pin-editor {
          display: flex; gap: 4px; align-items: center;
          background: #1a1a2e; border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px; padding: 6px 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .tmap-pin-editor input {
          background: rgba(255,255,255,0.08); color: #f1f5f9;
          border: 1px solid rgba(255,255,255,0.15); border-radius: 6px;
          font-size: 11px; padding: 3px 7px; width: 130px; outline: none;
        }
        .tmap-pin-editor input:focus { border-color: rgba(245,215,127,0.6); }
        .tmap-pin-editor button {
          border: none; border-radius: 6px; width: 22px; height: 22px;
          font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        .tmap-pin-editor button[data-act="save"] { background: rgba(52,211,153,0.2); color: #34d399; }
        .tmap-pin-editor button[data-act="del"]  { background: rgba(239,68,68,0.18); color: #f87171; }
        .tmap-scrubber {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(212,175,55,0.75), rgba(212,175,55,0.2));
          outline: none;
          cursor: pointer;
        }
        .tmap-scrubber::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f5d77f;
          border: 2px solid #1a1a2e;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.35), 0 2px 6px rgba(0,0,0,0.5);
          cursor: pointer;
          transition: transform 0.12s ease;
        }
        .tmap-scrubber::-webkit-slider-thumb:hover { transform: scale(1.18); }
        .tmap-scrubber::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f5d77f;
          border: 2px solid #1a1a2e;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.35), 0 2px 6px rgba(0,0,0,0.5);
          cursor: pointer;
        }
      `}</style>
    </AppShell>
  );
}
