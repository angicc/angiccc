import React from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: Variant;
  icon?: React.ReactNode;
};

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] border border-emerald-400/30',
  secondary:
    'bg-slate-800 text-slate-200 hover:bg-slate-700 shadow-[0_0_12px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-500/30',
  danger:
    'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30',
  ghost:
    'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-white/5',
};

export default function GlowButton({
  children,
  loading = false,
  variant = 'primary',
  icon,
  disabled,
  className = '',
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
        transition-all duration-200 ease-out
        hover:-translate-y-[1px] active:translate-y-0
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : icon ? <span className="shrink-0">{icon}</span> : null}
      {children}
    </button>
  );
}
