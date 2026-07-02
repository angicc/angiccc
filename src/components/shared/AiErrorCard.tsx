import { motion } from 'framer-motion';
import { CloudOff, KeyRound, RefreshCw, ServerCrash, TimerReset, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AiGatewayError, type AiErrorKind } from '@/services/aiGateway';
import { useLanguage } from '@/contexts/LanguageContext';

const KIND_ICON: Record<AiErrorKind, typeof CloudOff> = {
  config: KeyRound,
  auth: KeyRound,
  network: CloudOff,
  rate_limit: TimerReset,
  server: ServerCrash,
  unknown: AlertTriangle,
};

/**
 * Themed, interactive fallback UI for AI failures. Replaces raw error strings
 * dumped into the chat viewport with a scannable card and a retry mechanic.
 */
export function AiErrorCard({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { t } = useLanguage();
  const gwError = error instanceof AiGatewayError ? error : null;
  const kind: AiErrorKind = gwError?.kind ?? 'unknown';
  const Icon = KIND_ICON[kind];
  const retryable = gwError ? gwError.retryable : true;

  const detail =
    kind === 'network'    ? t.ai_err_network :
    kind === 'rate_limit' ? t.ai_err_rate :
    kind === 'server'     ? t.ai_err_server :
    kind === 'config' || kind === 'auth' ? t.ai_err_config :
    t.ai_err_generic;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      role="alert"
      className="rounded-xl border border-red-400/25 bg-gradient-to-br from-red-950/40 to-card/60 backdrop-blur-sm p-4 flex gap-3 items-start max-w-[80%]"
    >
      <div className="w-9 h-9 rounded-lg bg-red-400/10 border border-red-400/30 flex items-center justify-center shrink-0">
        <Icon className="w-4.5 h-4.5 text-red-400" style={{ width: 18, height: 18 }} />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <p className="font-heading font-semibold text-sm text-red-200">{t.ai_err_title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed break-words">{detail}</p>
        {/* Surface the precise technical cause for debugging, de-emphasized */}
        {gwError && <p className="text-[10px] text-muted-foreground/50 break-words">{gwError.message}</p>}
        {retryable && onRetry && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1.5 text-xs border-red-400/30 hover:border-red-400/60 hover:bg-red-400/10"
            onClick={onRetry}
          >
            <RefreshCw className="w-3 h-3" />
            {t.btn_retry}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
