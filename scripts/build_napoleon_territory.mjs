#!/usr/bin/env node
/**
 * Rebuild the Napoleonic France territory from real historical geometry.
 *
 * The first attempt at this topic was drawn by hand: ten rings of round
 * coordinates that looked, accurately, like someone had traced a shape from
 * memory. Every other timeline in the app draws borders from the
 * aourednik/historical-basemaps dataset, and they look like borders. This makes
 * Napoleon match.
 *
 * The dataset has no 1812 snapshot - it jumps 1800 to 1815, from the Consulate
 * to after Waterloo, and neither is the empire at its height. So the 1812
 * configuration is assembled from the 1800 component states, which is where the
 * real coastlines and river borders live:
 *
 *   Empire     the French departments, plus everything annexed by 1812 - the
 *              Netherlands, the Hanseatic ports, Piedmont, the Tuscan duchies
 *              and the Papal States.
 *   Satellites Spain, Switzerland, the Confederation of the Rhine states, the
 *              Kingdom of Italy and Naples.
 *
 * The Duchy of Warsaw is deliberately absent. It was created in 1807 from
 * Prussian Poland and does not exist in the 1800 snapshot, and in 1815 its land
 * is already back inside Prussia, Russia and Austria as undivided polygons.
 * Drawing it by hand is exactly the thing this script exists to stop doing.
 *
 *   node scripts/build_napoleon_territory.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SRC = process.env.HB_1800 ?? '/tmp/hb/1800.geojson';
const OUT = path.join(ROOT, 'public/data/map-territories/french-revolution-napoleon.json');

/** Annexed into the Empire itself by 1812 - the "dark green" of the classic map. */
const EMPIRE = [
  'France',                 // includes Belgium, the left bank of the Rhine, Savoy
  'Batavian Republic',      // annexed 1810
  'Austrian Netherlands',
  'Kingdom of Sardinia',    // the Piedmont mainland; the island stayed Savoyard
  'Papal States',           // annexed 1809
  'Parma', 'Modena', 'Lucca', 'Massa', 'Fivizzano', 'Pontremoli',
  'Hamburg', 'Bremen', 'Lübeck', 'Cuxhaven', 'Oldenburg',   // Hanseatic departments
];

/** Client kingdoms and the Confederation of the Rhine - the "light green". */
const SATELLITES = [
  'Spain',
  'Helvetic Republic',
  'Bavaria', 'Baden', 'Saxony', 'Swabia', 'Hanover', 'Brunswick', 'Anhalt',
  'Thuringia', 'Hohenzollern', 'Lippe-Detmold', 'Schaumburg-Lippe',
  'Mecklenburg-Schwerin', 'Mecklenburg-Strelitz',
  'Lombardy',                      // the Kingdom of Italy
  'Kingdom of the Two Sicilies',   // Naples under Murat
];

/**
 * Sardinia the island is a separate polygon from Piedmont under the same name
 * and was never French. Anything whose ring sits inside this box is dropped.
 */
const EXCLUDE_BOXES = [
  { name: 'Kingdom of Sardinia', minLng: 8.0, minLat: 38.8, maxLng: 10.0, maxLat: 41.4 },
];

/** Douglas-Peucker, so a 1.6 MB source becomes a file a browser can fetch. */
function simplify(ring, tolerance) {
  if (ring.length <= 4) return ring;
  const sqTol = tolerance * tolerance;
  const sqSegDist = ([px, py], [x1, y1], [x2, y2]) => {
    let x = x1, y = y1, dx = x2 - x, dy = y2 - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) { x = x2; y = y2; } else if (t > 0) { x += dx * t; y += dy * t; }
    }
    dx = px - x; dy = py - y;
    return dx * dx + dy * dy;
  };
  const keep = new Uint8Array(ring.length);
  keep[0] = keep[ring.length - 1] = 1;
  const stack = [[0, ring.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let maxSq = sqTol, index = -1;
    for (let i = first + 1; i < last; i++) {
      const sq = sqSegDist(ring[i], ring[first], ring[last]);
      if (sq > maxSq) { maxSq = sq; index = i; }
    }
    if (index !== -1) { keep[index] = 1; stack.push([first, index], [index, last]); }
  }
  return ring.filter((_, i) => keep[i]);
}

const ringArea = ring => Math.abs(ring.reduce((a, [x1, y1], i) => {
  const [x2, y2] = ring[(i + 1) % ring.length];
  return a + (x1 * y2 - x2 * y1);
}, 0) / 2);

function insideBox(ring, box) {
  return ring.every(([lng, lat]) =>
    lng >= box.minLng && lng <= box.maxLng && lat >= box.minLat && lat <= box.maxLat);
}

function collect(names, source) {
  const out = [];
  const found = new Set();
  for (const f of source.features) {
    const name = f.properties?.NAME ?? f.properties?.name;
    if (!name || !names.includes(name) || !f.geometry) continue;
    found.add(name);
    const polys = f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates];
    for (const poly of polys) {
      const outer = poly[0];
      if (EXCLUDE_BOXES.some(b => b.name === name && insideBox(outer, b))) continue;
      // Slivers below this survive simplification as visual noise.
      if (ringArea(outer) < 0.05) continue;
      const ring = simplify(outer, 0.02);
      if (ring.length < 4) continue;
      if (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1]) ring.push(ring[0]);
      out.push([ring.map(([lng, lat]) => [Number(lng.toFixed(3)), Number(lat.toFixed(3))])]);
    }
  }
  const missing = names.filter(n => !found.has(n));
  return { polys: out, missing };
}

const source = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const empire = collect(EMPIRE, source);
const satellites = collect(SATELLITES, source);

const feature = (name, polys, fill, stroke, opacity) => ({
  type: 'Feature',
  properties: {
    lesson_id: 16, topic_id: 'french-revolution-napoleon',
    entity_name: name, year_start: 1804, year_end: 1815,
    source: 'aourednik/historical-basemaps', source_snapshot: 'world_1800',
    fill_color: fill, stroke_color: stroke, stroke_width: 2, opacity,
  },
  geometry: { type: 'MultiPolygon', coordinates: polys },
});

const fc = {
  type: 'FeatureCollection',
  features: [
    feature('French Empire (1812)', empire.polys, '#1f7a33', '#2fa04a', 0.62),
    feature('French Satellite States (1812)', satellites.polys, '#9fd39f', '#79c079', 0.45),
  ],
};

fs.writeFileSync(OUT, JSON.stringify(fc));

const count = f => f.geometry.coordinates.reduce((n, p) => n + p[0].length, 0);
console.log(`empire     ${empire.polys.length} polygons, ${count(fc.features[0])} points`);
console.log(`satellites ${satellites.polys.length} polygons, ${count(fc.features[1])} points`);
if (empire.missing.length) console.log(`  empire not found in source: ${empire.missing.join(', ')}`);
if (satellites.missing.length) console.log(`  satellites not found in source: ${satellites.missing.join(', ')}`);
console.log(`wrote ${path.relative(ROOT, OUT)} (${(fs.statSync(OUT).size / 1024).toFixed(0)} kB)`);
