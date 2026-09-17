import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Lock, ArrowRight, Compass, MapPin, Hammer } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/features/auth/AuthContext';
import { loadProgress } from '@/features/progress/progressStore';
import { readCurrentUserId } from '@/features/atlas/atlasModel';
import { ERAS } from '@/features/content/erasData';
import type { Era } from '@/types';
import { getTranslatedEra } from '@/i18n/contentTranslations';
import { ERA_SLUGS } from '@/features/content/eraSlugs';
import { loadRealPolygons, type RealPolygon } from '@/features/content/territoryGeojson';
import { TERRITORY_TOPICS } from '@/features/content/timelineTerritoryData';
import {
  atlasFrames, atlasSpan, frameAtYear, atlasProgress, isRevealed, type AtlasFrame,
} from '@/features/atlas/atlasModel';
import { atlasText, formatYear } from '@/features/atlas/atlasCatalog';
import { FollowTerritoryPanel } from '@/features/atlas/FollowTerritoryPanel';

// Keyless Esri Dark Gray Canvas, the same provider the territory map settled on
// after CARTO began stamping "API KEY REQUIRED" over anonymous tiles.
const TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

/** Slate, for ground the learner has not reached yet. */
const FOG_COLOR = '#64748b';

/** One second of replay per frame feels like a flip-book rather than a slideshow. */
const REPLAY_MS = 1100;

