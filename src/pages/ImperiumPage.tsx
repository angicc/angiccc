// ─── CHRONOS IMPERIUM — strategic-tactical campaign (Master-only) ─────────────
// Rebuilt for clarity: four curated theatres of REAL, non-overlapping states
// from the historical-basemaps dataset (no more stacked thematic layers), a
// guided how-to-play council, named armies, an explicit objective tracker,
// and a CSS-3D battlefield that replays every battle tick in motion.
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords, Crown, Flag, Zap, Target, Shield, AlertTriangle,
  ChevronRight, RotateCcw, Trash2, CloudSun, Coins, Scale3d, Network, Hourglass, MapPin, HelpCircle,
  ScrollText, X, Landmark, Brain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppShell } from '@/components/layout/AppShell';
import { PlanGate } from '@/features/subscription/planGate';
import { useAuth } from '@/features/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { Language } from '@/i18n/translations';
import { findTerritoryPath, classifyTerrain } from '@/features/imperium/geoGraph';
import type { Tactic } from '@/features/imperium/combatMatrix';
import { ROSTERS, rateTactic } from '@/features/imperium/combatMatrix';
import { loadDoctrine, recordTurnJudgment, clearDoctrine, campaignStanding, type DoctrineState } from '@/features/imperium/warCouncil';
import type { FactionId } from '@/features/imperium/logistics';
import {
  createCampaign, resolveTurn, rollbackToTurn, graphFor, theatreSummary, THEATRE_SPECS,
  type CampaignState, type TheatreId, type TurnResult,
} from '@/features/imperium/imperiumEngine';
import { theatreSpec, provincesFor } from '@/features/imperium/imperiumProvinces';
import { impText } from '@/features/imperium/imperiumCatalog';
import type { CrisisEvent } from '@/features/imperium/crisisGenerator';
import { Battle3D } from '@/features/imperium/Battle3D';
import { MapBattleTheater, type TheaterReport } from '@/features/imperium/MapBattleTheater';
import { appendLedger, loadLedger, computeProfile, iqRankKey } from '@/features/imperium/commanderLedger';
import { PARALLELS } from '@/features/imperium/battleParallels';
import {
  saveCampaign, loadCampaign, listLocalCampaigns, deleteCampaign,
  pushTurnBlock, pushRollback,
} from '@/features/imperium/imperiumStore';

// ── Faction palette ───────────────────────────────────────────────────────────

const FACTION_COLOR: Record<FactionId | 'neutral', string> = {
  player: '#d9a54a',
  rival: '#c0455a',
  neutral: '#5a6472',
};

const TACTICS: { id: Tactic; icon: typeof Zap; key: string }[] = [
  { id: 'charge', icon: Zap, key: 'imp_tactic_charge' },
  { id: 'volley', icon: Target, key: 'imp_tactic_volley' },
  { id: 'hold', icon: Shield, key: 'imp_tactic_hold' },
];

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

/** Compact Clio mark for the tactical-read header. */
function ClioMark() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill="#1c0a02" stroke="#a78bfa" strokeWidth="1.4" />
      <path d="M7 8 L9 5 L12 6.5 L15 5 L17 8" fill="none" stroke="#f59e0b" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="9.5" cy="12" r="1.1" fill="#f5f0e6" />
      <circle cx="14.5" cy="12" r="1.1" fill="#f5f0e6" />
      <path d="M10 15 Q12 16.4 14 15" stroke="#c8956c" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function provinceName(id: string, language: Language): string {
  return impText(`imp_prov_${id}`, language);
}

/** Localized display name for an engine army id like "player-army-2". */
function armyName(armyId: string, language: Language): string {
  const n = Number(armyId.split('-').pop()) || 1;
  return impText('imp_army_name', language, { n: ROMAN[n - 1] ?? String(n) });
}

const TUTORIAL_KEY = 'historify:imperium:tutorial-seen';

// ── Shared bits ───────────────────────────────────────────────────────────────

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

// ── How-to-play council (first-run overlay, reopenable) ───────────────────────

function TutorialOverlay({ language, onClose }: { language: Language; onClose: () => void }) {
  const ti = (k: string) => impText(k, language);
  const STEPS = [
    { icon: MapPin, t: 'imp_tut_1_t', b: 'imp_tut_1_b' },
    { icon: Swords, t: 'imp_tut_2_t', b: 'imp_tut_2_b' },
    { icon: Network, t: 'imp_tut_3_t', b: 'imp_tut_3_b' },
    { icon: Flag, t: 'imp_tut_4_t', b: 'imp_tut_4_b' },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.92, rotateX: 8 }} animate={{ scale: 1, rotateX: 0 }}
        style={{ transformPerspective: 900 }}
        className="w-full max-w-lg rounded-2xl border border-primary/30 bg-layer-1 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-lg font-bold">{ti('imp_help')}</h3>
        </div>
        <div className="space-y-3">
          {STEPS.map(({ icon: Icon, t, b }, i) => (
            <motion.div key={t} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + i * 0.1 }}
              className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{ti(t)}</p>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{ti(b)}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <Button className="w-full" onClick={onClose}>{ti('imp_got_it')}</Button>
      </motion.div>
    </motion.div>
  );
}

