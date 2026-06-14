import { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

const BETA_CODE = 'HISTORIFY2026';
const STORAGE_KEY = 'historify:beta_unlocked';

function isUnlocked(): boolean {
  return localStorage.getItem(STORAGE_KEY) === '1';
}

export function BetaGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  if (unlocked) return <>{children}</>;

  function attempt() {
    if (input.trim().toUpperCase() === BETA_CODE) {
      localStorage.setItem(STORAGE_KEY, '1');
      setUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-2xl space-y-6 ${shake ? 'animate-[wiggle_0.5s_ease-in-out]' : ''}`}
        style={shake ? { animation: 'wiggle 0.5s ease-in-out' } : {}}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold">Historify Beta</h1>
            <p className="text-muted-foreground text-sm mt-1">Enter your access code to continue</p>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false); }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            placeholder="Access code"
            autoFocus
            className={`w-full px-4 py-3 rounded-xl border bg-background text-sm font-mono tracking-widest uppercase text-center outline-none transition-all focus:ring-2 focus:ring-primary/40 ${error ? 'border-destructive text-destructive' : 'border-border'}`}
          />
          {error && (
            <p className="text-destructive text-xs text-center">Incorrect code. Try again.</p>
          )}
          <button
            onClick={attempt}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all text-sm"
          >
            Unlock <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Beta testers only — contact the developer for your code
        </p>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
