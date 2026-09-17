import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/features/auth/AuthContext';
import { deleteAccount } from '@/features/auth/deleteAccount';

/**
 * Delete this account, permanently.
 *
 * Two deliberate frictions, because this is the one action in the app that
 * cannot be undone: the password again, and the username typed out. A session
 * alone should not be enough - an unattended laptop should not be able to
 * destroy someone's history with one click - and typing the name is what turns
 * a misclick into a decision.
 *
 * The danger zone stays collapsed until asked for, so it is not sitting open
 * beside the ordinary profile settings.
 */
export function DeleteAccountCard() {
  const { t } = useLanguage();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmName, setConfirmName] = useState('');
  const [busy, setBusy] = useState(false);

  const username = currentUser?.username ?? '';
  const nameMatches = confirmName.trim().toLowerCase() === username.trim().toLowerCase();
  const ready = password.length > 0 && nameMatches && !busy;

  async function onDelete() {
    if (!ready) return;
    setBusy(true);
    const outcome = await deleteAccount(password, confirmName, currentUser?.id);
    setBusy(false);

    if (!outcome.ok) {
      const messages: Record<string, string> = {
        delete_wrong_password: t.delete_wrong_password,
        delete_name_mismatch: t.delete_name_mismatch,
        delete_failed: t.delete_failed,
      };
      toast.error(outcome.message ?? messages[outcome.errorKey] ?? t.delete_failed);
      return;
    }

    toast.success(t.delete_done);
    // logout clears the session; the local sweep already removed the data.
    logout();
    navigate('/');
  }

  return (
    <Card className="border-rose-500/30 bg-rose-500/[0.03]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm text-rose-400">
          <AlertTriangle className="h-4 w-4" />
          {t.delete_zone_title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-[13px] leading-relaxed text-muted-foreground">{t.delete_zone_body}</p>

        {!open && (
          <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            {t.delete_start}
          </Button>
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.06] p-3">
                <p className="text-[12px] font-semibold text-rose-300">{t.delete_warning_title}</p>
                <ul className="mt-1.5 space-y-0.5 text-[12px] text-muted-foreground">
                  <li>{t.delete_warning_progress}</li>
                  <li>{t.delete_warning_social}</li>
                  <li>{t.delete_warning_billing}</li>
                  <li>{t.delete_warning_final}</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium" htmlFor="delete-password">
                  {t.delete_password_label}
                </label>
                <Input
                  id="delete-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium" htmlFor="delete-confirm">
                  {t.delete_confirm_label.replace('{name}', username)}
                </label>
                <Input
                  id="delete-confirm"
                  value={confirmName}
                  onChange={e => setConfirmName(e.target.value)}
                  placeholder={username}
                  autoComplete="off"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="destructive" size="sm" disabled={!ready} onClick={onDelete}>
                  {busy
                    ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />{t.delete_working}</>
                    : <><Trash2 className="mr-1.5 h-3.5 w-3.5" />{t.delete_confirm_button}</>}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busy}
                  onClick={() => { setOpen(false); setPassword(''); setConfirmName(''); }}
                >
                  {t.delete_cancel}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
