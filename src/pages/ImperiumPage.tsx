// ─── CHRONOS IMPERIUM — the strategic-tactical campaign page (Master-only) ────
// The four engine tiers meet the player here:
//   Part A  · the strategic node web + A* marches render on a live Leaflet map
//   Part B  · battles replay tick-by-tick from the combat matrix's triggers
//   Part C  · emergent crises interrupt the turn flow as localized councils
//   Part D  · every resolved turn persists locally + to the server store, and
//             the rollback bar time-travels through stored snapshots
// Everything the engine says arrives as catalog KEYS and resolves to the
// active UI language right here at the render boundary.
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords, Crown, Flag, Zap, Target, Shield, ShieldOff, AlertTriangle, Skull,
  ChevronRight, RotateCcw, Trash2, CloudSun, Coins, Scale3d, Network, Hourglass, MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppShell } from '@/components/layout/AppShell';
import { PlanGate } from '@/features/subscription/planGate';
import { useAuth } from '@/features/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { Language } from '@/i18n/translations';
import { TERRITORY_TOPICS } from '@/features/content/timelineTerritoryData';
import { findTerritoryPath } from '@/features/imperium/geoGraph';
import type { Tactic, AnimationTrigger, BattleResolution } from '@/features/imperium/combatMatrix';
import { ROSTERS, LEADERS } from '@/features/imperium/combatMatrix';
import type { FactionId } from '@/features/imperium/logistics';
import {
  createCampaign, resolveTurn, rollbackToTurn, graphFor, theatreSummary,
  type CampaignState, type Era, type TurnResult,
} from '@/features/imperium/imperiumEngine';
import { impText } from '@/features/imperium/imperiumCatalog';
import type { CrisisEvent } from '@/features/imperium/crisisGenerator';
import {
  saveCampaign, loadCampaign, listLocalCampaigns, deleteCampaign,
  pushTurnBlock, pushRollback,
} from '@/features/imperium/imperiumStore';

// ── Faction palette (map + panels share it) ───────────────────────────────────

const FACTION_COLOR: Record<FactionId | 'neutral', string> = {
  player: '#d9a54a',   // Historify gold
  rival: '#c0455a',    // rival crimson
  neutral: '#5a6472',
};

const ERAS: Era[] = ['ancient', 'medieval', 'early-modern', 'modern'];

const TACTICS: { id: Tactic; icon: typeof Zap; key: string }[] = [
  { id: 'charge', icon: Zap, key: 'imp_tactic_charge' },
  { id: 'volley', icon: Target, key: 'imp_tactic_volley' },
  { id: 'hold', icon: Shield, key: 'imp_tactic_hold' },
];

const TRIGGER_ICON: Record<AnimationTrigger['kind'], typeof Zap> = {
  charge: Zap, volley: Target, melee: Swords, shatter: ShieldOff,
  waver: AlertTriangle, rally: Flag, rout: Skull,
};

function territoryName(id: string, language: Language): string {
  const tp = TERRITORY_TOPICS.find(t => t.id === id);
  if (!tp) return id;
  if (language === 'en') return tp.title;
  return tp.titleI18n[language as Exclude<Language, 'en'>] ?? tp.title;
}

// ── Small shared bits ─────────────────────────────────────────────────────────

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{label}</span><span className="tabular-nums">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
      </div>
    </div>
  );
}

// ── Battle replay overlay: the tick timeline made visible ────────────────────
// Consumes the resolver's AnimationTriggers in order, animating both sides'
// strength/morale down the exact same curve the engine computed.

