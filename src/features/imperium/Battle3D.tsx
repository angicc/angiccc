// ─── CHRONOS IMPERIUM · 3D battlefield ────────────────────────────────────────
// A CSS-3D diorama that replays the combat matrix tick by tick: a perspective
// ground plane, unit blocks standing on it as billboards, and every
// AnimationTrigger from the resolver driving a real motion — cavalry lunges on
// a charge, projectile arcs on a volley, blocks toppling when a formation
// shatters, and a full flight from the field on a rout. No WebGL: pure
// perspective/rotate/translate transforms, so it runs everywhere Leaflet does.
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TickResult, UnitClass, Weather } from './combatMatrix';
import type { TerrainKind } from './geoGraph';

export interface Battle3DProps {
  ticks: TickResult[];
  /** Index of the last PLAYED tick (-1 = intro formation). */
  tickIdx: number;
  attackerStrength: number;   // 0–100 at tickIdx (parent computes the rewind)
  defenderStrength: number;
  weather: Weather;
  terrain: TerrainKind;
  routedSide?: 'attacker' | 'defender' | null;
}

const GROUND: Record<TerrainKind, string> = {
  plain: 'linear-gradient(180deg, #2c3a24 0%, #1d2718 100%)',
  desert: 'linear-gradient(180deg, #4a3b22 0%, #33291a 100%)',
  mountain: 'linear-gradient(180deg, #3a3d44 0%, #24262b 100%)',
  river: 'linear-gradient(180deg, #24384a 0%, #182530 100%)',
  coast: 'linear-gradient(180deg, #2b3d3a 0%, #1b2826 100%)',
  sea: 'linear-gradient(180deg, #1d3350 0%, #142238 100%)',
};

const CLASS_GLYPH: Record<UnitClass, string> = { infantry: '🛡️', ranged: '🏹', cavalry: '🐎' };

/** Row layout: which classes stand where (defender mirrored). */
const ROWS: UnitClass[] = ['cavalry', 'ranged', 'infantry'];

interface BlockSpec {
  key: string;
  cls: UnitClass;
  row: number;   // 0 = rear, 2 = front
  col: number;
  alive: boolean;
}

function formation(side: 'attacker' | 'defender', strength: number): BlockSpec[] {
  // 12 blocks at full strength: 4 infantry (front), 4 ranged (middle), 4 cavalry (rear).
  const alivePerRow = (rowStrength: number) => Math.max(0, Math.min(4, Math.ceil(rowStrength / 25 * 3)));
  const perClass = strength / 3;
  const blocks: BlockSpec[] = [];
  ROWS.forEach((cls, row) => {
    const alive = alivePerRow(perClass + (row === 2 ? 8 : 0)); // front rank thins last
    for (let col = 0; col < 4; col++) {
      blocks.push({ key: `${side}-${cls}-${col}`, cls, row, col, alive: col < alive });
    }
  });
  return blocks;
}

