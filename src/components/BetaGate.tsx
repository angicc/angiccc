import { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

const BETA_CODE = 'HISTORIFY2026';

// BetaGate wraps the app *above* the LanguageProvider, so it localizes itself
// by reading the stored language directly rather than via useLanguage().
const GATE_COPY: Record<string, { title: string; subtitle: string; placeholder: string; unlock: string; error: string; footer: string }> = {
  en: { title: 'Historify Beta', subtitle: 'Enter your access code to continue', placeholder: 'Access code', unlock: 'Unlock', error: 'Incorrect code. Try again.', footer: 'Beta testers only — contact the developer for your code' },
  es: { title: 'Historify Beta', subtitle: 'Introduce tu código de acceso para continuar', placeholder: 'Código de acceso', unlock: 'Desbloquear', error: 'Código incorrecto. Inténtalo de nuevo.', footer: 'Solo para beta testers — contacta al desarrollador para tu código' },
  ru: { title: 'Historify Beta', subtitle: 'Введите код доступа, чтобы продолжить', placeholder: 'Код доступа', unlock: 'Разблокировать', error: 'Неверный код. Попробуйте снова.', footer: 'Только для бета-тестеров — запросите код у разработчика' },
  mk: { title: 'Historify Beta', subtitle: 'Внесете го вашиот код за пристап за да продолжите', placeholder: 'Код за пристап', unlock: 'Отклучи', error: 'Погрешен код. Обидете се повторно.', footer: 'Само за бета-тестери — контактирајте го развивачот за вашиот код' },
  de: { title: 'Historify Beta', subtitle: 'Gib deinen Zugangscode ein, um fortzufahren', placeholder: 'Zugangscode', unlock: 'Freischalten', error: 'Falscher Code. Bitte erneut versuchen.', footer: 'Nur für Betatester — kontaktiere den Entwickler für deinen Code' },
  fr: { title: 'Historify Beta', subtitle: 'Saisissez votre code d’accès pour continuer', placeholder: 'Code d’accès', unlock: 'Déverrouiller', error: 'Code incorrect. Réessayez.', footer: 'Réservé aux bêta-testeurs — contactez le développeur pour votre code' },
};

function gateCopy() {
  try {
    const lang = localStorage.getItem('historify:language') ?? 'en';
    return GATE_COPY[lang] ?? GATE_COPY.en;
  } catch {
    return GATE_COPY.en;
  }
}

export function BetaGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const copy = gateCopy();

  if (unlocked) return <>{children}</>;

  function attempt() {
    if (input.trim().toUpperCase() === BETA_CODE) {
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
            <h1 className="font-heading text-2xl font-bold">{copy.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">{copy.subtitle}</p>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false); }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            placeholder={copy.placeholder}
            autoFocus
            className={`w-full px-4 py-3 rounded-xl border bg-background text-sm font-mono tracking-widest uppercase text-center outline-none transition-all focus:ring-2 focus:ring-primary/40 ${error ? 'border-destructive text-destructive' : 'border-border'}`}
          />
          {error && (
            <p className="text-destructive text-xs text-center">{copy.error}</p>
          )}
          <button
            onClick={attempt}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all text-sm"
          >
            {copy.unlock} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {copy.footer}
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
