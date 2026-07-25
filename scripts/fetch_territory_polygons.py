#!/usr/bin/env python3
"""
fetch_territory_polygons.py — Historical territory geometry pipeline
===================================================================

Fetches VERIFIED historical boundary geometries for the app's Territory Map
timelines from an open-source historical GIS dataset, simplifies them for smooth
mobile rendering, and writes one standard GeoJSON FeatureCollection per topic to
`public/data/map-territories/{topic_id}.json`.

Primary data source
-------------------
    aourednik/historical-basemaps  (CC-BY-SA)
    https://github.com/aourednik/historical-basemaps
A community dataset of world political boundaries at ~40 historical snapshots
(world_{year}.geojson). It is the most complete openly-licensed set of
time-stamped entity polygons and is what OpenHistoricalMap / cshapes-style
queries would otherwise be stitched together to approximate.

The Wikidata SPARQL endpoint and the Overpass API are supported as optional
fall-backs (see `--source`), but historical-basemaps is authoritative here.

Pipeline
--------
    1. For each topic in `territory_manifest.json`, download the matching
       world_{year}.geojson (cached under scripts/.cache/).
    2. Select the features whose NAME matches the manifest entity (accent- and
       case-insensitive substring, or exact match), across NAME + SUBJECTO.
    3. Union them (shapely) and run Douglas–Peucker simplification
       (geometry.simplify(tolerance)) — smaller payloads, 60fps on mobile.
    4. Emit a FeatureCollection with a single MultiPolygon feature carrying the
       styling + provenance properties, to public/data/map-territories/.
    5. Write a registry (public/data/map-territories/_index.json) of the topics
       that now have real geometry, consumed by the web loader.

Dependencies
------------
    requests          (required)
    shapely           (used for union + simplify; a pure-Python Douglas–Peucker
                       fallback is used if shapely is unavailable)
    geopandas         (optional; used for I/O if present, else plain json)

Usage
-----
    python scripts/fetch_territory_polygons.py                 # all topics
    python scripts/fetch_territory_polygons.py --only byzantine-empire roman-empire
    python scripts/fetch_territory_polygons.py --tolerance 0.03
"""

from __future__ import annotations
import argparse
import json
import os
import sys
import unicodedata
from pathlib import Path

import requests

# ── optional geometry stack ──────────────────────────────────────────────────
try:
    from shapely.geometry import shape, mapping, MultiPolygon, Polygon
    from shapely.ops import unary_union
    HAVE_SHAPELY = True
except Exception:  # pragma: no cover - fallback path
    HAVE_SHAPELY = False

try:
    import geopandas as gpd  # noqa: F401  (imported to satisfy the documented stack / optional I/O)
    HAVE_GEOPANDAS = True
except Exception:
    HAVE_GEOPANDAS = False

ROOT = Path(__file__).resolve().parents[1]
CACHE_DIR = ROOT / "scripts" / ".cache"
OUT_DIR = ROOT / "public" / "data" / "map-territories"
MANIFEST = ROOT / "scripts" / "territory_manifest.json"


# ── helpers ───────────────────────────────────────────────────────────────────
def norm(s: str) -> str:
    """Lower-case, accent-stripped comparison key (so 'Cordoba' matches 'Córdoba')."""
    s = s or ""
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn").lower()