export function Battle3D({ ticks, tickIdx, attackerStrength, defenderStrength, weather, terrain, routedSide }: Battle3DProps) {
  const currentTriggers = tickIdx >= 0 && tickIdx < ticks.length ? ticks[tickIdx].triggers : [];
  const has = (side: 'attacker' | 'defender', kind: string) =>
    currentTriggers.some(tr => tr.side === side && tr.kind === kind);

  const atkBlocks = useMemo(() => formation('attacker', attackerStrength), [attackerStrength]);
  const defBlocks = useMemo(() => formation('defender', defenderStrength), [defenderStrength]);

  const atkDamage = tickIdx >= 0 && tickIdx < ticks.length ? ticks[tickIdx].attackerDamage : 0;
  const defDamage = tickIdx >= 0 && tickIdx < ticks.length ? ticks[tickIdx].defenderDamage : 0;

  // Projectile volleys: a handful of arcs whenever a side volleys this tick.
  const volleys: { key: string; from: 'attacker' | 'defender' }[] = [];
  if (has('attacker', 'volley')) for (let i = 0; i < 5; i++) volleys.push({ key: `av-${tickIdx}-${i}`, from: 'attacker' });
  if (has('defender', 'volley')) for (let i = 0; i < 5; i++) volleys.push({ key: `dv-${tickIdx}-${i}`, from: 'defender' });

  const sideMotion = (side: 'attacker' | 'defender') => {
    const dir = side === 'attacker' ? -1 : 1; // attacker pushes "up" the field
    if (routedSide === side) return { y: dir * -140, opacity: 0.15, transition: { duration: 1.4 } };
    if (has(side, 'charge')) return { y: [0, dir * 46, dir * 18], transition: { duration: 0.65, times: [0, 0.55, 1] } };
    // Shield Wall (brace): the line does NOT lunge — it plants, shocks backward a
    // hair as the blow lands, then re-sets. A held, immovable posture.
    if (has(side, 'brace')) return { y: [0, dir * -6, dir * -2, 0], scale: [1, 0.985, 1], transition: { duration: 0.7, times: [0, 0.3, 0.6, 1] } };
    if (has(side, 'melee')) return { y: [0, dir * 14, 0], transition: { duration: 0.5 } };
    if (has(side, 'waver')) return { x: [0, -7, 7, -4, 0], transition: { duration: 0.6 } };
    return { y: 0, x: 0 };
  };

  const braceAtk = has('attacker', 'brace');
  const braceDef = has('defender', 'brace');
  // Deflection sparks: arrows raining onto a braced shield wall skid off it.
  const deflect: { key: string; side: 'attacker' | 'defender' }[] = [];
  if (braceAtk && has('defender', 'volley')) for (let i = 0; i < 6; i++) deflect.push({ key: `da-${tickIdx}-${i}`, side: 'attacker' });
  if (braceDef && has('attacker', 'volley')) for (let i = 0; i < 6; i++) deflect.push({ key: `dd-${tickIdx}-${i}`, side: 'defender' });

  return (
    <div className="imp3d-stage" data-weather={weather}>
      <div className="imp3d-scene">
        {/* Ground plane */}
        <div className="imp3d-ground" style={{ background: GROUND[terrain] }}>
          <div className="imp3d-grid" />
        </div>

        {/* Defender formation (far side) */}
        <motion.div className="imp3d-army imp3d-def" animate={sideMotion('defender')}>
          {defBlocks.map(b => (
            <UnitBlock key={b.key} spec={b} side="defender"
              shattered={!b.alive} shatterNow={has('defender', 'shatter') && !b.alive} />
          ))}
        </motion.div>

        {/* Attacker formation (near side) */}
        <motion.div className="imp3d-army imp3d-atk" animate={sideMotion('attacker')}>
          {atkBlocks.map(b => (
            <UnitBlock key={b.key} spec={b} side="attacker"
              shattered={!b.alive} shatterNow={has('attacker', 'shatter') && !b.alive} />
          ))}
        </motion.div>

        {/* Shield Wall barriers — a locked wall of raised shields that slams up
            in front of the bracing line, shimmers with a metallic parry, and
            holds. This is the Shield Wall's own distinct, dynamic signature. */}
        <AnimatePresence>
          {braceDef && (
            <motion.div key={`wall-def-${tickIdx}`} className="imp3d-wall imp3d-wall-def"
              initial={{ opacity: 0, scaleX: 0.5, y: -10 }}
              animate={{ opacity: [0, 1, 0.85], scaleX: [0.5, 1.06, 1], y: [-10, 0, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, times: [0, 0.55, 1] }}>
              <span className="imp3d-wall-shine" />
              {Array.from({ length: 8 }).map((_, i) => <i key={i} className="imp3d-shield" style={{ left: `${4 + i * 12}%` }} />)}
            </motion.div>
          )}
          {braceAtk && (
            <motion.div key={`wall-atk-${tickIdx}`} className="imp3d-wall imp3d-wall-atk"
              initial={{ opacity: 0, scaleX: 0.5, y: 10 }}
              animate={{ opacity: [0, 1, 0.85], scaleX: [0.5, 1.06, 1], y: [10, 0, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, times: [0, 0.55, 1] }}>
              <span className="imp3d-wall-shine" />
              {Array.from({ length: 8 }).map((_, i) => <i key={i} className="imp3d-shield" style={{ left: `${4 + i * 12}%` }} />)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Deflection sparks where arrows skid off a raised shield wall. */}
        <AnimatePresence>
          {deflect.map((d, i) => (
            <motion.div key={d.key} className="imp3d-deflect"
              initial={{ left: `${14 + i * 12}%`, top: d.side === 'attacker' ? '66%' : '30%', opacity: 0, scale: 0.4, rotate: 0 }}
              animate={{
                left: `${14 + i * 12 + (i % 2 ? 6 : -6)}%`,
                top: d.side === 'attacker' ? '58%' : '38%',
                opacity: [0, 1, 0], scale: [0.4, 1.1, 0.5], rotate: (i % 2 ? 1 : -1) * 40,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >✦</motion.div>
          ))}
        </AnimatePresence>

        {/* Projectile arcs */}
        <AnimatePresence>
          {volleys.map((v, i) => (
            <motion.div key={v.key} className="imp3d-arrow"
              initial={{ left: `${22 + i * 14}%`, top: v.from === 'attacker' ? '74%' : '20%', opacity: 0, scale: 0.6 }}
              animate={{
                top: v.from === 'attacker' ? '22%' : '72%',
                opacity: [0, 1, 1, 0.4],
                scale: [0.6, 1.15, 0.85],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, delay: i * 0.05 }}
            >
              {v.from === 'attacker' ? '➶' : '➴'}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Clash flash on melee contact */}
        <AnimatePresence>
          {(has('attacker', 'melee') || has('attacker', 'charge') || has('defender', 'charge') || braceAtk || braceDef) && tickIdx >= 0 && (
            <motion.div key={`clash-${tickIdx}`} className="imp3d-clash"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1.4, 1.8] }}
              transition={{ duration: 0.55 }} />
          )}
        </AnimatePresence>

        {/* Floating damage numbers */}
        <AnimatePresence>
          {tickIdx >= 0 && atkDamage > 0 && (
            <motion.div key={`dmg-d-${tickIdx}`} className="imp3d-dmg imp3d-dmg-def"
              initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 0], y: -34 }} transition={{ duration: 1 }}>
              −{atkDamage}
            </motion.div>
          )}
          {tickIdx >= 0 && defDamage > 0 && (
            <motion.div key={`dmg-a-${tickIdx}`} className="imp3d-dmg imp3d-dmg-atk"
              initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 0], y: 34 }} transition={{ duration: 1 }}>
              −{defDamage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weather layers */}
        {(weather === 'rain' || weather === 'storm') && <div className="imp3d-rain" />}
        {weather === 'snow' && <div className="imp3d-snow" />}
        {weather === 'heat' && <div className="imp3d-heat" />}
      </div>

      <style>{`
        .imp3d-stage { position: relative; width: 100%; height: 240px; overflow: hidden;
          border-radius: 14px; background: linear-gradient(180deg, #0b1020 0%, #10131d 55%, #0d0f16 100%);
          border: 1px solid rgba(255,255,255,0.07); }
        .imp3d-scene { position: absolute; inset: 0; perspective: 620px; perspective-origin: 50% 30%; }
        .imp3d-ground { position: absolute; left: -18%; right: -18%; top: 26%; bottom: -30%;
          transform: rotateX(58deg); transform-origin: 50% 0%; border-radius: 18px;
          box-shadow: inset 0 0 60px rgba(0,0,0,0.55); }
        .imp3d-grid { position: absolute; inset: 0; border-radius: 18px; opacity: 0.16;
          background-image: linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px);
          background-size: 42px 42px; }
        .imp3d-army { position: absolute; left: 50%; width: 240px; margin-left: -120px;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px 10px; }
        .imp3d-atk { bottom: 8%; }
        .imp3d-def { top: 12%; }
        .imp3d-unit { position: relative; height: 34px; display: flex; align-items: flex-end; justify-content: center;
          transform-style: preserve-3d; transition: transform .6s ease, opacity .6s ease, filter .4s ease; }
        .imp3d-unit .glyph { font-size: 19px; line-height: 1; filter: drop-shadow(0 3px 2px rgba(0,0,0,.6)); }
        .imp3d-unit .base { position: absolute; bottom: -3px; left: 50%; width: 26px; height: 9px; margin-left: -13px;
          border-radius: 50%; transform: rotateX(58deg); }
        .imp3d-unit.atk .base { background: radial-gradient(ellipse at center, rgba(217,165,74,.95), rgba(217,165,74,.25)); }
        .imp3d-unit.def .base { background: radial-gradient(ellipse at center, rgba(192,69,90,.95), rgba(192,69,90,.25)); }
        .imp3d-unit.dead { transform: rotateX(84deg) translateY(9px); opacity: 0.22; filter: grayscale(1); }
        .imp3d-unit.shatter-now { animation: imp3dShatter .7s ease forwards; }
        @keyframes imp3dShatter {
          0% { transform: none; opacity: 1; }
          45% { transform: translateY(-9px) rotateZ(9deg); }
          100% { transform: rotateX(84deg) translateY(9px); opacity: 0.22; filter: grayscale(1); }
        }
        .imp3d-arrow { position: absolute; z-index: 5; font-size: 15px; color: #e8d9a0;
          text-shadow: 0 0 6px rgba(232,217,160,.8); pointer-events: none; }
        /* Shield Wall — a locked, gleaming barrier of interlocked shields. */
        .imp3d-wall { position: absolute; left: 50%; width: 250px; margin-left: -125px; height: 22px; z-index: 4;
          border-radius: 6px; pointer-events: none; transform-origin: 50% 50%;
          background: linear-gradient(180deg, rgba(60,66,84,.96), rgba(30,34,46,.96));
          box-shadow: 0 3px 10px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.18); overflow: hidden; }
        .imp3d-wall-atk { bottom: 30%; border-top: 2px solid rgba(217,165,74,.9); }
        .imp3d-wall-def { top: 34%; border-bottom: 2px solid rgba(192,69,90,.9); }
        .imp3d-shield { position: absolute; top: 3px; width: 15px; height: 16px; margin-left: -7px;
          border-radius: 3px 3px 7px 7px;
          background: radial-gradient(ellipse at 50% 30%, rgba(210,180,120,.95), rgba(120,96,54,.9));
          box-shadow: inset 0 0 3px rgba(0,0,0,.5), 0 0 4px rgba(0,0,0,.4); }
        .imp3d-shield::after { content:''; position:absolute; left:50%; top:2px; width:1.5px; height:12px;
          margin-left:-.75px; background: rgba(255,240,200,.6); }
        .imp3d-wall-shine { position: absolute; top: 0; left: -40%; width: 40%; height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255,245,210,.85), transparent);
          animation: imp3dParry .6s ease-out; }
        @keyframes imp3dParry { from { left: -45%; } to { left: 115%; } }
        .imp3d-deflect { position: absolute; z-index: 6; font-size: 13px; color: #fff4cf;
          text-shadow: 0 0 7px rgba(255,225,150,.95); pointer-events: none; }
        .imp3d-clash { position: absolute; left: 50%; top: 46%; width: 90px; height: 90px; margin: -45px 0 0 -45px;
          border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(255,236,170,.9) 0%, rgba(255,170,80,.35) 45%, transparent 70%); }
        .imp3d-dmg { position: absolute; left: 50%; transform: translateX(-50%); font: 800 18px/1 var(--font-heading, serif);
          pointer-events: none; z-index: 6; }
        .imp3d-dmg-def { top: 18%; color: #ff8896; text-shadow: 0 0 8px rgba(255,80,100,.7); }
        .imp3d-dmg-atk { bottom: 18%; color: #ffd98a; text-shadow: 0 0 8px rgba(255,200,90,.7); }
        .imp3d-rain { position: absolute; inset: 0; pointer-events: none; opacity: .5;
          background-image: repeating-linear-gradient(115deg, transparent 0 7px, rgba(160,190,255,.35) 7px 8px);
          animation: imp3dRain .5s linear infinite; }
        @keyframes imp3dRain { to { background-position: -60px 120px; } }
        .imp3d-snow { position: absolute; inset: 0; pointer-events: none; opacity: .6;
          background-image: radial-gradient(rgba(255,255,255,.8) 1px, transparent 1.6px);
          background-size: 26px 26px; animation: imp3dSnow 3.2s linear infinite; }
        @keyframes imp3dSnow { to { background-position: 14px 110px; } }
        .imp3d-heat { position: absolute; inset: 0; pointer-events: none; opacity: .3;
          background: linear-gradient(0deg, rgba(255,140,50,.25), transparent 55%);
          animation: imp3dHeat 2.4s ease-in-out infinite alternate; }
        @keyframes imp3dHeat { to { opacity: .5; } }
      `}</style>
    </div>
  );
}

function UnitBlock({ spec, side, shattered, shatterNow }: {
  spec: BlockSpec;
  side: 'attacker' | 'defender';
  shattered: boolean;
  shatterNow: boolean;
}) {
  // Rear rows sit "deeper" in the scene: smaller + higher for the defender,
  // larger + lower for the attacker — cheap parallax that sells the depth.
  const depth = side === 'attacker' ? spec.row : 2 - spec.row;
  const scale = 0.82 + depth * 0.11;
  return (
    <div
      className={`imp3d-unit ${side === 'attacker' ? 'atk' : 'def'} ${shattered ? (shatterNow ? 'shatter-now' : 'dead') : ''}`}
      style={{ transform: shattered ? undefined : `scale(${scale})`, order: spec.row * 4 + spec.col }}
    >
      <span className="glyph">{CLASS_GLYPH[spec.cls]}</span>
      <span className="base" />
    </div>
  );
}
