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
import { useLanguage } from '@/contexts/LanguageContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t, language } = useLanguage();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const schema = z.object({
    username: z.string()
      .min(3, t.reg_err_username_min)
      .max(20, t.reg_err_username_max)
      .regex(/^[a-zA-Z0-9_]+$/, t.reg_err_username_chars),
    email: z.string().email(t.reg_err_email),
    password: z.string().min(8, t.reg_err_pass_min),
    confirmPassword: z.string(),
  }).refine(d => d.password === d.confirmPassword, { message: t.reg_err_pass_match, path: ['confirmPassword'] });
  type V = z.infer<typeof schema>;

  const form = useForm<V>({ resolver: zodResolver(schema), defaultValues: { username: '', email: '', password: '', confirmPassword: '' } });

  async function onSubmit(v: V) {
    setLoading(true);
    try {
      // Pass the UI language so a server account is created in the language
      // the person is actually reading.
      const r = await register(v.username, v.email, v.password, language);
      if (r.success) {
        toast.success('Account created! Welcome to Historify.');
        // Set when the server could not be reached and the account was made
        // locally instead — the learner needs to know it is device-only.
        if (r.notice) toast.warning(r.notice);
        navigate('/dashboard');
      } else {
        form.setError('root', { message: r.error });
      }
    } catch {
      form.setError('root', { message: t.reg_failed });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <img src="https://media.giphy.com/media/QR7SyBe7tQfPq/giphy.gif" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/75" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8"><Link to="/" className="font-accent text-3xl font-bold text-primary">Historify</Link></div>
        <Card>
          <CardHeader className="text-center"><CardTitle className="font-heading text-2xl">{t.reg_title}</CardTitle><CardDescription>{t.reg_desc}</CardDescription></CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {form.formState.errors.root && <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">{form.formState.errors.root.message}</div>}
                <FormField control={form.control} name="username" render={({ field }) => (<FormItem><FormLabel>{t.reg_username}</FormLabel><FormControl><Input placeholder={t.reg_placeholder_username} autoComplete="username" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>{t.reg_email}</FormLabel><FormControl><Input placeholder="you@example.com" autoComplete="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>{t.reg_pass}</FormLabel><FormControl>
                    <div className="relative">
                      <Input type={show ? 'text' : 'password'} placeholder={t.reg_placeholder_pass} autoComplete="new-password" {...field} />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground" onClick={() => setShow(v => !v)}>
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (<FormItem><FormLabel>{t.reg_confirm}</FormLabel><FormControl><Input type="password" placeholder={t.reg_placeholder_confirm} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <Button type="submit" className="w-full" disabled={loading}>{loading ? t.reg_creating : t.reg_btn}</Button>
              </form>
            </Form>
            <p className="text-center text-sm text-muted-foreground mt-6">{t.reg_have_account} <Link to="/login" className="text-primary hover:underline font-medium">{t.reg_sign_in}</Link></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
