
type Props = {
  label: string;
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
};

function colorForScore(v: number): string {
  if (v >= 75) return '#10b981'; // emerald
  if (v >= 50) return '#f59e0b'; // amber
  return '#ef4444';              // red
}

function glowForScore(v: number): string {
  if (v >= 75) return 'drop-shadow(0 0 6px #10b98180)';
  if (v >= 50) return 'drop-shadow(0 0 6px #f59e0b80)';
  return 'drop-shadow(0 0 6px #ef444480)';
}

export default function MetricRing({ label, value, size = 110, strokeWidth = 8 }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = colorForScore(value);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]" style={{ filter: glowForScore(value) }}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
          <span className="text-xl font-bold tabular-nums" style={{ color }}>
            {value}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-medium">score</span>
        </div>
      </div>
      <span className="text-xs uppercase tracking-widest text-slate-400 text-center font-medium leading-tight">
        {label}
      </span>
    </div>
  );
}