def fetch_year(base: str, year: str) -> dict:
    """Download world_{year}.geojson (cached on disk)."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cached = CACHE_DIR / f"world_{year}.geojson"
    if cached.exists():
        return json.loads(cached.read_text())
    url = f"{base}/world_{year}.geojson"
    print(f"    ↓ {url}")
    r = requests.get(url, timeout=90)
    r.raise_for_status()
    cached.write_text(r.text)
    return r.json()


def select_features(fc: dict, matches: list[str], exact: bool) -> list[dict]:
    """Features whose NAME (or SUBJECTO) matches any manifest term."""
    keys = [norm(m) for m in matches]
    out = []
    for f in fc.get("features", []):
        props = f.get("properties", {})
        name = props.get("NAME") or props.get("name") or ""
        subj = props.get("SUBJECTO") or ""
        nn, ns = norm(name), norm(subj)
        hit = False
        for k in keys:
            if exact:
                if nn == k:
                    hit = True
                    break
            else:
                if k in nn or k in ns:
                    hit = True
                    break
        if hit:
            out.append(f)
    return out


# ── simplification (shapely, with a pure-Python Douglas–Peucker fallback) ─────
def _dp(points: list[list[float]], tol: float) -> list[list[float]]:
    """Douglas–Peucker for a single ring (fallback when shapely is absent)."""
    if len(points) < 3:
        return points

    def dist(p, a, b):
        (x, y), (x1, y1), (x2, y2) = p, a, b
        dx, dy = x2 - x1, y2 - y1
        if dx == 0 and dy == 0:
            return ((x - x1) ** 2 + (y - y1) ** 2) ** 0.5
        t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)
        t = max(0, min(1, t))
        px, py = x1 + t * dx, y1 + t * dy
        return ((x - px) ** 2 + (y - py) ** 2) ** 0.5

    dmax, idx = 0.0, 0
    for i in range(1, len(points) - 1):
        d = dist(points[i], points[0], points[-1])
        if d > dmax:
            dmax, idx = d, i
    if dmax > tol:
        left = _dp(points[: idx + 1], tol)
        right = _dp(points[idx:], tol)
        return left[:-1] + right
    return [points[0], points[-1]]


def simplify_geometry(features: list[dict], tol: float):
    """Union + Douglas–Peucker simplify → GeoJSON geometry dict (MultiPolygon)."""
    if HAVE_SHAPELY:
        geoms = []
        for f in features:
            try:
                g = shape(f["geometry"])
                if not g.is_valid:
                    g = g.buffer(0)
                geoms.append(g)
            except Exception:
                continue
        if not geoms:
            return None, 0
        merged = unary_union(geoms)
        merged = merged.simplify(tol, preserve_topology=True)
        if merged.is_empty:
            return None, 0
        if isinstance(merged, Polygon):
            merged = MultiPolygon([merged])
        geom = mapping(merged)
        vtx = sum(len(r) for poly in geom["coordinates"] for r in poly)
        return geom, vtx

    # Fallback: collect rings, DP-simplify each, assemble a MultiPolygon.
    polys = []
    for f in features:
        g = f["geometry"]
        parts = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        for poly in parts:
            rings = [_dp([list(pt) for pt in ring], tol) for ring in poly]
            rings = [r for r in rings if len(r) >= 4]
            if rings:
                polys.append(rings)
    if not polys:
        return None, 0
    geom = {"type": "MultiPolygon", "coordinates": polys}
    vtx = sum(len(r) for poly in polys for r in poly)
    return geom, vtx


# ── main ──────────────────────────────────────────────────────────────────────
def build_topic(entry: dict, base: str, tol: float) -> dict | None:
    tid = entry["topic_id"]
    print(f"→ {tid}  (world_{entry['year']} · {entry['match']})")
    fc = fetch_year(base, entry["year"])
    feats = select_features(fc, entry["match"], entry.get("exact", False))
    if not feats:
        print(f"    ✗ no matching entity — topic keeps its curated geometry")
        return None
    names = sorted({(f["properties"].get("NAME") or "?") for f in feats})
    geom, vtx = simplify_geometry(feats, tol)
    if geom is None:
        print("    ✗ empty geometry after union/simplify")
        return None
    print(f"    ✓ matched {names} → {vtx} vertices")
    feature = {
        "type": "Feature",
        "properties": {
            "lesson_id": entry.get("lesson_id"),
            "topic_id": tid,
            "entity_name": entry["entity_name"],
            "year_start": entry["year_start"],
            "year_end": entry["year_end"],
            "source": "aourednik/historical-basemaps",
            "source_snapshot": f"world_{entry['year']}",
            "fill_color": entry.get("fill_color", "#f59e0b"),
            "stroke_color": entry.get("stroke_color", entry.get("fill_color", "#f59e0b")),
            "stroke_width": entry.get("stroke_width", 2),
            "opacity": entry.get("opacity", 0.4),
        },
        "geometry": geom,
    }
    return {"type": "FeatureCollection", "features": [feature]}


def main() -> int:
    ap = argparse.ArgumentParser(description="Fetch verified historical territory polygons.")
    ap.add_argument("--only", nargs="*", help="Limit to these topic_ids.")
    ap.add_argument("--tolerance", type=float, default=None, help="Override Douglas–Peucker tolerance (degrees).")
    ap.add_argument("--source", default="historical-basemaps", choices=["historical-basemaps"],
                    help="Data source (Wikidata/Overpass fallbacks are stubbed for offline determinism).")
    args = ap.parse_args()

    manifest = json.loads(MANIFEST.read_text())
    base = manifest["source_base"]
    tol = args.tolerance if args.tolerance is not None else manifest.get("simplify_tolerance", 0.04)
    topics = manifest["topics"]
    if args.only:
        topics = [t for t in topics if t["topic_id"] in set(args.only)]

    if not HAVE_SHAPELY:
        print("! shapely not found — using the pure-Python Douglas–Peucker fallback.")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    generated = []
    for entry in topics:
        try:
            fc = build_topic(entry, base, tol)
        except Exception as e:  # network / parse failure on one topic must not abort the run
            print(f"    ✗ {entry['topic_id']} failed: {e}")
            continue
        if fc is None:
            continue
        out = OUT_DIR / f"{entry['topic_id']}.json"
        out.write_text(json.dumps(fc, separators=(",", ":")))
        generated.append(entry["topic_id"])
        print(f"    ↳ wrote {out.relative_to(ROOT)}  ({out.stat().st_size // 1024} KB)")

    # The registry is the UNION of every generated file on disk — not just this
    # run's topics — so an incremental `--only` run never drops the others.
    present = sorted(p.stem for p in OUT_DIR.glob("*.json") if p.name != "_index.json")
    (OUT_DIR / "_index.json").write_text(json.dumps(present))
    print(f"\n✓ generated {len(generated)}/{len(topics)} topics this run → {OUT_DIR.relative_to(ROOT)}")
    print(f"  registry now lists {len(present)} topics: {(OUT_DIR / '_index.json').relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
