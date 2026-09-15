#!/usr/bin/env node
/**
 * Build the territory anchor index for the Atlas.
 *
 * "Follow a territory" asks a question the app could not previously answer:
 * which lessons touch this patch of ground? Answering it at runtime would mean
 * fetching all thirty-odd geometry files and running point-in-polygon on every
 * one, on a page that should feel instant. So it is precomputed here.
 *
 * Reads public/data/map-territories/*.json - the geometry the map actually
 * draws, not the coarser TypeScript rings - and writes, for each anchor, the
 * list of topic ids whose territory contains it.
 *
 *   node scripts/build_territory_anchors.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const GEO_DIR = path.join(ROOT, 'public/data/map-territories');
const OUT = path.join(ROOT, 'src/features/atlas/territoryAnchors.generated.ts');

/**
 * Places with enough history that several eras touch them. Chosen for spread
 * rather than importance: one per major region, so the picker is a world tour
 * and not a tour of Europe.
 */
const ANCHORS = [
  { id: 'macedonia',      name: 'Macedonia',              lat: 41.99, lng: 21.43 },
  { id: 'athens',         name: 'Athens',                 lat: 37.98, lng: 23.73 },
  { id: 'rome',           name: 'Rome',                   lat: 41.90, lng: 12.50 },
  // Thrace rather than the city centre: Istanbul straddles the Bosphorus and
  // the exact point lands in water on every polygon at this resolution.
  { id: 'constantinople', name: 'Constantinople',         lat: 41.10, lng: 28.70 },
  { id: 'paris',          name: 'Paris',                  lat: 48.85, lng: 2.35 },
  { id: 'london',         name: 'London',                 lat: 51.51, lng: -0.13 },
  { id: 'berlin',         name: 'Berlin',                 lat: 52.52, lng: 13.40 },
  { id: 'vienna',         name: 'Vienna',                 lat: 48.21, lng: 16.37 },
  { id: 'moscow',         name: 'Moscow',                 lat: 55.76, lng: 37.62 },
  { id: 'kyiv',           name: 'Kyiv',                   lat: 50.45, lng: 30.52 },
  { id: 'madrid',         name: 'Madrid',                 lat: 40.42, lng: -3.70 },
  { id: 'cairo',          name: 'Cairo',                  lat: 30.04, lng: 31.24 },
  { id: 'jerusalem',      name: 'Jerusalem',              lat: 31.78, lng: 35.22 },
  { id: 'baghdad',        name: 'Baghdad',                lat: 33.31, lng: 44.37 },
  { id: 'delhi',          name: 'Delhi',                  lat: 28.61, lng: 77.21 },
  { id: 'beijing',        name: 'Beijing',                lat: 39.90, lng: 116.41 },
  { id: 'kyoto',          name: 'Kyoto',                  lat: 35.01, lng: 135.77 },
  { id: 'timbuktu',       name: 'Timbuktu',               lat: 16.77, lng: -3.01 },
  { id: 'mexico-city',    name: 'Mexico City',            lat: 19.43, lng: -99.13 },
  // No topic in the dataset covers South America, so an anchor there would be
  // a permanently empty option in the picker.
  { id: 'samarkand',      name: 'Samarkand',              lat: 39.65, lng: 66.96 },
];

/** Ray casting. `ring` is [lng, lat] pairs, GeoJSON order. */
function pointInRing(lat, lng, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const straddles = (yi > lat) !== (yj > lat);
    if (straddles && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function geometryContains(geometry, lat, lng) {
  const polys = geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates];
  for (const poly of polys) {
    // poly[0] is the outer ring; the rest are holes.
    if (!pointInRing(lat, lng, poly[0])) continue;
    const inHole = poly.slice(1).some(hole => pointInRing(lat, lng, hole));
    if (!inHole) return true;
  }
  return false;
}

const index = {};
let files = 0;
for (const file of fs.readdirSync(GEO_DIR).sort()) {
  if (!file.endsWith('.json') || file === '_index.json') continue;
  files++;
  const topicId = file.replace(/\.json$/, '');
  const fc = JSON.parse(fs.readFileSync(path.join(GEO_DIR, file), 'utf8'));
  for (const anchor of ANCHORS) {
    const hit = (fc.features ?? []).some(f => f.geometry && geometryContains(f.geometry, anchor.lat, anchor.lng));
    if (hit) (index[anchor.id] ??= []).push(topicId);
  }
}

const body = `// GENERATED - do not edit. Produced by scripts/build_territory_anchors.mjs
// from the geometry in public/data/map-territories/.
//
// For each anchor: the territory topics whose borders actually enclose it. The
// Atlas turns that into a reading path - only the lessons where this ground
// changed hands.

export interface TerritoryAnchor {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export const TERRITORY_ANCHORS: TerritoryAnchor[] = ${JSON.stringify(ANCHORS, null, 2)};

/** anchor id -> topic ids containing it. */
export const ANCHOR_TOPICS: Record<string, string[]> = ${JSON.stringify(index, null, 2)};
`;

fs.writeFileSync(OUT, body);

const covered = Object.keys(index).length;
console.log(`scanned ${files} geometry files`);
console.log(`${covered} of ${ANCHORS.length} anchors are inside at least one territory`);
for (const a of ANCHORS) {
  console.log(`  ${a.name.padEnd(16)} ${(index[a.id] ?? []).length} topics`);
}
console.log(`wrote ${path.relative(ROOT, OUT)}`);
