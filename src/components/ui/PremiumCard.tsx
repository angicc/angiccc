import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  glow?: 'emerald' | 'amber' | 'indigo' | 'none';
  noPad?: boolean;
};

const glowMap = {
  emerald: 'hover:shadow-[0_4px_30px_rgba(16,185,129,0.12)] hover:border-emerald-500/30',
  amber:   'hover:shadow-[0_4px_30px_rgba(245,158,11,0.12)] hover:border-amber-500/30',
  indigo:  'hover:shadow-[0_4px_30px_rgba(99,102,241,0.12)] hover:border-indigo-500/30',
  none:    '',
};

export default function PremiumCard({ children, className = '', glow = 'none', noPad = false }: Props) {
  return (
    <div
      className={`
        bg-slate-900/60 backdrop-blur-md border border-white/[0.07]
        rounded-xl transition-all duration-300 ease-out
        hover:-translate-y-[2px]
        ${glowMap[glow]}
        ${noPad ? '' : 'p-5'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
