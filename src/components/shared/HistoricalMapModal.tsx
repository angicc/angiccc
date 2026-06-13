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

function makeMarkerIcon(label: string) {
  return L.divIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center">
      <div style="background:#ef4444;border:2px solid white;border-radius:50%;width:12px;height:12px;box-shadow:0 1px 4px rgba(0,0,0,.7)"></div>
      <div style="background:rgba(0,0,0,.8);color:white;font-size:10px;font-weight:600;padding:1px 5px;border-radius:4px;white-space:nowrap;margin-top:2px;font-family:sans-serif;max-width:120px;overflow:hidden;text-overflow:ellipsis">${label}</div>
    </div>`,
    className: '',
    iconAnchor: [6, 6],
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

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

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
