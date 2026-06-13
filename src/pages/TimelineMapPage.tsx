import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { TERRITORY_TOPICS, type TerritoryTopic } from '@/features/content/timelineTerritoryData';
import type { Language } from '@/i18n/translations';
import { Map as MapIcon, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const ERA_COLORS = {
  ancient:      'text-amber-400',
  medieval:     'text-blue-400',
  'early-modern': 'text-emerald-400',
  modern:       'text-rose-400',
} as const;

const ERA_BG = {
  ancient:      'bg-amber-400/10',
  medieval:     'bg-blue-400/10',
  'early-modern': 'bg-emerald-400/10',
  modern:       'bg-rose-400/10',
} as const;

const ERA_BORDER = {
  ancient:      'border-amber-400/40',
  medieval:     'border-blue-400/40',
  'early-modern': 'border-emerald-400/40',
  modern:       'border-rose-400/40',
} as const;

const ERA_LABELS: Record<string, Record<Language, string>> = {
  ancient:        { en: 'Ancient World',  es: 'Mundo Antiguo',       ru: 'Древний Мир',          mk: 'Античко Доба' },
  medieval:       { en: 'Middle Ages',    es: 'Edad Media',           ru: 'Средние Века',          mk: 'Среден Век' },
  'early-modern': { en: 'Early Modern',   es: 'Época Moderna Temprana', ru: 'Раннее Новое Время', mk: 'Рано Модерно Доба' },
  modern:         { en: 'Modern Era',     es: 'Era Moderna',          ru: 'Современная Эпоха',    mk: 'Модерна Ера' },
};

function getTitle(topic: TerritoryTopic, language: Language): string {
  if (language === 'en') return topic.title;
  return topic.titleI18n[language as Exclude<Language, 'en'>] ?? topic.title;
}

function makeMarkerIcon(name: string) {
  return L.divIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center">
      <div style="background:#ef4444;border:2px solid white;border-radius:50%;width:12px;height:12px;box-shadow:0 1px 4px rgba(0,0,0,.6)"></div>
      <div style="background:rgba(0,0,0,.75);color:white;font-size:10px;font-weight:600;padding:1px 5px;border-radius:4px;white-space:nowrap;margin-top:2px;font-family:sans-serif;box-shadow:0 1px 3px rgba(0,0,0,.5)">${name}</div>
    </div>`,
    className: '',
    iconAnchor: [6, 6],
    iconSize: undefined as unknown as L.PointExpression,
  });
}

export default function TimelineMapPage() {
  const { t, language } = useLanguage();
  const [selected, setSelected] = useState<TerritoryTopic | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Layer[]>([]);

  // Initialize Leaflet once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [30, 20],
      zoom: 2,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Update markers + fly when selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach(l => map.removeLayer(l));
    markersRef.current = [];

    if (!selected) return;

    map.flyTo(selected.center, selected.zoom, { duration: 1.2 });

    selected.markers.forEach(m => {
      const marker = L.marker([m.lat, m.lng], { icon: makeMarkerIcon(m.name) })
        .bindPopup(`<strong style="font-size:13px">${m.name}</strong>${m.note ? `<br/><span style="font-size:11px;color:#555">${m.note}</span>` : ''}`)
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [selected]);

  const eras = ['ancient', 'medieval', 'early-modern', 'modern'] as const;

  return (
    <AppShell compact>
      <div className="h-full flex overflow-hidden">
        {/* ── Left panel ── */}
        <div className="w-60 sm:w-72 shrink-0 border-r border-border bg-card/95 backdrop-blur-sm flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-3 pt-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2 mb-0.5">
              <MapIcon className="w-4 h-4 text-primary shrink-0" />
              <h1 className="font-heading font-bold text-sm leading-tight">{t.tmap_title}</h1>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">{t.tmap_subtitle}</p>
          </div>

          {/* Topic list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            {eras.map(era => {
              const topics = TERRITORY_TOPICS.filter(tp => tp.era === era);
              return (
                <div key={era}>
                  <p className={cn('text-[10px] font-bold uppercase tracking-widest px-2 pb-1', ERA_COLORS[era])}>
                    {ERA_LABELS[era][language]}
                  </p>
                  <div className="space-y-0.5">
                    {topics.map(topic => {
                      const isActive = selected?.id === topic.id;
                      return (
                        <button
                          key={topic.id}
                          onClick={() => setSelected(isActive ? null : topic)}
                          className={cn(
                            'w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all flex items-center gap-2 group',
                            isActive
                              ? cn('font-semibold border', ERA_COLORS[era], ERA_BG[era], ERA_BORDER[era])
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                          )}
                        >
                          <ChevronRight className={cn(
                            'w-3 h-3 shrink-0 transition-transform',
                            isActive ? 'rotate-90' : 'group-hover:translate-x-0.5'
                          )} />
                          <span className="leading-snug">{getTitle(topic, language)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Map panel ── */}
        <div className="flex-1 relative">
          {/* Leaflet container fills everything */}
          <div ref={mapContainerRef} className="absolute inset-0 z-0" />

          {/* Topic info overlay (top-right) */}
          {selected && (
            <div className="absolute top-3 right-3 max-w-[260px] z-[1000] bg-black/80 backdrop-blur-md text-white p-3 rounded-xl text-xs shadow-xl border border-white/10 pointer-events-none">
              <div className={cn('text-[10px] font-bold uppercase tracking-wide mb-1', ERA_COLORS[selected.era])}>
                {ERA_LABELS[selected.era][language]} · {selected.period}
              </div>
              <p className="font-semibold text-sm leading-snug mb-1.5">{getTitle(selected, language)}</p>
              <p className="text-white/75 leading-relaxed">{selected.description}</p>
            </div>
          )}

          {/* Hint when nothing selected */}
          {!selected && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
              <div className="bg-black/60 backdrop-blur-sm text-white text-sm px-4 py-3 rounded-xl text-center border border-white/15 shadow-xl">
                <MapIcon className="w-5 h-5 mx-auto mb-1.5 text-primary" />
                <p className="font-medium">{t.tmap_select_topic}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
