// ─── <TerritoryGeoJsonLayer> — glowing historical border layer ───────────────
// A lightweight, self-contained Leaflet overlay that dynamically loads
// `public/data/map-territories/{topicId}.json` (produced by the GIS pipeline in
// scripts/fetch_territory_polygons.py) and renders it as a glowing frontier:
// a dark casing stroke, a soft coloured glow, a crisp border, and a translucent
// fill — the layered multi-stroke look of a premium atlas.
//
// The app's Territory Map uses raw Leaflet, so this component takes the Leaflet
// `map` instance directly (rather than react-leaflet's <MapContainer>). Mount it
// under any Leaflet map:
//
//   <TerritoryGeoJsonLayer map={mapRef.current} topicId="byzantine-empire" />
//
// It adds its own LayerGroup on mount, redraws when `topicId` changes, and
// removes everything on unmount. If the topic has no generated geometry it
// renders nothing (the caller can fall back to curated rings).

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { loadTerritoryGeoJson, type TerritoryFeatureProps } from '@/features/content/territoryGeojson';

export interface TerritoryGeoJsonLayerProps {
  map: L.Map | null;
  topicId: string;
  /** Fit the map to the layer's bounds once it loads. Default false. */
  fitBounds?: boolean;
  /** Called with the feature properties once the geometry loads. */
  onLoad?: (props: TerritoryFeatureProps) => void;
}

export function TerritoryGeoJsonLayer({ map, topicId, fitBounds = false, onLoad }: TerritoryGeoJsonLayerProps) {
  const groupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!map) return;
    const group = L.layerGroup().addTo(map);
    groupRef.current = group;
    let alive = true;

    loadTerritoryGeoJson(topicId).then(fc => {
      if (!alive || !fc || fc.features.length === 0) return;
      const props = fc.features[0].properties;
      const fill = props.fill_color ?? '#f59e0b';
      const stroke = props.stroke_color ?? fill;
      const weight = props.stroke_width ?? 2;
      const fillOpacity = props.opacity ?? 0.4;

      // Leaflet reads GeoJSON in [lng,lat]; L.geoJSON handles the flip. We layer
      // three styled copies for the glowing frontier effect.
      const geo = fc as unknown as GeoJSON.GeoJsonObject;

      // 1. Dark casing — separates the border from busy basemap detail.
      L.geoJSON(geo, { style: { color: '#0b1220', weight: weight + 3, opacity: 0.55, fill: false, lineJoin: 'round', lineCap: 'round' }, interactive: false }).addTo(group);
      // 2. Soft coloured glow.
      L.geoJSON(geo, { style: { color: fill, weight: weight + 6, opacity: 0.18, fill: false, lineJoin: 'round', lineCap: 'round' }, interactive: false }).addTo(group);
      // 3. Crisp frontier + translucent fill.
      const main = L.geoJSON(geo, { style: { color: stroke, weight, opacity: 0.95, fillColor: fill, fillOpacity, lineJoin: 'round', lineCap: 'round' } }).addTo(group);

      if (fitBounds) {
        try { map.fitBounds(main.getBounds(), { padding: [40, 40] }); } catch { /* empty bounds */ }
      }
      onLoad?.(props);
    });

    return () => {
      alive = false;
      group.remove();
      groupRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, topicId]);

  return null;
}

export default TerritoryGeoJsonLayer;
