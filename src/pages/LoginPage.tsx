import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/AuthContext';
import { toast } from 'sonner';
import { HistoryLoadingScreen } from '@/components/shared/HistoryLoadingScreen';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const schema = z.object({
    email: z.string().email(t.login_err_email),
    password: z.string().min(1, t.login_err_pass),
  });
  type V = z.infer<typeof schema>;

  const form = useForm<V>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  async function onSubmit(v: V) {
    setLoading(true);
    const r = await login(v.email, v.password);
    if (r.success) {
      toast.success(t.toast_welcome_back);
      // Set when the server was unreachable and a local account answered
      // instead — this session will not see online friends.
      if (r.noticeKey) toast.warning(t[r.noticeKey]);
      setShowLoader(true);
      setTimeout(() => navigate('/dashboard'), 1800);
      return;
    }
    setLoading(false);
    // A locally-determined failure names its own translation key. Anything
    // else came from the server and is already a sentence worth reading —
    // "this account is temporarily locked", "too many attempts". Collapsing
    // those into a generic "login failed" tells the learner nothing about what
    // to do. This used to compare r.error against the English sentence itself,
    // which meant the translated message hung on prose nobody should edit.
    const errMsg = r.errorKey ? t[r.errorKey] : r.error ?? t.login_failed;
    form.setError('root', { message: errMsg });
  }

  return (
    <>
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
        <img src="https://media.giphy.com/media/QR7SyBe7tQfPq/giphy.gif" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/75" />
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8"><Link to="/" className="font-accent text-3xl font-bold text-primary">Historify</Link></div>
          <Card>
            <CardHeader className="text-center"><CardTitle className="font-heading text-2xl">{t.login_title}</CardTitle><CardDescription>{t.login_desc}</CardDescription></CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {form.formState.errors.root && <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">{form.formState.errors.root.message}</div>}
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>{t.login_email}</FormLabel><FormControl><Input placeholder="you@example.com" autoComplete="email" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>{t.login_password}</FormLabel><FormControl>
                      <div className="relative">
                        <Input type={show ? 'text' : 'password'} placeholder="••••••••" autoComplete="current-password" {...field} />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground" onClick={() => setShow(v => !v)}>
                          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={loading}>{loading ? t.login_signing_in : t.login_btn}</Button>
                </form>
              </Form>
              <p className="text-center text-sm text-muted-foreground mt-6">{t.login_no_account} <Link to="/register" className="text-primary hover:underline font-medium">{t.login_create}</Link></p>
            </CardContent>
          </Card>
        </div>
      </div>
      <HistoryLoadingScreen show={showLoader} />
    </>
  );
}
