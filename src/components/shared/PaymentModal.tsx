import { useState } from 'react';
import { CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import confetti from 'canvas-confetti';

interface Props {
  open: boolean;
  onClose: () => void;
  planName: string;
  price: number;
  onSuccess: () => void;
}

function formatCard(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export function PaymentModal({ open, onClose, planName, price, onSuccess }: Props) {
  const [card, setCard] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function reset() {
    setCard(''); setName(''); setExpiry(''); setCvv('');
    setLoading(false); setSuccess(false); setError('');
  }

  function handleClose() { reset(); onClose(); }

  function validate() {
    const digits = card.replace(/\s/g, '');
    if (digits.length < 16) return 'Enter a valid 16-digit card number.';
    if (!name.trim() || name.trim().length < 2) return 'Enter the name on your card.';
    const [mm, yy] = expiry.split('/');
    const month = parseInt(mm), year = parseInt(`20${yy}`);
    if (!mm || !yy || month < 1 || month > 12 || year < new Date().getFullYear()) return 'Enter a valid expiry date.';
    if (cvv.length < 3) return 'Enter a valid CVV.';
    return null;
  }

  async function handlePay() {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setSuccess(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#f59e0b','#fbbf24','#10b981','#ffffff'] });
    setTimeout(() => { reset(); onSuccess(); }, 1500);
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading">
            <CreditCard className="w-5 h-5 text-primary" />
            {success ? 'Payment Successful!' : `Upgrade to ${planName}`}
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-center text-muted-foreground text-sm">
              Welcome to <strong className="text-foreground">{planName}</strong>! Your features are now active.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between text-sm">
              <span className="font-medium">{planName}</span>
              <span className="text-primary font-bold">${price}/month</span>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs mb-1 block">Card Number</Label>
                <Input
                  value={card}
                  onChange={e => setCard(formatCard(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="font-mono tracking-wider"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Name on Card</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Angel Smith" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1 block">Expiry</Label>
                  <Input
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">CVV</Label>
                  <Input
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="•••"
                    type="password"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-destructive text-xs">{error}</p>}

            <Button className="w-full gap-2" onClick={handlePay} disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Processing…</> : <><Lock className="w-4 h-4" />Pay ${price}/month</>}
            </Button>
            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Demo mode — no real charge will occur
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
