import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Map as MapIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLessonMapData } from '@/features/content/historicalMapsData';

interface Props {
  lessonId: string;
  lessonTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Premium teardrop pin with a soft gold glow, on a parchment-cream label.
function makeMarkerIcon(label: string) {
  return L.divIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer">
      <svg width="22" height="28" viewBox="0 0 22 28" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,.45))">
        <path d="M11 1 C5.5 1 1.5 5 1.5 10.2 C1.5 17 11 27 11 27 C11 27 20.5 17 20.5 10.2 C20.5 5 16.5 1 11 1 Z"
          fill="#8b4513" stroke="#f0e1b9" stroke-width="1.5"/>
        <circle cx="11" cy="10.2" r="3.4" fill="#f0e1b9"/>
      </svg>
      <div style="background:rgba(240,225,185,0.94);color:#2c1810;font-size:10px;font-weight:700;padding:1px 6px;border-radius:5px;white-space:nowrap;margin-top:-2px;font-family:system-ui,sans-serif;max-width:130px;overflow:hidden;text-overflow:ellipsis;box-shadow:0 1px 4px rgba(0,0,0,.4);border:1px solid rgba(139,69,19,0.4)">${label}</div>
    </div>`,
    className: '',
    iconAnchor: [11, 27],
    iconSize: undefined as unknown as L.PointExpression,
  });
}

export function HistoricalMapModal({ lessonId, lessonTitle, open, onOpenChange }: Props) {
  const { t } = useLanguage();
  const mapData = getLessonMapData(lessonId);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!open) {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      return;
    }
    if (!mapData) return;

    // Give Radix UI Dialog a tick to mount the DOM node
    const timer = setTimeout(() => {
      if (!containerRef.current || mapRef.current) return;

      const centerLat = (mapData.bounds.north + mapData.bounds.south) / 2;
      const centerLon = (mapData.bounds.east + mapData.bounds.west) / 2;

      const map = L.map(containerRef.current, {
        center: [centerLat, centerLon],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Premium parchment basemap: CARTO voyager tiles + sepia CSS filter.
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18,
      }).addTo(map);
      if (containerRef.current) {
        containerRef.current.style.filter =
          'sepia(92%) brightness(0.78) contrast(0.88) saturate(0.5) hue-rotate(8deg)';
        containerRef.current.style.background = '#e8d9b5';
      }

      mapData.markers.forEach(m => {
        L.marker([m.lat, m.lon], { icon: makeMarkerIcon(m.label) })
          .bindPopup(`<strong style="font-size:13px">${m.label}</strong>${m.description ? `<br/><span style="font-size:11px;color:#555">${m.description}</span>` : ''}`)
          .addTo(map);
      });

      if (mapData.markers.length > 1) {
        map.fitBounds(
          L.latLngBounds(mapData.markers.map(m => L.latLng(m.lat, m.lon))),
          { padding: [40, 40] }
        );
      }

      mapRef.current = map;
    }, 80);

    return () => clearTimeout(timer);
  }, [open, mapData]);

  if (!mapData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[calc(100vw-2rem)] p-0 overflow-hidden gap-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="flex items-center gap-2 text-base">
            <MapIcon className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{t.lesson_map}: {lessonTitle}</span>
          </DialogTitle>
        </DialogHeader>

        <div ref={containerRef} style={{ height: '420px' }} className="w-full z-0" />

        <div className="p-4 space-y-3 max-h-44 overflow-y-auto border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">{mapData.description}</p>
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              {t.map_key_locations}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
              {mapData.markers.map((m, i) => (
                <div key={i} className="text-xs px-2 py-1 rounded border border-border text-muted-foreground truncate" title={m.label}>
                  {m.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
