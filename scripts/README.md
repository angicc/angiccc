# Territory geometry pipeline

Fetches **verified historical boundary geometry** for the Territory Map from the
open, CC-BY-SA [`aourednik/historical-basemaps`](https://github.com/aourednik/historical-basemaps)
dataset, simplifies it (Douglas–Peucker) for smooth mobile rendering, and writes
one GeoJSON `FeatureCollection` per topic to `public/data/map-territories/`.

## Run

```bash
pip install requests shapely            # geopandas optional
python scripts/fetch_territory_polygons.py                       # all mapped topics
python scripts/fetch_territory_polygons.py --only roman-empire   # one topic
python scripts/fetch_territory_polygons.py --tolerance 0.03      # finer detail
```

- **Manifest:** `scripts/territory_manifest.json` maps each Territory Map topic
  to a source snapshot year + entity name(s). Add/adjust entries there.
- **Output:** `public/data/map-territories/{topic_id}.json` (+ `_index.json`).
- The web app loads these at runtime via `src/features/content/territoryGeojson.ts`
  and renders them with glowing borders on the Territory Map; topics without a
  generated file keep their curated in-app geometry.

Migration routes, oceanic voyages, pre-Columbian cultures, and multi-state
composites (which have no single clean entity in the dataset) intentionally stay
on their curated geometry.
