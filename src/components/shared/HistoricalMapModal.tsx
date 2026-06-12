import { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Map as MapIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLessonMapData } from '@/features/content/historicalMapsData';

const MAP_URL =
  'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/2560px-World_map_-_low_resolution.svg.png';

// Equirectangular projection helpers — works for the Natural Earth world map (2:1 aspect ratio)
function lonToSvgX(lon: number) { return (lon + 180) / 360 * 1000; }
function latToSvgY(lat: number) { return (90 - lat) / 180 * 500; }

interface Props {
  lessonId: string;
  lessonTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HistoricalMapModal({ lessonId, lessonTitle, open, onOpenChange }: Props) {
  const { t } = useLanguage();
  const mapData = getLessonMapData(lessonId);

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Reset and calculate initial view when modal opens
  useEffect(() => {
    if (!open) { initialized.current = false; return; }
    if (!mapData || initialized.current) return;

    const tryInit = () => {
      const container = containerRef.current;
      if (!container) return;
      const cw = container.clientWidth || 600;
      const ch = container.clientHeight || 400;

      const lonSpan = mapData.bounds.east - mapData.bounds.west;
      const latSpan = mapData.bounds.north - mapData.bounds.south;
      const padding = 0.6;

      const newScale = Math.min(
        Math.max((cw * padding) / (lonSpan / 360 * cw), 1),
        Math.max((ch * padding) / (latSpan / 180 * ch), 1),
        10,
      );

      const centerLon = (mapData.bounds.east + mapData.bounds.west) / 2;
      const centerLat = (mapData.bounds.north + mapData.bounds.south) / 2;
      const cx = (centerLon + 180) / 360;
      const cy = (90 - centerLat) / 180;

      setPan({ x: cw / 2 - cx * cw * newScale, y: ch / 2 - cy * ch * newScale });
      setScale(newScale);
      setSelectedMarker(null);
      initialized.current = true;
    };

    // Give the DOM a tick to mount
    const timer = setTimeout(tryInit, 50);
    return () => clearTimeout(timer);
  }, [open, mapData]);

  const zoom = useCallback((factor: number, originX?: number, originY?: number) => {
    const container = containerRef.current;
    const cw = container?.clientWidth ?? 600;
    const ch = container?.clientHeight ?? 400;
    const ox = originX ?? cw / 2;
    const oy = originY ?? ch / 2;

    setScale(prev => {
      const newScale = Math.min(Math.max(prev * factor, 1), 12);
      setPan(p => ({
        x: ox - (ox - p.x) * (newScale / prev),
        y: oy - (oy - p.y) * (newScale / prev),
      }));
      return newScale;
    });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - rect.left, e.clientY - rect.top);
  }, [zoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  }, []);

  const stopDrag = useCallback(() => { isDragging.current = false; }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    e.preventDefault();
    const dx = e.touches[0].clientX - lastMouse.current.x;
    const dy = e.touches[0].clientY - lastMouse.current.y;
    lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  }, []);

  if (!mapData) return null;

  // SVG highlight box
  const bx = lonToSvgX(mapData.bounds.west);
  const by = latToSvgY(mapData.bounds.north);
  const bw = (mapData.bounds.east - mapData.bounds.west) / 360 * 1000;
  const bh = (mapData.bounds.north - mapData.bounds.south) / 180 * 500;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[calc(100vw-2rem)] p-0 overflow-hidden gap-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="flex items-center gap-2 text-base">
            <MapIcon className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{t.lesson_map}: {lessonTitle}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Interactive map */}
        <div
          ref={containerRef}
          className="relative bg-[#1a2a4a] overflow-hidden select-none"
          style={{ height: '420px', cursor: isDragging.current ? 'grabbing' : 'grab' }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={stopDrag}
        >
          {/* Transformable layer: world map image + SVG overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              transformOrigin: '0 0',
              willChange: 'transform',
            }}
          >
            <img
              src={MAP_URL}
              alt="World map"
              draggable={false}
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: 'fill', display: 'block', pointerEvents: 'none' }}
            />

            {/* SVG overlay using a fixed viewBox matching the map's 2:1 ratio */}
            <svg
              viewBox="0 0 1000 500"
              preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
            >
              {/* Region highlight */}
              <rect
                x={bx} y={by} width={bw} height={bh}
                fill="rgba(251,191,36,0.12)"
                stroke="rgba(251,191,36,0.85)"
                strokeWidth="2"
                rx="2"
                style={{ pointerEvents: 'none' }}
              />

              {/* Markers */}
              {mapData.markers.map((m, i) => {
                const cx = lonToSvgX(m.lon);
                const cy = latToSvgY(m.lat);
                const active = selectedMarker === i;
                return (
                  <g
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setSelectedMarker(active ? null : i); }}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Glow ring for selected */}
                    {active && (
                      <circle cx={cx} cy={cy} r={10} fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.6)" strokeWidth="1" />
                    )}
                    <circle
                      cx={cx} cy={cy} r={active ? 6 : 4}
                      fill={active ? '#fbbf24' : '#ef4444'}
                      stroke="white" strokeWidth="1.5"
                    />
                    {/* Label */}
                    <text
                      x={cx} y={cy - 8}
                      textAnchor="middle"
                      fontSize="8"
                      fontWeight={active ? 'bold' : 'normal'}
                      fill="white"
                      stroke="rgba(0,0,0,0.9)"
                      strokeWidth="3"
                      paintOrder="stroke"
                      style={{ pointerEvents: 'none', fontFamily: 'sans-serif' }}
                    >
                      {m.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* UI overlays (fixed, outside the transformable div) */}

          {/* Region badge */}
          <div className="absolute top-2 left-2 bg-black/65 backdrop-blur-sm text-white text-[11px] px-2 py-1 rounded-md font-medium max-w-[180px] truncate">
            {mapData.regionName}
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-10">
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); zoom(1.35); }}
              className="w-7 h-7 rounded bg-black/65 text-white flex items-center justify-center hover:bg-black/85 text-base font-bold leading-none select-none"
              aria-label="Zoom in"
            >+</button>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); zoom(1 / 1.35); }}
              className="w-7 h-7 rounded bg-black/65 text-white flex items-center justify-center hover:bg-black/85 text-base font-bold leading-none select-none"
              aria-label="Zoom out"
            >−</button>
          </div>

          {/* Hint */}
          <div className="absolute bottom-2 left-2 text-white/45 text-[10px] pointer-events-none">
            {t.map_zoom_hint}
          </div>

          {/* Selected marker info panel */}
          {selectedMarker !== null && (
            <div
              className="absolute top-2 right-2 max-w-[200px] bg-black/80 backdrop-blur-sm text-white p-2.5 rounded-lg text-xs shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-semibold text-amber-300 leading-snug">{mapData.markers[selectedMarker].label}</p>
              {mapData.markers[selectedMarker].description && (
                <p className="mt-1 text-white/80 leading-snug">{mapData.markers[selectedMarker].description}</p>
              )}
              <button
                className="mt-1.5 text-white/50 hover:text-white/80 text-[10px]"
                onClick={() => setSelectedMarker(null)}
              >✕ close</button>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="p-4 space-y-3 max-h-44 overflow-y-auto border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">{mapData.description}</p>
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              {t.map_key_locations}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
              {mapData.markers.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMarker(selectedMarker === i ? null : i)}
                  className={`text-left text-xs px-2 py-1 rounded border transition-colors truncate ${
                    selectedMarker === i
                      ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                      : 'border-border hover:border-primary/50 text-foreground'
                  }`}
                  title={m.label}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