// ── Battle replay: 3D stage + explained modifiers ─────────────────────────────

function BattleReplay({ battle, language, weather, onDone }: {
  battle: TurnResult['battles'][number];
  language: Language;
  weather: CampaignState['current']['weather'];
  onDone: () => void;
}) {
  const { resolution, pending } = battle;
  const [tickIdx, setTickIdx] = useState(-1);
  const done = tickIdx >= resolution.ticks.length - 1;

  useEffect(() => {
    if (done) return;
    const timer = setTimeout(() => setTickIdx(i => i + 1), tickIdx < 0 ? 1000 : 850);
    return () => clearTimeout(timer);
  }, [tickIdx, done]);

  const view = useMemo(() => {
    let aS = resolution.attacker.strength, dS = resolution.defender.strength;
    let aM = resolution.attacker.morale, dM = resolution.defender.morale;
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

  const atkRoster = ROSTERS.find(r => r.id === resolution.attacker.rosterId);
  const defRoster = ROSTERS.find(r => r.id === resolution.defender.rosterId);
  const verdictKey = resolution.winner === 'stalemate' ? 'imp_stalemate'
    : resolution.winner === 'attacker' ? 'imp_victory' : 'imp_defeat';
  const routedSide = resolution.routed
    ? (resolution.winner === 'attacker' ? 'defender' : 'attacker')
    : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.94, y: 12, rotateX: 6 }} animate={{ scale: 1, y: 0, rotateX: 0 }}
        style={{ transformPerspective: 1000 }}
        className="w-full max-w-2xl rounded-2xl bg-layer-1 border border-white/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><Swords className="w-4 h-4 text-primary" /></div>
          <div className="min-w-0">
            <h3 className="font-heading font-bold truncate">
              {impText('imp_battle', language)} · {provinceName(pending.territoryId, language)}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {impText('imp_battlefield', language)} · {impText(`imp_weather_${weather}`, language)}
            </p>
          </div>
          <Badge variant="outline" className="ml-auto shrink-0 tabular-nums">
            {tickIdx < 0 ? '—' : `${Math.min(tickIdx + 1, resolution.ticks.length)}/${resolution.ticks.length}`}
          </Badge>
        </div>

        {/* ── The 3D battlefield ── */}
        <div className="p-4 pb-2">
          <Battle3D
            ticks={resolution.ticks}
            tickIdx={tickIdx}
            attackerStrength={view.aS}
            defenderStrength={view.dS}
            weather={weather}
            terrain={resolution.terrain}
            routedSide={routedSide && done ? routedSide : null}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 px-4 py-3">
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
                {routedSide === side && done && (
                  <Badge variant="destructive" className="text-[9px] px-1.5">{impText('imp_routed', language)}</Badge>
                )}
              </div>
              <p className="text-sm font-semibold truncate">{rosterKey ? impText(rosterKey, language) : '—'}</p>
              <StatBar label={impText('imp_strength', language)} value={s} color={side === 'attacker' ? FACTION_COLOR.player : FACTION_COLOR.rival} />
              <StatBar label={impText('imp_morale', language)} value={m} color="#7aa2f7" />
            </div>
          ))}
        </div>

        {/* Modifier ledger — the matrix explains its math */}
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {resolution.modifiers.map((m, i) => (
            <Badge key={i} variant="outline" className={cn('text-[10px]',
              m.side === 'attacker' ? 'border-primary/40 text-primary' : 'border-red-400/40 text-red-300')}>
              {impText(m.labelKey, language)} +{m.value}%
            </Badge>
          ))}
        </div>

        <div className="px-5 pb-5 flex items-center justify-between">
          <AnimatePresence>
            {done && (
              <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
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

// ── Commander's Ledger: decision-quality analytics drawer ─────────────────────

function LedgerPanel({ campaignId, language, onClose }: {
  campaignId: string;
  language: Language;
  onClose: () => void;
}) {
  const entries = loadLedger(campaignId);
  const profile = computeProfile(entries);
  const TAC_KEY: Record<string, string> = { charge: 'imp_tactic_charge', volley: 'imp_tactic_volley', hold: 'imp_tactic_hold' };
  const coachKey = profile.iq >= 68 ? 'imp_ledger_coach_high' : profile.iq >= 45 ? 'imp_ledger_coach_mid' : 'imp_ledger_coach_low';
  const gradeColor = (g: string) =>
    g === 'S' || g === 'A' ? 'text-emerald-300 border-emerald-400/40' :
    g === 'B' ? 'text-amber-300 border-amber-400/40' :
    g === 'C' ? 'text-orange-300 border-orange-400/40' : 'text-red-300 border-red-400/40';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1250] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div initial={{ scale: 0.94, y: 14 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-xl max-h-[88vh] overflow-hidden flex flex-col rounded-2xl border border-white/10 bg-layer-1">
        <div className="px-4 sm:px-5 py-4 border-b border-white/5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><ScrollText className="w-4 h-4 text-primary" /></div>
          <div className="min-w-0">
            <h3 className="font-heading font-bold truncate">{impText('imp_ledger_title', language)}</h3>
            {profile.battles > 0 && (
              <p className="text-[11px] text-muted-foreground">{impText(iqRankKey(profile.iq), language)}</p>
            )}
          </div>
          <Button size="icon" variant="ghost" className="ml-auto shrink-0" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>

        {profile.battles === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">{impText('imp_ledger_empty', language)}</p>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-4 sm:p-5 space-y-4">
              {/* Strategic IQ headline */}
              <div className="flex items-center gap-4 rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-950/30 to-transparent p-4">
                <div className="text-center shrink-0">
                  <p className="font-heading text-4xl font-black tabular-nums text-violet-200">{profile.iq}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{impText('imp_ledger_iq', language)}</p>
                </div>
                <p className="text-[12px] leading-relaxed text-violet-100/80 italic">{impText(coachKey, language)}</p>
              </div>

              {/* Stat tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  [impText('imp_ledger_battles', language), String(profile.battles)],
                  [impText('imp_ledger_wins', language), String(profile.wins)],
                  [impText('imp_ledger_counter', language), `${profile.counterRate}%`],
                  [impText('imp_ledger_codex', language), `${profile.parallelsSeen.length}/${PARALLELS.length}`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-center">
                    <p className="font-heading text-lg font-bold tabular-nums">{value}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
                  </div>
                ))}
              </div>

              {profile.favoriteTactic && (
                <p className="text-[11px] text-muted-foreground">
                  {impText('imp_ledger_favorite', language)}: <span className="text-primary font-medium">{impText(TAC_KEY[profile.favoriteTactic], language)}</span>
                </p>
              )}

              {/* Journal rows, newest first */}
              <div className="space-y-1.5">
                {[...entries].reverse().slice(0, 14).map((e, i) => {
                  const par = PARALLELS.find(p => p.id === e.parallelId);
                  return (
                    <div key={i} className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.015] px-2.5 py-2 text-[11px]">
                      <span className={cn('shrink-0 rounded border px-1.5 py-0.5 font-black tabular-nums', gradeColor(e.grade))}>{e.grade}</span>
                      <span className="min-w-0 flex-1 truncate">
                        <span className="text-foreground/90">{provinceName(e.territoryId, language)}</span>
                        <span className="text-muted-foreground"> · {impText(TAC_KEY[e.playerTactic], language)} {impText('imp_read_vs', language)} {impText(TAC_KEY[e.enemyTactic], language)}</span>
                      </span>
                      {par && (
                        <span className="hidden sm:flex items-center gap-1 shrink-0 text-amber-300/80">
                          <Landmark className="w-3 h-3" />{impText(par.titleKey, language)}
                        </span>
                      )}
                      <span className={cn('shrink-0 font-semibold',
                        e.outcome === 'won' ? 'text-amber-300' : e.outcome === 'lost' ? 'text-red-400' : 'text-muted-foreground')}>
                        {impText(e.outcome === 'won' ? 'imp_victory' : e.outcome === 'lost' ? 'imp_defeat' : 'imp_stalemate', language)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Crisis council ────────────────────────────────────────────────────────────

function CrisisCouncil({ crisis, language, chosen, onChoose }: {
  crisis: CrisisEvent;
  language: Language;
  chosen?: string;
  onChoose: (optionId: string) => void;
}) {
  const params: Record<string, string | number> = { ...crisis.params };
  if (typeof params.territory === 'string') params.territory = provinceName(params.territory, language);
  return (
    <motion.div initial={{ opacity: 0, rotateY: -14, x: -10 }} animate={{ opacity: 1, rotateY: 0, x: 0 }}
      style={{ transformPerspective: 700 }}
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
  const [inspectBattle, setInspectBattle] = useState<TurnResult['battles'][number] | null>(null);
  const [showLedger, setShowLedger] = useState(false);
  const [ledgerVersion, setLedgerVersion] = useState(0);
  const [showWeb, setShowWeb] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  // The War Council's running verdict on the ruler's judgment (the intellectual
  // 65% of the campaign). Re-synced whenever the active campaign changes.
  const [doctrine, setDoctrine] = useState<DoctrineState>({ intellectPoints: 0, intellectMax: 0, decisions: 0 });

  const savedCampaigns = useMemo(() => listLocalCampaigns(userId), [userId, campaign?.id]);

  // ── Leaflet lifecycle ──
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const territoryLayerRef = useRef<L.LayerGroup | null>(null);
  const overlayLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!campaign || !mapDivRef.current || mapRef.current) return;
    const map = L.map(mapDivRef.current, { zoomControl: true, attributionControl: false, worldCopyJump: true });
    // Esri's keyless Dark Gray Canvas. CARTO's tiles now arrive stamped
    // "API KEY REQUIRED", which on a campaign map reads as a broken game.
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 10, minZoom: 2 },
    ).addTo(map);
    territoryLayerRef.current = L.layerGroup().addTo(map);
    overlayLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    const spec = theatreSpec(campaign.theatre);
    map.fitBounds(L.latLngBounds(spec.viewBounds.map(([la, ln]) => L.latLng(la, ln))));
    return () => { map.remove(); mapRef.current = null; territoryLayerRef.current = null; overlayLayerRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign?.id]);

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
    const graph = graphFor(campaign.theatre);
    const provinces = provincesFor(campaign.theatre);

    // Province polygons — every dataset ring, tinted by owner.
    for (const pv of provinces) {
      const owner = (snap.ownership.owners[pv.id] ?? 'neutral') as FactionId | 'neutral';
      const color = FACTION_COLOR[owner];
      const isCapital = snap.capitals.player === pv.id || snap.capitals.rival === pv.id;
      for (const ring of pv.rings) {
        const p = L.polygon(ring, {
          color, weight: isCapital ? 2.6 : 1.4, opacity: 0.95,
          fillColor: color, fillOpacity: owner === 'neutral' ? 0.08 : 0.24,
          dashArray: owner === 'neutral' ? '4 4' : undefined,
        }).addTo(layer);
        p.bindTooltip(
          `${provinceName(pv.id, language)}${isCapital ? ' ★' : ''}`,
          { direction: 'center', className: 'imp-tooltip', permanent: false },
        );
        p.on('click', () => {
          const armyId = selectedArmyRef.current;
          if (!armyId) return;
          const army = campaign.current.armies.find(ar => ar.id === armyId && ar.faction === 'player');
          if (!army || army.territoryId === pv.id) return;
          setPendingMarches(prev => ({ ...prev, [armyId]: pv.id }));
        });
      }
      // Province name label at the anchor (capitals get a star).
      const label = L.divIcon({
        className: '',
        html: `<div class="imp-prov-label ${owner}">${isCapital ? '★ ' : ''}${provinceName(pv.id, language)}</div>`,
        iconSize: [120, 16], iconAnchor: [60, -8],
      });
      L.marker(pv.anchor, { icon: label, interactive: false }).addTo(layer);
    }

    // Strategic node web (optional overlay).
    if (showWeb) {
      const seen = new Set<string>();
      for (const [, edges] of graph.adj) {
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
      }
    }

    // March previews: the exact A* corridor of each pending order.
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
      L.polyline(pts, { color: FACTION_COLOR.player, weight: 2.2, opacity: 0.9, dashArray: '6 6', className: 'imp-march-line', interactive: false }).addTo(overlay);
      const end = pts[pts.length - 1];
      L.circleMarker(end, { radius: 5, color: FACTION_COLOR.player, fillColor: FACTION_COLOR.player, fillOpacity: 0.9, interactive: false }).addTo(overlay);
    }

    // Armies in motion: remaining path of active marches.
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

    // Army chips at anchors (stack offset), named I/II per faction.
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
        html: `<div class="imp-army ${army.faction} ${selected ? 'sel' : ''} ${army.supplied ? '' : 'starve'}">⚔ ${armyName(army.id, language)} · ${Math.round(army.strength)}</div>`,
        iconSize: [100, 20], iconAnchor: [50, 26 - n * 16],
      });
      const marker = L.marker([c.lat, c.lng], { icon, zIndexOffset: selected ? 1000 : 0 }).addTo(overlay);
      if (army.faction === 'player') {
        marker.on('click', () => setSelectedArmyId(prev => (prev === army.id ? null : army.id)));
      }
    }
  }, [campaign, pendingMarches, selectedArmyId, showWeb, language]);

  // ── Campaign actions ──
  // Keep the War Council verdict in step with whichever campaign is loaded.
  useEffect(() => {
    if (campaign) setDoctrine(loadDoctrine(userId, campaign.id));
  }, [campaign?.id, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const startCampaign = (theatre: TheatreId) => {
    const state = createCampaign(theatre);
    clearDoctrine(userId, state.id);
    setDoctrine({ intellectPoints: 0, intellectMax: 0, decisions: 0 });
    setCampaign(state);
    setPendingMarches({}); setCrisisChoices({}); setSelectedArmyId(null); setBattleQueue([]);
    saveCampaign(userId, state);
    void pushTurnBlock(state);
    try {
      if (!localStorage.getItem(TUTORIAL_KEY)) { setShowTutorial(true); localStorage.setItem(TUTORIAL_KEY, '1'); }
    } catch { /* storage unavailable */ }
  };

  const resumeCampaign = (id: string) => {
    const state = loadCampaign(userId, id);
    // A resumable campaign needs both its theatre and a current snapshot. When
    // the body is missing (storage evicted, older/partial save) the index entry
    // is stale — remove it and tell the player, rather than leaving a dead
    // "Continue" button that does nothing on click.
    if (state && state.theatre && state.current) {
      setResolving(false);
      setPendingMarches({}); setCrisisChoices({}); setBattleQueue([]);
      setSelectedArmyId(null);
      setTactic(state.playerLeader.signature as Tactic);
      setCampaign(state);
      void pushTurnBlock(state);
      requestAnimationFrame(() => { document.querySelector('main')?.scrollTo({ top: 0 }); window.scrollTo(0, 0); });
    } else {
      deleteCampaign(userId, id);
      toast.error(ti('imp_resume_failed'));
    }
  };

  const abandonCampaign = (id: string) => {
    deleteCampaign(userId, id);
    if (campaign?.id === id) setCampaign(null);
  };

  const endTurn = () => {
    if (!campaign || resolving || campaign.current.over) return;
    setResolving(true);
    // Snapshot the intellectual signals of THIS turn before it resolves: how
    // many crises the ruler faced, how many they actually answered, and how
    // sound their chosen tactic was. The War Council weighs these into Doctrine.
    const facedCrises = campaign.current.activeCrises;
    const answered = facedCrises.filter(c => crisisChoices[c.id]).length;
    const cLat = (theatreSpec(campaign.theatre).viewBounds[0][0] + theatreSpec(campaign.theatre).viewBounds[1][0]) / 2;
    const cLng = (theatreSpec(campaign.theatre).viewBounds[0][1] + theatreSpec(campaign.theatre).viewBounds[1][1]) / 2;
    const turnTacticGrade = rateTactic({
      tactic, enemyTactic: campaign.rivalLeader.signature as Tactic, weather: campaign.current.weather,
      terrain: classifyTerrain(cLat, cLng), leaderSignature: campaign.playerLeader.signature as Tactic,
    }).grade;
    requestAnimationFrame(() => {
      const result = resolveTurn(campaign, { marches: pendingMarches, tactic, crisisChoices });
      setDoctrine(recordTurnJudgment(userId, campaign.id, {
        crisesFaced: facedCrises.length, crisesAnswered: answered, tacticGrade: turnTacticGrade,
      }));
      setCampaign(result.state);
      setPendingMarches({}); setCrisisChoices({}); setSelectedArmyId(null);
      // Only stage battles the player actually fought — the on-map theatre grades
      // *your* tactical move, so rival-vs-neutral skirmishes are not replayed.
      const pid = result.state.playerLeader.id;
      setBattleQueue(result.battles.filter(b =>
        b.resolution.attacker.leader?.id === pid || b.resolution.defender.leader?.id === pid));
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
  const spec = campaign ? theatreSpec(campaign.theatre) : null;
  const playerArmies = snap?.armies.filter(a => a.faction === 'player') ?? [];
  const rivalArmies = snap?.armies.filter(a => a.faction === 'rival') ?? [];
  const holdings = snap ? Object.values(snap.ownership.owners).reduce(
    (acc, f) => { acc[f] += 1; return acc; }, { player: 0, rival: 0 } as Record<FactionId, number>,
  ) : { player: 0, rival: 0 };
  const totalProvinces = campaign ? provincesFor(campaign.theatre).length : 0;
  const rivalLeft = holdings.rival;
  const standing = campaign ? campaignStanding(doctrine, holdings.player, totalProvinces) : null;

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
              <p className="text-muted-foreground text-sm">
                {campaign && spec ? `${ti(spec.nameKey)} · ${spec.year}` : ti('imp_subtitle')}
              </p>
            </div>
          </div>
          {campaign && (
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="gap-1.5 tabular-nums"><Hourglass className="w-3 h-3" />{ti('imp_turn')} {snap?.turn}</Badge>
              <Badge variant="outline" className="gap-1.5"><CloudSun className="w-3 h-3" />{ti(`imp_weather_${snap?.weather ?? 'clear'}`)}</Badge>
              <Badge variant="outline" className="gap-1.5 tabular-nums"><Coins className="w-3 h-3" />{ti('imp_treasury')} {snap?.treasury}</Badge>
              <Badge variant="outline" className="gap-1.5 tabular-nums"><Scale3d className="w-3 h-3" />{ti('imp_discipline')} {snap?.discipline ?? 0}</Badge>
              {standing && (
                <Badge variant="outline" className="gap-1.5 tabular-nums border-violet-400/50 text-violet-300" title={ti('imp_standing')}>
                  <Brain className="w-3 h-3" />{ti('imp_doctrine')} {standing.intellect}%
                </Badge>
              )}
              <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setShowLedger(true)}>
                <ScrollText className="w-3.5 h-3.5" />{ti('imp_ledger_title')}
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setShowTutorial(true)}>
                <HelpCircle className="w-3.5 h-3.5" />{ti('imp_help')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCampaign(null)}>{ti('imp_theatre')}</Button>
            </div>
          )}
        </motion.div>

        <PlanGate plan="master" description={ti('imp_gate')}>
          {/* ── Theatre setup ── */}
          {!campaign && (
            <div className="space-y-6">
              <h2 className="font-heading text-lg font-semibold">{ti('imp_setup_pick')}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ perspective: 1200 }}>
                {THEATRE_SPECS.map(sp => {
                  const { territories } = theatreSummary(sp.id);
                  return (
                    <motion.button key={sp.id}
                      whileHover={{ y: -4, rotateX: 4, rotateY: -3, scale: 1.015 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ transformStyle: 'preserve-3d' }}
                      onClick={() => startCampaign(sp.id)}
                      className="text-left rounded-2xl border border-white/10 bg-layer-1 p-5 space-y-3 hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <MapPin className="w-5 h-5 text-primary" />
                        <Badge variant="outline" className="text-[10px] tabular-nums">{territories} {ti('imp_territories')} · {sp.year}</Badge>
                      </div>
                      <div>
                        <p className="font-heading font-bold">{ti(sp.nameKey)}</p>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{ti(sp.taglineKey)}</p>
                        <p className="text-[11px] mt-2">
                          <span className="text-amber-400">{ti(sp.playerFactionKey)}</span>
                          <span className="text-muted-foreground"> ⚔ </span>
                          <span className="text-red-400">{ti(sp.rivalFactionKey)}</span>
                        </p>
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
                          <p className="text-sm font-semibold truncate">
                            {(() => {
                              const st = THEATRE_SPECS.find(sp => entry.id.includes(sp.id));
                              return st ? ti(st.nameKey) : entry.id;
                            })()}
                          </p>
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
          {campaign && snap && spec && (
            <div className="grid lg:grid-cols-[1fr_340px] gap-4">
              <div className="space-y-2 min-w-0">
                {/* Objective banner */}
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-layer-1 px-4 py-2.5">
                  <Flag className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-[12px] text-muted-foreground flex-1 min-w-0 truncate">{ti('imp_objective')}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] tabular-nums text-amber-400">{holdings.player}/{totalProvinces} {ti('imp_provinces_held')}</span>
                    <div className="w-28 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-700"
                        style={{ width: `${(holdings.player / Math.max(1, totalProvinces)) * 100}%` }} />
                    </div>
                    <span className="text-[11px] tabular-nums text-red-400">{rivalLeft}</span>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-white/10">
                  <div ref={mapDivRef} className="h-[46vh] lg:h-[calc(100vh-19rem)] w-full bg-layer-0" />
                  {/* Faction scoreboard */}
                  <div className="absolute top-3 left-3 z-[1000] flex gap-2 flex-wrap">
                    <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur border border-amber-400/40 flex items-center gap-1.5 text-[12px]">
                      <span className="w-2 h-2 rounded-full" style={{ background: FACTION_COLOR.player }} />
                      <span className="text-amber-300">{ti(spec.playerFactionKey)}</span>
                      <span className="tabular-nums text-muted-foreground">{holdings.player}</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur border border-red-400/40 flex items-center gap-1.5 text-[12px]">
                      <span className="w-2 h-2 rounded-full" style={{ background: FACTION_COLOR.rival }} />
                      <span className="text-red-300">{ti(spec.rivalFactionKey)}</span>
                      <span className="tabular-nums text-muted-foreground">{holdings.rival}</span>
                    </div>
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
                  <AnimatePresence>
                    {snap.over && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="absolute inset-0 z-[1001] bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-center p-6">
                        <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 1.6, ease: 'easeOut' }}>
                          <Crown className={cn('w-12 h-12', snap.playerWon ? 'text-primary' : 'text-red-400')} />
                        </motion.div>
                        <h2 className="font-heading text-3xl font-bold">{ti(snap.playerWon ? 'imp_victory' : 'imp_defeat')}</h2>
                        <p className="text-muted-foreground max-w-md">{ti(snap.playerWon ? 'imp_campaign_won' : 'imp_campaign_lost')}</p>
                        <Button className="mt-2" onClick={() => setCampaign(null)}>{ti('imp_new_campaign')}</Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* On-map battle theatre: armies clash on the ground they contest */}
                  <AnimatePresence>
                    {battleQueue.length > 0 && (
                      <MapBattleTheater
                        key={battleQueue[0].pending.id}
                        battle={battleQueue[0]}
                        map={mapRef.current}
                        playerLeaderId={campaign.playerLeader.id}
                        weather={snap.weather}
                        language={language}
                        provinceName={(id) => provinceName(id, language)}
                        onResolved={(report: TheaterReport) => {
                          // Journal the decision into the Commander's Ledger.
                          appendLedger(campaign.id, {
                            turn: snap.turn,
                            territoryId: report.territoryId,
                            playerTactic: report.playerTactic,
                            enemyTactic: report.enemyTactic,
                            terrain: battleQueue[0].resolution.terrain,
                            weather: snap.weather,
                            grade: report.grade,
                            outcome: report.outcome,
                            parallelId: report.parallelId,
                            at: new Date().toISOString(),
                          });
                          setLedgerVersion(v => v + 1);
                          setInspectBattle(null);
                          setBattleQueue(q => q.slice(1));
                        }}
                        onInspect={() => setInspectBattle(battleQueue[0])}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Rollback bar */}
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
                <div className="rounded-2xl border border-white/10 bg-layer-1 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-primary" />
                    <h3 className="font-heading font-semibold text-sm">{ti('imp_council')}</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{ti('imp_choose_tactic')} · {ti('imp_triangle_hint')}</p>
                  <div className="grid grid-cols-3 gap-2" style={{ perspective: 500 }}>
                    {TACTICS.map(({ id, icon: Icon, key }) => (
                      <motion.button key={id} onClick={() => setTactic(id)}
                        whileHover={{ rotateX: 8, y: -2 }} whileTap={{ scale: 0.95 }}
                        className={cn('rounded-xl border px-2 py-2.5 flex flex-col items-center gap-1 text-[11px] transition-all',
                          tactic === id
                            ? 'border-primary/60 bg-primary/15 text-primary scale-[1.02]'
                            : 'border-white/10 bg-white/[0.02] text-muted-foreground hover:border-primary/30')}>
                        <Icon className="w-4 h-4" />{ti(key)}
                      </motion.button>
                    ))}
                  </div>

                  {/* ── Clio's Tactical Read — grades the chosen tactic live ── */}
                  {(() => {
                    const cLat = (spec.viewBounds[0][0] + spec.viewBounds[1][0]) / 2;
                    const cLng = (spec.viewBounds[0][1] + spec.viewBounds[1][1]) / 2;
                    const terrain = classifyTerrain(cLat, cLng);
                    const enemyTactic = campaign.rivalLeader.signature as Tactic;
                    const read = rateTactic({
                      tactic, enemyTactic, weather: snap.weather, terrain,
                      leaderSignature: campaign.playerLeader.signature as Tactic,
                    });
                    const TAC_KEY: Record<Tactic, string> = { charge: 'imp_tactic_charge', volley: 'imp_tactic_volley', hold: 'imp_tactic_hold' };
                    const best = (['charge', 'volley', 'hold'] as Tactic[])
                      .map(t => rateTactic({ tactic: t, enemyTactic, weather: snap.weather, terrain, leaderSignature: campaign.playerLeader.signature as Tactic }))
                      .sort((a, b) => b.score - a.score)[0];
                    const gradeColor = read.grade === 'S' ? 'text-emerald-300 border-emerald-400/50 bg-emerald-500/10'
                      : read.grade === 'A' ? 'text-emerald-400 border-emerald-400/40 bg-emerald-500/[0.07]'
                      : read.grade === 'B' ? 'text-amber-300 border-amber-400/40 bg-amber-500/[0.07]'
                      : read.grade === 'C' ? 'text-orange-300 border-orange-400/40 bg-orange-500/[0.07]'
                      : 'text-red-300 border-red-400/50 bg-red-500/10';
                    return (
                      <motion.div key={`${tactic}-${snap.turn}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-950/30 to-transparent p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <ClioMark />
                          <span className="text-[11px] font-heading font-semibold text-violet-200">{ti('imp_read_title')}</span>
                          <span className={cn('ml-auto rounded-md border px-2 py-0.5 text-[13px] font-black tabular-nums', gradeColor)}>{read.grade}</span>
                        </div>
                        <p className="text-[11px] leading-snug text-foreground/90">{ti(read.headlineKey)}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <span className="text-primary font-medium">{ti(TAC_KEY[tactic])}</span>
                          <span>{ti('imp_read_vs')}</span>
                          <span className="text-red-300 font-medium">{ti(TAC_KEY[enemyTactic])}</span>
                        </div>
                        <ul className="space-y-0.5">
                          {read.reasons.filter(r => r.delta !== 0).slice(0, 4).map((r, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[10.5px] leading-snug">
                              <span className={cn('tabular-nums font-semibold shrink-0 w-7 text-right', r.delta > 0 ? 'text-emerald-400' : 'text-red-400')}>
                                {r.delta > 0 ? '+' : ''}{r.delta}
                              </span>
                              <span className="text-muted-foreground">{ti(r.key)}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-[10px] italic text-violet-300/90 flex items-start gap-1 pt-0.5 border-t border-white/5">
                          <span className="not-italic">💡</span>
                          {best.tactic === tactic
                            ? ti('imp_read_optimal')
                            : ti('imp_read_switch').replace('{tactic}', ti(TAC_KEY[best.tactic]))}
                        </p>
                      </motion.div>
                    );
                  })()}

                  <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>{ti('imp_leader')}: <span className="text-foreground">{ti(campaign.playerLeader.nameKey)}</span></span>
                    <span className="text-right">{ti(ROSTERS.find(r => r.id === campaign.playerRosterId)?.nameKey ?? '')}</span>
                  </div>
                  <Button className="w-full gap-2" disabled={resolving || snap.over} onClick={endTurn}>
                    <Swords className="w-4 h-4" />{ti('imp_end_turn')}
                  </Button>
                </div>

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

                {/* ── War Council: the intellectual 65% of the campaign ── */}
                {standing && (
                  <div className="rounded-2xl border border-violet-400/25 bg-gradient-to-br from-violet-950/30 to-transparent p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-violet-300" />
                      <h3 className="font-heading font-semibold text-sm text-violet-100">{ti('imp_council_title')}</h3>
                      <span className="ml-auto text-lg font-black tabular-nums text-violet-200">{standing.standing}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">{ti('imp_council_intro')}</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10.5px]">
                        <span className="text-violet-300 font-medium">{ti('imp_council_intellect')}</span>
                        <span className="tabular-nums text-violet-200">{standing.intellect}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400" style={{ width: `${standing.intellect}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[10.5px] pt-0.5">
                        <span className="text-amber-300/90 font-medium">{ti('imp_council_might')}</span>
                        <span className="tabular-nums text-amber-200/90">{standing.might}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400" style={{ width: `${standing.might}%` }} />
                      </div>
                    </div>
                  </div>
                )}

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
                          <span className="text-sm font-semibold truncate">
                            {armyName(army.id, language)} · {ti('imp_at')} {provinceName(army.territoryId, language)}
                          </span>
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
                            {ti(pendingMarches[army.id] ? 'imp_march_ordered' : 'imp_marching')}: {provinceName(marchTarget, language)}
                          </p>
                        )}
                      </button>
                    );
                  })}
                  <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{ti(spec.rivalFactionKey)}</span>
                    <span className="tabular-nums flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: FACTION_COLOR.rival }} />
                      ⚔ {rivalArmies.length} · {ti(campaign.rivalLeader.nameKey)}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-layer-1 p-4">
                  <h3 className="font-heading font-semibold text-sm mb-2">{ti('imp_log')}</h3>
                  <ScrollArea className="h-36">
                    <div className="space-y-1 pr-2">
                      {[...snap.log].reverse().slice(0, 40).map((line, i) => {
                        const params: Record<string, string | number> = { ...(line.params ?? {}) };
                        if (typeof params.territory === 'string') params.territory = provinceName(params.territory, language);
                        if (typeof params.army === 'string') params.army = armyName(params.army, language);
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

      <AnimatePresence>
        {inspectBattle && snap && (
          <BattleReplay key={`inspect-${inspectBattle.pending.id}`}
            battle={inspectBattle} language={language} weather={snap.weather}
            onDone={() => setInspectBattle(null)} />
        )}
        {showTutorial && (
          <TutorialOverlay key="tutorial" language={language} onClose={() => setShowTutorial(false)} />
        )}
        {showLedger && campaign && (
          <LedgerPanel key={`ledger-${ledgerVersion}`} campaignId={campaign.id} language={language} onClose={() => setShowLedger(false)} />
        )}
      </AnimatePresence>

      <style>{`
        .imp-army {
          display: inline-flex; align-items: center; justify-content: center; gap: 3px;
          padding: 2px 8px; border-radius: 9999px; white-space: nowrap;
          font: 600 10px/1.4 system-ui, sans-serif; color: #0d0b07;
          border: 1.5px solid rgba(255,255,255,0.35);
          box-shadow: 0 3px 10px rgba(0,0,0,0.6);
          transition: transform .15s ease;
          cursor: pointer;
        }
        .imp-army.player { background: ${FACTION_COLOR.player}; }
        .imp-army.rival  { background: ${FACTION_COLOR.rival}; color: #fff; cursor: default; }
        .imp-army.sel    { transform: scale(1.16) translateY(-2px); border-color: #fff; }
        .imp-army.starve { animation: impStarve 1.2s ease-in-out infinite; }
        @keyframes impStarve { 0%,100% { box-shadow: 0 0 0 0 rgba(220,60,80,.7);} 50% { box-shadow: 0 0 0 6px rgba(220,60,80,0);} }
        .imp-prov-label {
          text-align: center; font: 700 10px/1.2 var(--font-heading, serif);
          letter-spacing: .06em; text-transform: uppercase; pointer-events: none;
          text-shadow: 0 1px 4px rgba(0,0,0,.9), 0 0 10px rgba(0,0,0,.7);
        }
        .imp-prov-label.player { color: #ecd9ae; }
        .imp-prov-label.rival { color: #f2b7c0; }
        .imp-prov-label.neutral { color: #9aa3b2; }
        .imp-march-line { animation: impMarchDash 1.2s linear infinite; }
        @keyframes impMarchDash { to { stroke-dashoffset: -24; } }
        .imp-tooltip {
          background: rgba(10,10,14,.92); border: 1px solid rgba(217,165,74,.35);
          color: #e8e2d5; font-size: 11px; border-radius: 8px; padding: 3px 8px;
        }
        .imp-tooltip::before { display: none; }
      `}</style>
    </AppShell>
  );
}