function AtlasInner() {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  // Opening on the era with the most ground uncovered puts the learner where
  // they have been working rather than at the dawn of prehistory every time.
  const [eraId, setEraId] = useState<Era['id']>(() => {
    const user = readCurrentUserId();
    const done = user ? loadProgress(user).completedLessons : [];
    const best = ERAS
      .map(e => ({ id: e.id, n: atlasProgress(atlasFrames(e.id), done).revealed }))
      .sort((a, b) => b.n - a.n)[0];
    return (best && best.n > 0 ? best.id : ERAS[0].id);
  });
  const [year, setYear] = useState<number | null>(null);
  const [replaying, setReplaying] = useState(false);
  const [following, setFollowing] = useState(false);

  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const geomCache = useRef<Record<string, RealPolygon[]>>({});
  const [geomVersion, setGeomVersion] = useState(0);

  const completed = useMemo(
    () => (currentUser ? loadProgress(currentUser.id).completedLessons : []),
    [currentUser],
  );

  const frames = useMemo(() => atlasFrames(eraId), [eraId]);
  const [spanStart, spanEnd] = useMemo(() => atlasSpan(frames), [frames]);
  const progress = useMemo(() => atlasProgress(frames, completed), [frames, completed]);

  // Opening on the frontier puts the learner where they left off rather than at
  // the dawn of the era every single time.
  const effectiveYear = year ?? progress.frontier ?? spanStart;
  const frame = useMemo(() => frameAtYear(frames, effectiveYear), [frames, effectiveYear]);
  const revealed = frame ? isRevealed(frame, completed) : false;

  // ── Map bootstrap ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;
    const map = L.map(mapDivRef.current, {
      center: [35, 15], zoom: 3, zoomControl: false, worldCopyJump: true, attributionControl: false,
    });
    // Bottom left, lifted clear of the scrubber. The default top-left position
    // puts the zoom buttons underneath the frame card.
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    L.tileLayer(TILE_URL, { maxZoom: 16, maxNativeZoom: 16 }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // ── Geometry, fetched once per topic and cached ────────────────────────────
  useEffect(() => {
    const topicId = frame?.topicId;
    if (!topicId || geomCache.current[topicId]) return;
    let alive = true;
    loadRealPolygons(topicId).then(polys => {
      if (!alive || !polys?.length) return;
      geomCache.current[topicId] = polys;
      setGeomVersion(v => v + 1);
    });
    return () => { alive = false; };
  }, [frame?.topicId]);

  // ── Draw ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const lg = layerRef.current;
    const map = mapRef.current;
    if (!lg || !map || !frame) return;
    lg.clearLayers();

    const topic = TERRITORY_TOPICS.find(t => t.id === frame.topicId);
    const cached = frame.topicId ? geomCache.current[frame.topicId] : undefined;
    const polys: RealPolygon[] = cached
      ?? topic?.polygons?.map(p => ({ coords: p.coords, color: p.color, label: p.label }))
      ?? [];

    for (const poly of polys) {
      // Unread years draw as fog: the shape is there, the identity is not.
      L.polygon(poly.coords, {
        color: revealed ? poly.color : FOG_COLOR,
        weight: revealed ? 2 : 1.2,
        opacity: revealed ? 0.95 : 0.5,
        fillColor: revealed ? poly.color : FOG_COLOR,
        fillOpacity: revealed ? 0.35 : 0.12,
        dashArray: revealed ? undefined : '5,6',
        interactive: false,
      }).addTo(lg);
    }

    if (topic) map.flyTo(topic.center, topic.zoom, { duration: replaying ? 0.7 : 1.2 });
  }, [frame, revealed, geomVersion, replaying]);

  // ── Replay: step the scrubber through the era ──────────────────────────────
  useEffect(() => {
    if (!replaying || frames.length === 0) return;
    const i = frames.findIndex(f => f.lessonId === frame?.lessonId);
    const next = i + 1;
    if (next >= frames.length) { setReplaying(false); return; }
    const timer = setTimeout(() => setYear(frames[next].year), REPLAY_MS);
    return () => clearTimeout(timer);
  }, [replaying, frame, frames]);

  const startReplay = useCallback(() => {
    setYear(frames[0]?.year ?? spanStart);
    setReplaying(true);
  }, [frames, spanStart]);

  const era = ERAS.find(e => e.id === eraId)!;
  const tEra = getTranslatedEra(era, language);

  return (
    <div className="flex flex-col gap-4">
      {/* Era selector */}
      <div className="flex flex-wrap gap-2">
        {ERAS.map(e => {
          const p = atlasProgress(atlasFrames(e.id), completed);
          const active = e.id === eraId;
          return (
            <button
              key={e.id}
              onClick={() => { setEraId(e.id); setYear(null); setReplaying(false); }}
              className={`rounded-xl border px-3 py-2 text-left transition-colors ${
                active ? 'border-primary/60 bg-primary/10' : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <div className="text-sm font-semibold">{getTranslatedEra(e, language).name}</div>
              <div className="text-[11px] text-muted-foreground tabular-nums">
                {atlasText('atlas_uncovered', language, { n: p.revealed, m: p.total })}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* Frame list */}
        <div className="rounded-2xl border border-border bg-card p-3 max-h-[32rem] overflow-y-auto">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {tEra.name}
            </span>
            <Badge variant="secondary" className="tabular-nums text-[10px]">
              {progress.revealed}/{progress.total}
            </Badge>
          </div>
          <ul className="space-y-1">
            {frames.map(f => {
              const lit = isRevealed(f, completed);
              const here = f.lessonId === frame?.lessonId;
              return (
                <li key={f.lessonId}>
                  <button
                    onClick={() => { setYear(f.year); setReplaying(false); }}
                    className={`w-full rounded-lg px-2.5 py-2 text-left transition-colors ${
                      here ? 'bg-primary/15' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {lit
                        ? <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                        : <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />}
                      <span className={`truncate text-[13px] ${lit ? '' : 'text-muted-foreground/60'}`}>
                        {f.title}
                      </span>
                    </div>
                    <div className="pl-5.5 text-[11px] tabular-nums text-muted-foreground/70">
                      {formatYear(f.year, language)}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Map */}
        {/* The arbitrary variant lifts Leaflet's zoom control clear of the
            scrubber bar pinned to the bottom of this same container. */}
        <div
          className="relative overflow-hidden rounded-2xl border border-border [&_.leaflet-bottom.leaflet-left]:mb-14"
          style={{ minHeight: '32rem' }}
        >
          <div ref={mapDivRef} className="absolute inset-0" />

          <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex justify-between gap-2 p-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={frame?.lessonId ?? 'none'}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="pointer-events-auto max-w-sm rounded-xl border border-border bg-background/90 p-3 backdrop-blur"
              >
                <div className="text-[11px] font-semibold tracking-wider text-primary uppercase tabular-nums">
                  {frame ? formatYear(frame.year, language) : ''}
                </div>
                <div className="font-heading text-base font-bold">{frame?.title}</div>
                {!revealed && (
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                    {atlasText('atlas_locked_frame', language)}
                  </p>
                )}
                {frame && (
                  <Link
                    to={`/eras/${eraId}/lessons/${frame.lessonId}`}
                    className="mt-2 inline-flex items-center gap-1 text-[12px] text-primary hover:underline"
                  >
                    {atlasText('atlas_open_lesson', language)}<ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-auto flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => setFollowing(true)}>
                <Compass className="mr-1.5 h-3.5 w-3.5" />
                {atlasText('atlas_follow', language)}
              </Button>
              <Button size="sm" onClick={() => (replaying ? setReplaying(false) : startReplay())}>
                {replaying
                  ? <><Square className="mr-1.5 h-3.5 w-3.5" />{atlasText('atlas_stop', language)}</>
                  : <><Play className="mr-1.5 h-3.5 w-3.5" />{atlasText('atlas_replay', language)}</>}
              </Button>
            </div>
          </div>

          {/* Scrubber */}
          <div className="absolute inset-x-0 bottom-0 z-[500] border-t border-border bg-background/90 p-3 backdrop-blur">
            <div className="mb-1 flex justify-between text-[11px] tabular-nums text-muted-foreground">
              <span>{formatYear(spanStart, language)}</span>
              <span className="font-semibold text-foreground">
                {frame ? formatYear(frame.year, language) : ''}
              </span>
              <span>{formatYear(spanEnd, language)}</span>
            </div>
            <input
              type="range"
              min={spanStart}
              max={spanEnd}
              value={effectiveYear}
              onChange={e => { setYear(Number(e.target.value)); setReplaying(false); }}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
              aria-label={atlasText('atlas_year', language)}
            />
          </div>
        </div>
      </div>

      {following && (
        <FollowTerritoryPanel
          completed={completed}
          onClose={() => setFollowing(false)}
          onPick={(f: AtlasFrame) => {
            setEraId(f.eraId as Era['id']);
            setYear(f.year);
            setReplaying(false);
            setFollowing(false);
          }}
        />
      )}
    </div>
  );
}

export default function AtlasPage() {
  const { language } = useLanguage();
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-5">
        <div>
          <h1 className="flex items-center gap-2.5 font-heading text-2xl font-bold">
            {atlasText('atlas_title', language)}
            <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              {atlasText('atlas_coming_soon', language)}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">{atlasText('atlas_subtitle', language)}</p>
        </div>
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-400/30 bg-amber-400/[0.06] px-4 py-3">
          <Hammer className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-[13px] leading-relaxed text-amber-200/90">
            {atlasText('atlas_coming_soon_body', language)}
          </p>
        </div>
        {/* Open to every plan while it is being built. The Master gate goes
            back on when the per-lesson geometry lands and the feature is worth
            charging for; until then a paywall on something unfinished is a
            worse deal than no paywall. */}
        <AtlasInner />
      </div>
    </AppShell>
  );
}

export { ERA_SLUGS };