function BattleReplay({ battle, language, onDone }: {
  battle: TurnResult['battles'][number];
  language: Language;
  onDone: () => void;
}) {
  const { resolution, pending } = battle;
  const [tickIdx, setTickIdx] = useState(-1); // -1 = intro frame
  const done = tickIdx >= resolution.ticks.length - 1;

  useEffect(() => {
    if (done) return;
    const timer = setTimeout(() => setTickIdx(i => i + 1), tickIdx < 0 ? 900 : 700);
    return () => clearTimeout(timer);
  }, [tickIdx, done]);

  // Reconstruct on-screen strength/morale by replaying ticks up to tickIdx.
  const view = useMemo(() => {
    let aS = 100, dS = 100, aM = 100, dM = 100;
    // initial values: rewind from the final state through un-played ticks
    aS = resolution.attacker.strength; dS = resolution.defender.strength;
    aM = resolution.attacker.morale; dM = resolution.defender.morale;
    for (let i = resolution.ticks.length - 1; i > tickIdx; i--) {
      const t = resolution.ticks[i];
      aS += t.defenderDamage; dS += t.attackerDamage;
      aM -= t.attackerMoraleDelta; dM -= t.defenderMoraleDelta;
    }
    return {
      aS: Math.max(0, Math.min(100, aS)), dS: Math.max(0, Math.min(100, dS)),
      aM: Math.max(0, Math.min(100, aM)), dM: Math.max(0, Math.min(100, dM)),
    };
  }, [tickIdx, resolution]);

  const feed = tickIdx < 0 ? [] : resolution.ticks.slice(0, tickIdx + 1).flatMap(t => t.triggers);
  const atkRoster = ROSTERS.find(r => r.id === resolution.attacker.rosterId);
  const defRoster = ROSTERS.find(r => r.id === resolution.defender.rosterId);

  const verdictKey = resolution.winner === 'stalemate' ? 'imp_stalemate'
    : resolution.winner === 'attacker' ? 'imp_victory' : 'imp_defeat';

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-2xl rounded-2xl bg-layer-1 border border-white/10 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><Swords className="w-4 h-4 text-primary" /></div>
          <div className="min-w-0">
            <h3 className="font-heading font-bold truncate">
              {impText('imp_battle', language)} · {territoryName(pending.territoryId, language)}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {impText('imp_weather', language)}: {impText(`imp_weather_clear`, language)} · {impText(`imp_mod_high_ground`, language) && ''}
              {impText('imp_battle_report', language)}
            </p>
          </div>
          <Badge variant="outline" className="ml-auto shrink-0 tabular-nums">
            {tickIdx < 0 ? '—' : `${Math.min(tickIdx + 1, resolution.ticks.length)}/${resolution.ticks.length}`}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 p-5">
          {([
            ['attacker', atkRoster?.nameKey, view.aS, view.aM],
            ['defender', defRoster?.nameKey, view.dS, view.dM],
          ] as const).map(([side, rosterKey, s, m]) => (
            <div key={side} className={cn('rounded-xl p-3 space-y-2 border',
              side === 'attacker' ? 'border-primary/30 bg-primary/5' : 'border-red-400/20 bg-red-400/5')}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {impText(side === 'attacker' ? 'imp_attacker' : 'imp_defender', language)}
                </span>
                {resolution.routed && resolution.winner !== side && (
                  <Badge variant="destructive" className="text-[9px] px-1.5">{impText('imp_routed', language)}</Badge>
                )}
              </div>
              <p className="text-sm font-semibold truncate">{rosterKey ? impText(rosterKey, language) : '—'}</p>
              <StatBar label={impText('imp_strength', language)} value={s} color={side === 'attacker' ? FACTION_COLOR.player : FACTION_COLOR.rival} />
              <StatBar label={impText('imp_morale', language)} value={m} color="#7aa2f7" />
            </div>
          ))}
        </div>

        {/* Trigger feed — the resolver's animation timeline, replayed */}
        <div className="px-5 pb-3">
          <ScrollArea className="h-28 rounded-lg bg-black/30 border border-white/5">
            <div className="p-2 space-y-1">
              {feed.slice(-14).map((tr, i) => {
                const Icon = TRIGGER_ICON[tr.kind];
                return (
                  <motion.div key={`${tr.tick}-${tr.side}-${tr.kind}-${i}`}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-[11px]">
                    <span className="tabular-nums text-muted-foreground/60 w-7">T{tr.tick}</span>
                    <Icon className={cn('w-3 h-3', tr.side === 'attacker' ? 'text-primary' : 'text-red-400')} />
                    <span className={tr.side === 'attacker' ? 'text-primary/90' : 'text-red-300/90'}>
                      {impText(tr.side === 'attacker' ? 'imp_attacker' : 'imp_defender', language)}
                    </span>
                    <span className="text-muted-foreground">
                      {impText(`imp_tactic_${tr.kind === 'melee' ? 'hold' : tr.kind === 'volley' ? 'volley' : 'charge'}`, language)}
                    </span>
                    <span className="ml-auto text-muted-foreground/50 tabular-nums">{Math.round(tr.magnitude * 100)}%</span>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Modifier ledger — the matrix explains its math */}
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {resolution.modifiers.map((m, i) => (
            <Badge key={i} variant="outline" className={cn('text-[10px]',
              m.side === 'attacker' ? 'border-primary/40 text-primary' : 'border-red-400/40 text-red-300')}>
              {impText(m.labelKey, language)} {m.side === 'attacker' ? '+' : '+'}{m.value}%
            </Badge>
          ))}
        </div>

        <div className="px-5 pb-5 flex items-center justify-between">
          <AnimatePresence>
            {done && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={cn('font-heading text-lg font-bold',
                  resolution.winner === 'attacker' ? 'text-primary' : resolution.winner === 'defender' ? 'text-red-400' : 'text-muted-foreground')}>
                {impText(verdictKey, language)}
              </motion.p>
            )}
          </AnimatePresence>
          <Button size="sm" className="ml-auto gap-1" variant={done ? 'default' : 'ghost'}
            onClick={() => (done ? onDone() : setTickIdx(resolution.ticks.length - 1))}>
            {impText('imp_continue', language)}<ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Crisis council modal (Part C surfaces here) ───────────────────────────────

function CrisisCouncil({ crisis, language, chosen, onChoose }: {
  crisis: CrisisEvent;
  language: Language;
  chosen?: string;
  onChoose: (optionId: string) => void;
}) {
  const params: Record<string, string | number> = { ...crisis.params };
  if (typeof params.territory === 'string') params.territory = territoryName(params.territory, language);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-3 space-y-2">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-sm font-semibold text-amber-300">{impText(crisis.titleKey, language, params)}</p>
      </div>
      <p className="text-[12px] text-muted-foreground leading-relaxed">{impText(crisis.bodyKey, language, params)}</p>
      {crisis.options.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {crisis.options.map(opt => (
            <button key={opt.id} onClick={() => onChoose(opt.id)}
              className={cn('w-full text-left text-[12px] rounded-lg px-3 py-2 border transition-colors',
                chosen === opt.id
                  ? 'border-amber-400/70 bg-amber-400/15 text-amber-200'
                  : 'border-white/10 bg-white/[0.02] text-foreground/80 hover:border-amber-400/40')}>
              {impText(opt.labelKey, language)}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── The page ──────────────────────────────────────────────────────────────────

export default function ImperiumPage() {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const userId = currentUser?.id ?? 'anon';
  const ti = useCallback((key: string, params?: Record<string, string | number>) => impText(key, language, params), [language]);

  const [campaign, setCampaign] = useState<CampaignState | null>(null);
  const [pendingMarches, setPendingMarches] = useState<Record<string, string>>({});
  const [tactic, setTactic] = useState<Tactic>('hold');
  const [crisisChoices, setCrisisChoices] = useState<Record<string, string>>({});
  const [selectedArmyId, setSelectedArmyId] = useState<string | null>(null);
  const [battleQueue, setBattleQueue] = useState<TurnResult['battles']>([]);
  const [showWeb, setShowWeb] = useState(false);
  const [resolving, setResolving] = useState(false);

  const savedCampaigns = useMemo(() => listLocalCampaigns(userId), [userId, campaign?.id]);

  // ── Leaflet lifecycle ──
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const territoryLayerRef = useRef<L.LayerGroup | null>(null);
  const overlayLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!campaign || !mapDivRef.current || mapRef.current) return;
    const map = L.map(mapDivRef.current, { zoomControl: true, attributionControl: false, worldCopyJump: true });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 10, minZoom: 2 }).addTo(map);
    territoryLayerRef.current = L.layerGroup().addTo(map);
    overlayLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    const topics = TERRITORY_TOPICS.filter(tp => tp.era === campaign.era && tp.polygons?.length);
    const bounds = L.latLngBounds(topics.flatMap(tp => tp.polygons![0].coords.map(([la, ln]) => L.latLng(la, ln))));
    if (bounds.isValid()) map.fitBounds(bounds.pad(0.12));
    return () => { map.remove(); mapRef.current = null; territoryLayerRef.current = null; overlayLayerRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign?.id]);

  // Redraw territories + armies + march previews on every snapshot change.
  const selectedArmyRef = useRef<string | null>(null);
  selectedArmyRef.current = selectedArmyId;

  useEffect(() => {
    const map = mapRef.current;
    const layer = territoryLayerRef.current;
    const overlay = overlayLayerRef.current;
    if (!campaign || !map || !layer || !overlay) return;
    layer.clearLayers();
    overlay.clearLayers();
    const snap = campaign.current;
    const graph = graphFor(campaign.era);

    // Territory polygons, tinted by owner.
    const topics = TERRITORY_TOPICS.filter(tp => tp.era === campaign.era && tp.polygons?.length);
    for (const tp of topics) {
      const owner = (snap.ownership.owners[tp.id] ?? 'neutral') as FactionId | 'neutral';
      const color = FACTION_COLOR[owner];
      const isCapital = snap.capitals.player === tp.id || snap.capitals.rival === tp.id;
      for (const poly of tp.polygons!) {
        const p = L.polygon(poly.coords, {
          color, weight: isCapital ? 2.4 : 1.4, opacity: 0.9,
          fillColor: color, fillOpacity: owner === 'neutral' ? 0.08 : 0.22,
          dashArray: owner === 'neutral' ? '4 4' : undefined,
        }).addTo(layer);
        p.bindTooltip(
          `${territoryName(tp.id, language)}${isCapital ? ' ★' : ''}`,
          { direction: 'center', className: 'imp-tooltip', permanent: false },
        );
        p.on('click', () => {
          const armyId = selectedArmyRef.current;
          if (!armyId) return;
          const army = campaign.current.armies.find(ar => ar.id === armyId && ar.faction === 'player');
          if (!army || army.territoryId === tp.id) return;
          setPendingMarches(prev => ({ ...prev, [armyId]: tp.id }));
        });
      }
    }

    // Optional: the strategic node web (Part A made visible).
    if (showWeb) {
      const seen = new Set<string>();
      for (const [from, edges] of graph.adj) {
        for (const e of edges) {
          const key = e.a < e.b ? `${e.a}|${e.b}` : `${e.b}|${e.a}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const na = graph.nodes.get(e.a)!;
          const nb = graph.nodes.get(e.b)!;
          L.polyline([[na.lat, na.lng], [nb.lat, nb.lng]], {
            color: e.sea ? '#3f6f8f' : '#8892a6',
            weight: 0.6, opacity: e.sea ? 0.5 : 0.3, dashArray: e.sea ? '2 5' : undefined,
            interactive: false,
          }).addTo(overlay);
        }
        void from;
      }
    }

    // March previews: the actual A* corridor each pending order will follow.
    const hostileOf = (faction: FactionId) => new Set(
      Object.entries(snap.ownership.owners).filter(([, f]) => f !== faction && f !== undefined).map(([t]) => t),
    );
    for (const [armyId, target] of Object.entries(pendingMarches)) {
      const army = snap.armies.find(ar => ar.id === armyId);
      if (!army) continue;
      const hostile = hostileOf(army.faction);
      hostile.delete(target);
      const path = findTerritoryPath(graph, army.territoryId, target, { hostile, hostilePenalty: 2.2, canSail: true });
      if (!path) continue;
      const pts = path.nodeIds.map(id => { const n = graph.nodes.get(id)!; return [n.lat, n.lng] as [number, number]; });
      L.polyline(pts, { color: FACTION_COLOR.player, weight: 2, opacity: 0.85, dashArray: '6 6', interactive: false }).addTo(overlay);
      const end = pts[pts.length - 1];
      L.circleMarker(end, { radius: 5, color: FACTION_COLOR.player, fillColor: FACTION_COLOR.player, fillOpacity: 0.9, interactive: false }).addTo(overlay);
    }

    // Armies in motion: draw the remaining path of active marches.
    for (const army of snap.armies) {
      if (!army.march) continue;
      const rest = army.march.path.nodeIds.slice(army.march.progress);
      const pts = rest.map(id => { const n = graph.nodes.get(id)!; return [n.lat, n.lng] as [number, number]; });
      if (pts.length > 1) {
        L.polyline(pts, {
          color: FACTION_COLOR[army.faction], weight: 1.6, opacity: 0.6, dashArray: '2 6', interactive: false,
        }).addTo(overlay);
      }
    }

    // Army markers (chips) at territory centroids, offset when stacked.
    const perTerritory = new Map<string, number>();
    for (const army of snap.armies) {
      const cId = graph.centroids.get(army.territoryId);
      if (!cId) continue;
      const c = graph.nodes.get(cId)!;
      const n = perTerritory.get(army.territoryId) ?? 0;
      perTerritory.set(army.territoryId, n + 1);
      const selected = army.id === selectedArmyId;
      const icon = L.divIcon({
        className: '',
        html: `<div class="imp-army ${army.faction} ${selected ? 'sel' : ''} ${army.supplied ? '' : 'starve'}">⚔ ${Math.round(army.strength)}</div>`,
        iconSize: [46, 20], iconAnchor: [23, 10 - n * 14],
      });
      const marker = L.marker([c.lat, c.lng], { icon, zIndexOffset: selected ? 1000 : 0 }).addTo(overlay);
      if (army.faction === 'player') {
        marker.on('click', () => setSelectedArmyId(prev => (prev === army.id ? null : army.id)));
      }
    }
  }, [campaign, pendingMarches, selectedArmyId, showWeb, language]);

  // ── Campaign actions ──
  const startCampaign = (era: Era) => {
    const state = createCampaign(era);
    setCampaign(state);
    setPendingMarches({}); setCrisisChoices({}); setSelectedArmyId(null); setBattleQueue([]);
    saveCampaign(userId, state);
    void pushTurnBlock(state);
  };

  const resumeCampaign = (id: string) => {
    const state = loadCampaign(userId, id);
    if (state) { setCampaign(state); setPendingMarches({}); setCrisisChoices({}); setBattleQueue([]); }
  };

  const abandonCampaign = (id: string) => {
    deleteCampaign(userId, id);
    if (campaign?.id === id) setCampaign(null);
  };

  const endTurn = () => {
    if (!campaign || resolving || campaign.current.over) return;
    setResolving(true);
    // Give the button's press state one frame, then run the pipeline.
    requestAnimationFrame(() => {
      const result = resolveTurn(campaign, { marches: pendingMarches, tactic, crisisChoices });
      setCampaign(result.state);
      setPendingMarches({}); setCrisisChoices({}); setSelectedArmyId(null);
      setBattleQueue(result.battles);
      saveCampaign(userId, result.state);
      void pushTurnBlock(result.state);
      setResolving(false);
    });
  };

  const rollback = (turn: number) => {
    if (!campaign) return;
    const rolled = rollbackToTurn(campaign, turn);
    setCampaign(rolled);
    setPendingMarches({}); setCrisisChoices({}); setBattleQueue([]);
    saveCampaign(userId, rolled);
    void pushRollback(campaign.id, turn);
  };

  const snap = campaign?.current;
  const playerArmies = snap?.armies.filter(a => a.faction === 'player') ?? [];
  const rivalArmies = snap?.armies.filter(a => a.faction === 'rival') ?? [];
  const holdings = snap ? Object.values(snap.ownership.owners).reduce(
    (acc, f) => { acc[f] += 1; return acc; }, { player: 0, rival: 0 } as Record<FactionId, number>,
  ) : { player: 0, rival: 0 };

  return (
    <AppShell>
      <div className="max-w-[1500px] mx-auto">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10"><Swords className="w-5 h-5 text-primary" /></div>
            <div>
              <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
                {ti('imp_title')}
                <Badge variant="outline" className="border-amber-400/50 text-amber-400 text-[10px] gap-1"><Crown className="w-3 h-3" />MASTER</Badge>
              </h1>
              <p className="text-muted-foreground text-sm">{ti('imp_subtitle')}</p>
            </div>
          </div>
          {campaign && (
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="gap-1.5 tabular-nums"><Hourglass className="w-3 h-3" />{ti('imp_turn')} {snap?.turn}</Badge>
              <Badge variant="outline" className="gap-1.5"><CloudSun className="w-3 h-3" />{ti(`imp_weather_${snap?.weather ?? 'clear'}`)}</Badge>
              <Badge variant="outline" className="gap-1.5 tabular-nums"><Coins className="w-3 h-3" />{ti('imp_treasury')} {snap?.treasury}</Badge>
              <Badge variant="outline" className="gap-1.5 tabular-nums"><Scale3d className="w-3 h-3" />{ti('imp_discipline')} {snap?.discipline ?? 0}</Badge>
              <Button variant="ghost" size="sm" onClick={() => setCampaign(null)}>{ti('imp_theatre')}</Button>
            </div>
          )}
        </motion.div>

        <PlanGate plan="master" description={ti('imp_gate')}>
          {/* ── Theatre setup ── */}
          {!campaign && (
            <div className="space-y-6">
              <h2 className="font-heading text-lg font-semibold">{ti('imp_setup_pick')}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ERAS.map(era => {
                  const { territories } = theatreSummary(era);
                  return (
                    <motion.button key={era} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                      onClick={() => startCampaign(era)}
                      className="text-left rounded-2xl border border-white/10 bg-layer-1 p-5 space-y-3 hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <MapPin className="w-5 h-5 text-primary" />
                        <Badge variant="outline" className="text-[10px] tabular-nums">{territories} {ti('imp_territories')}</Badge>
                      </div>
                      <div>
                        <p className="font-heading font-bold">{ti(`imp_era_${era}`)}</p>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{ti('imp_new_here')}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[12px] text-primary font-medium">
                        {ti('imp_new_campaign')}<ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {savedCampaigns.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">{ti('imp_resume')}</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {savedCampaigns.map(entry => (
                      <div key={entry.id} className="rounded-xl border border-white/10 bg-layer-1 p-4 flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate">{ti(`imp_era_${entry.era}`)}</p>
                          <p className="text-[11px] text-muted-foreground tabular-nums">
                            {ti('imp_turn')} {entry.turn}
                            {entry.over && ` · ${ti(entry.playerWon ? 'imp_victory' : 'imp_defeat')}`}
                          </p>
                        </div>
                        <Button size="sm" variant="secondary" onClick={() => resumeCampaign(entry.id)}>{ti('imp_continue')}</Button>
                        <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-red-400"
                          onClick={() => abandonCampaign(entry.id)} title={ti('imp_abandon')}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Campaign board ── */}
          {campaign && snap && (
            <div className="grid lg:grid-cols-[1fr_340px] gap-4">
              {/* Map column */}
              <div className="space-y-2 min-w-0">
                <div className="relative rounded-2xl overflow-hidden border border-white/10">
                  <div ref={mapDivRef} className="h-[46vh] lg:h-[calc(100vh-15rem)] w-full bg-layer-0" />
                  {/* Holdings scoreboard */}
                  <div className="absolute top-3 left-3 z-[1000] flex gap-2">
                    {(['player', 'rival'] as FactionId[]).map(f => (
                      <div key={f} className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur border border-white/10 flex items-center gap-1.5 text-[12px] tabular-nums">
                        <span className="w-2 h-2 rounded-full" style={{ background: FACTION_COLOR[f] }} />
                        {holdings[f]}
                      </div>
                    ))}
                    <button onClick={() => setShowWeb(w => !w)}
                      className={cn('px-2.5 py-1 rounded-lg backdrop-blur border text-[12px] flex items-center gap-1.5 transition-colors',
                        showWeb ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-black/70 border-white/10 text-muted-foreground')}>
                      <Network className="w-3 h-3" />{ti('imp_supply_web')}
                    </button>
                  </div>
                  {selectedArmyId && (
                    <div className="absolute bottom-3 left-3 right-3 z-[1000] px-3 py-2 rounded-lg bg-black/75 backdrop-blur border border-primary/30 text-[12px] text-primary">
                      {ti('imp_select_hint')}
                    </div>
                  )}
                  {/* Campaign-over veil */}
                  <AnimatePresence>
                    {snap.over && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="absolute inset-0 z-[1001] bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-center p-6">
                        <Crown className={cn('w-10 h-10', snap.playerWon ? 'text-primary' : 'text-red-400')} />
                        <h2 className="font-heading text-3xl font-bold">{ti(snap.playerWon ? 'imp_victory' : 'imp_defeat')}</h2>
                        <p className="text-muted-foreground max-w-md">{ti(snap.playerWon ? 'imp_campaign_won' : 'imp_campaign_lost')}</p>
                        <Button className="mt-2" onClick={() => setCampaign(null)}>{ti('imp_new_campaign')}</Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Rollback bar — Part D's time travel, one chip per stored turn */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  <RotateCcw className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-[11px] text-muted-foreground shrink-0">{ti('imp_rollback')}</span>
                  {campaign.snapshots.map(s => (
                    <button key={s.turn} onClick={() => rollback(s.turn)}
                      className={cn('shrink-0 min-w-7 h-7 px-1.5 rounded-md text-[11px] tabular-nums border transition-colors',
                        s.turn === snap.turn
                          ? 'border-primary/60 bg-primary/15 text-primary'
                          : 'border-white/10 bg-white/[0.02] text-muted-foreground hover:border-primary/40')}>
                      {s.turn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Command column */}
              <div className="space-y-3 min-w-0">
                {/* War council: tactic + end turn */}
                <div className="rounded-2xl border border-white/10 bg-layer-1 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-primary" />
                    <h3 className="font-heading font-semibold text-sm">{ti('imp_council')}</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{ti('imp_choose_tactic')} · {ti('imp_triangle_hint')}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {TACTICS.map(({ id, icon: Icon, key }) => (
                      <button key={id} onClick={() => setTactic(id)}
                        className={cn('rounded-xl border px-2 py-2.5 flex flex-col items-center gap-1 text-[11px] transition-all',
                          tactic === id
                            ? 'border-primary/60 bg-primary/15 text-primary scale-[1.02]'
                            : 'border-white/10 bg-white/[0.02] text-muted-foreground hover:border-primary/30')}>
                        <Icon className="w-4 h-4" />{ti(key)}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>{ti('imp_leader')}: <span className="text-foreground">{ti(campaign.playerLeader.nameKey)}</span></span>
                    <span className="text-right">{ti(ROSTERS.find(r => r.id === campaign.playerRosterId)?.nameKey ?? '')}</span>
                  </div>
                  <Button className="w-full gap-2" disabled={resolving || snap.over} onClick={endTurn}>
                    <Swords className="w-4 h-4" />{ti('imp_end_turn')}
                  </Button>
                </div>

                {/* Crisis council */}
                {snap.activeCrises.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <h3 className="font-heading font-semibold text-sm">{ti('imp_crisis_council')}</h3>
                    </div>
                    {snap.activeCrises.map(c => (
                      <CrisisCouncil key={c.id} crisis={c} language={language} chosen={crisisChoices[c.id]}
                        onChoose={opt => setCrisisChoices(prev => ({ ...prev, [c.id]: opt }))} />
                    ))}
                  </div>
                )}

                {/* Armies */}
                <div className="rounded-2xl border border-white/10 bg-layer-1 p-4 space-y-3">
                  <h3 className="font-heading font-semibold text-sm">{ti('imp_your_armies')}</h3>
                  {playerArmies.length === 0 && <p className="text-[12px] text-muted-foreground">—</p>}
                  {playerArmies.map(army => {
                    const marchTarget = pendingMarches[army.id] ?? army.march?.targetTerritoryId;
                    return (
                      <button key={army.id} onClick={() => setSelectedArmyId(prev => (prev === army.id ? null : army.id))}
                        className={cn('w-full text-left rounded-xl border p-3 space-y-2 transition-colors',
                          selectedArmyId === army.id ? 'border-primary/60 bg-primary/10' : 'border-white/10 bg-white/[0.02] hover:border-primary/30')}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate">{territoryName(army.territoryId, language)}</span>
                          <Badge variant="outline" className={cn('ml-auto text-[9px] shrink-0',
                            army.supplied ? 'border-emerald-400/50 text-emerald-400' : 'border-red-400/60 text-red-400 animate-pulse')}>
                            {ti(army.supplied ? 'imp_supplied' : 'imp_isolated')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <StatBar label={ti('imp_strength')} value={army.strength} color={FACTION_COLOR.player} />
                          <StatBar label={ti('imp_morale')} value={army.morale} color="#7aa2f7" />
                        </div>
                        {marchTarget && (
                          <p className="text-[11px] text-primary flex items-center gap-1">
                            <ChevronRight className="w-3 h-3" />
                            {ti(pendingMarches[army.id] ? 'imp_march_ordered' : 'imp_marching')}: {territoryName(marchTarget, language)}
                          </p>
                        )}
                      </button>
                    );
                  })}
                  {/* Rival intelligence strip */}
                  <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{ti(ROSTERS.find(r => r.id === campaign.rivalRosterId)?.nameKey ?? '')}</span>
                    <span className="tabular-nums flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: FACTION_COLOR.rival }} />
                      ⚔ {rivalArmies.length} · {ti(LEADERS.find(l => l.id === campaign.rivalLeader.id)?.nameKey ?? '')}
                    </span>
                  </div>
                </div>

                {/* Campaign log */}
                <div className="rounded-2xl border border-white/10 bg-layer-1 p-4">
                  <h3 className="font-heading font-semibold text-sm mb-2">{ti('imp_log')}</h3>
                  <ScrollArea className="h-40">
                    <div className="space-y-1 pr-2">
                      {[...snap.log].reverse().slice(0, 40).map((line, i) => {
                        const params: Record<string, string | number> = { ...(line.params ?? {}) };
                        if (typeof params.territory === 'string') params.territory = territoryName(params.territory, language);
                        return (
                          <p key={i} className="text-[11px] text-muted-foreground leading-relaxed">
                            <span className="text-muted-foreground/50 tabular-nums">T{line.turn}</span>{' · '}
                            {ti(line.key, params)}
                          </p>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}
        </PlanGate>
      </div>

      {/* Battle replays play sequentially after each resolved turn */}
      <AnimatePresence>
        {battleQueue.length > 0 && (
          <BattleReplay key={battleQueue[0].pending.id}
            battle={battleQueue[0]} language={language}
            onDone={() => setBattleQueue(q => q.slice(1))} />
        )}
      </AnimatePresence>

      {/* Army chip styling (Leaflet divIcons live outside Tailwind's tree) */}
      <style>{`
        .imp-army {
          display: inline-flex; align-items: center; justify-content: center; gap: 3px;
          min-width: 44px; padding: 2px 6px; border-radius: 9999px;
          font: 600 10px/1.4 system-ui, sans-serif; color: #0d0b07;
          border: 1.5px solid rgba(255,255,255,0.35);
          box-shadow: 0 2px 8px rgba(0,0,0,0.55);
          transition: transform .15s ease;
          cursor: pointer;
        }
        .imp-army.player { background: ${FACTION_COLOR.player}; }
        .imp-army.rival  { background: ${FACTION_COLOR.rival}; color: #fff; cursor: default; }
        .imp-army.sel    { transform: scale(1.18); border-color: #fff; }
        .imp-army.starve { animation: impStarve 1.2s ease-in-out infinite; }
        @keyframes impStarve { 0%,100% { box-shadow: 0 0 0 0 rgba(220,60,80,.7);} 50% { box-shadow: 0 0 0 6px rgba(220,60,80,0);} }
        .imp-tooltip {
          background: rgba(10,10,14,.92); border: 1px solid rgba(217,165,74,.35);
          color: #e8e2d5; font-size: 11px; border-radius: 8px; padding: 3px 8px;
        }
        .imp-tooltip::before { display: none; }
      `}</style>
    </AppShell>
  );
}
