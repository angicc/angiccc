import { useState, useEffect, useRef, useCallback } from 'react';
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
import { getTranslatedMarkerName, getTranslatedMarkerNote, getTranslatedMarkerType } from '@/i18n/territoryMarkerTranslations';
import {
  Map as MapIcon, ChevronRight, Layers, Palette, BookOpen, HelpCircle, Play, Pause,
  SkipBack, SkipForward, ChevronDown, X, Trophy, Swords, Building2, Anchor, Gem, Landmark,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// ─── Constants ────────────────────────────────────────────────────────────────

const ERA_COLORS = { ancient: 'text-amber-400', medieval: 'text-blue-400', 'early-modern': 'text-emerald-400', modern: 'text-rose-400' } as const;
const ERA_BG    = { ancient: 'bg-amber-400/10', medieval: 'bg-blue-400/10', 'early-modern': 'bg-emerald-400/10', modern: 'bg-rose-400/10' } as const;
const ERA_BORDER= { ancient: 'border-amber-400/40', medieval: 'border-blue-400/40', 'early-modern': 'border-emerald-400/40', modern: 'border-rose-400/40' } as const;

const ERA_LABELS: Record<string, Record<Language, string>> = {
  ancient:        { en: 'Ancient World',  es: 'Mundo Antiguo',          ru: 'Древний Мир',          mk: 'Античко Доба' },
  medieval:       { en: 'Middle Ages',    es: 'Edad Media',              ru: 'Средние Века',          mk: 'Среден Век' },
  'early-modern': { en: 'Early Modern',   es: 'Época Moderna Temprana',  ru: 'Раннее Новое Время',   mk: 'Рано Модерно Доба' },
  modern:         { en: 'Modern Era',     es: 'Era Moderna',             ru: 'Современная Эпоха',    mk: 'Модерна Ера' },
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
    id: 'parchment',
    nameKey: 'tmap_style_parchment',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    filter: 'sepia(75%) brightness(0.85) contrast(0.88) saturate(0.8)',
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

// Get fill opacity based on zoom level
function getFillOpacityForZoom(zoom: number): number {
  if (zoom < 3) return 0.30;
  if (zoom <= 4) return 0.25;
  if (zoom <= 5) return 0.20;
  if (zoom <= 7) return 0.15;
  return 0.10;
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
  // Glow layer ref for selected territory pulse effect
  const glowLayerRef      = useRef<L.Polygon[] | null>(null);
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
    mapRef.current = map;

    // Zoom event listener for opacity changes
    map.on('zoomend', () => {
      const zoom = map.getZoom();
      zoomOpacityRef.current = getFillOpacityForZoom(zoom);
      const lg = layerGroupRef.current;
      if (!lg) return;
      lg.eachLayer(layer => {
        if (!(layer instanceof L.Polygon)) return;
        if (!(layer.options as L.PathOptions & { _isFillPoly?: boolean })._isFillPoly) return;
        // setStyle resets fill to solid color; reapply gradient immediately after
        layer.setStyle({ fillOpacity: zoomOpacityRef.current });
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
    // Apply CSS filter to map container
    if (containerRef.current) {
      containerRef.current.style.filter = style.filter;
    }
  }, [styleId]);

  // ── Render map layers when topic/layers/style changes ──────────────────────
  const renderLayers = useCallback(() => {
    const map = mapRef.current;
    const lg  = layerGroupRef.current;
    if (!map || !lg) return;
    lg.clearLayers();

    // Clear any existing glow layers
    if (glowLayerRef.current) {
      glowLayerRef.current.forEach(p => { try { map.removeLayer(p); } catch { /* ignore */ } });
      glowLayerRef.current = null;
    }

    if (!selected) return;

    const currentZoom = map.getZoom();
    zoomOpacityRef.current = getFillOpacityForZoom(currentZoom);

    // Polygons — professional styling: thick border, smooth joins, subtle glow
    if (layers.territory && selected.polygons) {
      selected.polygons.forEach(poly => {
        const latlngs = poly.coords.map(([lat, lng]) => [lat, lng] as [number, number]);

        // Determine border style based on borderStyle field (if present)
        const borderStyle = (poly as unknown as { borderStyle?: string }).borderStyle;
        let dashArray: string | undefined;
        let borderWeight = 3.5;
        let borderOpacity = 0.92;

        if (borderStyle === 'disputed') {
          dashArray = '8,6';
          borderWeight = 2;
          borderOpacity = 0.7;
        } else if (borderStyle === 'influence') {
          dashArray = '3,6';
          borderWeight = 1.5;
          borderOpacity = 0.5;
        }

        // Outer glow layer — feathered border effect
        const outerGlow = L.polygon(latlngs, {
          color: poly.color,
          weight: 12,
          opacity: 0.16,
          fillOpacity: 0,
          interactive: false,
          smoothFactor: 0.5,
        } as L.PathOptions);
        outerGlow.addTo(lg);
        requestAnimationFrame(() => {
          const el = outerGlow.getElement() as SVGElement | null;
          if (el) el.style.filter = 'blur(3px)';
        });

        // Main border polygon with rich HTML tooltip
        const tooltipContent = `
          <div style="font-family:system-ui,sans-serif;min-width:120px">
            <div style="font-weight:700;font-size:12px;margin-bottom:2px">${poly.label ?? ''}</div>
            ${selected.period ? `<div style="font-size:10px;color:#aaa">${selected.period}</div>` : ''}
          </div>
        `;

        const mainPoly = L.polygon(latlngs, {
          color: poly.color,
          weight: borderWeight,
          opacity: borderOpacity,
          fillColor: poly.color,
          fillOpacity: zoomOpacityRef.current,
          lineJoin: 'round',
          lineCap: 'round',
          smoothFactor: 0.5,
          dashArray,
          // Mark this polygon so we can update its fill opacity on zoom
          ...({ _isFillPoly: true } as object),
        } as L.PathOptions);

        mainPoly.bindTooltip(tooltipContent, {
          permanent: false,
          direction: 'center',
          className: 'leaflet-tooltip-rich',
          sticky: true,
        });
        mainPoly.addTo(lg);

        // Inject SVG radial gradient fill so territory has depth instead of flat color
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
          const gId = `hfg-${poly.color.replace('#', '')}`;
          if (!defs.querySelector(`#${gId}`)) {
            const grad = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
            grad.setAttribute('id', gId);
            grad.setAttribute('cx', '40%');
            grad.setAttribute('cy', '35%');
            grad.setAttribute('r', '65%');
            const s1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            s1.setAttribute('offset', '0%');
            s1.setAttribute('stop-color', poly.color);
            s1.setAttribute('stop-opacity', '0.55');
            const s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            s2.setAttribute('offset', '100%');
            s2.setAttribute('stop-color', poly.color);
            s2.setAttribute('stop-opacity', '0.12');
            grad.append(s1, s2);
            defs.appendChild(grad);
          }
          pathEl.setAttribute('fill', `url(#${gId})`);
          pathEl.setAttribute('fill-opacity', '1');
        });
      });

      // Selected territory glow effect — additional pulsing glow layer on top
      const glowPolygons: L.Polygon[] = [];
      selected.polygons.forEach(poly => {
        const latlngs = poly.coords.map(([lat, lng]) => [lat, lng] as [number, number]);
        const glowPoly = L.polygon(latlngs, {
          color: poly.color,
          weight: 18,
          opacity: 0.10,
          fillColor: poly.color,
          fillOpacity: 0.06,
          interactive: false,
          smoothFactor: 0.5,
        } as L.PathOptions).addTo(map);
        glowPolygons.push(glowPoly);
      });
      glowLayerRef.current = glowPolygons;
    }

    // Routes
    if (layers.routes && selected.routes) {
      selected.routes.forEach(route => {
        const color = route.type === 'trade' ? '#f59e0b' : route.type === 'military' ? '#ef4444' : '#a78bfa';
        const dash  = route.type === 'trade' ? '8,6' : route.type === 'religious' ? '4,8' : undefined;
        L.polyline(route.points.map(([lat, lng]) => [lat, lng] as [number, number]), {
          color: route.color ?? color,
          weight: 2.5,
          dashArray: dash,
          opacity: 0.8,
        }).bindPopup(`<strong>${route.name}</strong><br/><em style="font-size:11px;color:#888">${route.type}</em>`).addTo(lg);
      });
    }

    // Markers — compute which labels to hide due to proximity
    const typeVisible: Record<MarkerType, LayerKey> = {
      capital: 'capitals', city: 'cities', battle: 'battles',
      port: 'ports', resource: 'resources', landmark: 'cities',
    };

    // Filter to visible markers first
    const visibleMarkers = selected.markers.filter(m => layers[typeVisible[m.type]]);

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
      const yearStr = m.year ? (m.year < 0 ? `${Math.abs(m.year)} BCE` : `${m.year} CE`) : '';

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
  }, [selected, layers, styleId, language]);

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
                  <div className="absolute top-8 right-0 bg-black/90 backdrop-blur-md rounded-xl border border-white/15 shadow-xl p-3 min-w-[180px] space-y-1.5">
                    <button onClick={() => setShowLayerPanel(false)} className="absolute top-2 right-2 text-white/40 hover:text-white"><X className="w-3 h-3" /></button>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">{t.tmap_layers}</p>
                    {(Object.entries(layers) as [LayerKey, boolean][]).map(([key, on]) => {
                      const label = (t as Record<string, string>)[`tmap_layer_${key}`] ?? key;
                      const colors: Record<LayerKey, string> = {
                        territory: '#6366f1', capitals: '#fbbf24', cities: '#60a5fa',
                        battles: '#ef4444', ports: '#34d399', resources: '#a78bfa', routes: '#f59e0b',
                      };
                      return (
                        <button
                          key={key}
                          onClick={() => setLayers(l => ({ ...l, [key]: !l[key] }))}
                          className={cn('w-full flex items-center gap-2.5 text-xs rounded-md px-2 py-1.5 transition-all', on ? 'text-white' : 'text-white/30')}
                        >
                          <div className={cn('w-3 h-3 rounded-sm border-2 flex items-center justify-center shrink-0 transition-all')} style={{ borderColor: colors[key], background: on ? colors[key] : 'transparent' }}>
                            {on && <span style={{ fontSize: 8, color: 'white' }}>✓</span>}
                          </div>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── SELECTED TOPIC INFO (top-left below header) ─ */}
          {selected && mode === 'explore' && (
            <div className="absolute top-3 left-3 max-w-[240px] z-[1000] bg-black/80 backdrop-blur-md text-white p-3 rounded-xl text-xs shadow-xl border border-white/10 pointer-events-none">
              <div className={cn('text-[9px] font-bold uppercase tracking-widest mb-1', ERA_COLORS[selected.era])}>
                {ERA_LABELS[selected.era][language]} · {selected.period}
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
                    <span className="font-bold text-sm">{getTranslatedMarkerName(storyCurrentMarker.name, language)}</span>
                    {storyCurrentMarker.year && (
                      <span className="text-white/50 text-[10px]">
                        {storyCurrentMarker.year < 0 ? Math.abs(storyCurrentMarker.year) + ' BCE' : storyCurrentMarker.year + ' CE'}
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
                  <p className="font-semibold text-sm leading-snug">{tq.question}</p>
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
      `}</style>
    </AppShell>
  );
}
