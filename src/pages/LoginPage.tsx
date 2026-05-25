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

const schema = z.object({ email: z.string().email('Enter a valid email'), password: z.string().min(1, 'Password required') });
type V = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<V>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  async function onSubmit(v: V) {
    setLoading(true);
    const r = await login(v.email, v.password);
    setLoading(false);
    if (r.success) { toast.success('Welcome back!'); navigate('/dashboard'); }
    else form.setError('root', { message: r.error });
  }

  return (
    <div className="min-h-screen bg-background scroll-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><Link to="/" className="font-accent text-2xl text-primary">Historify</Link></div>
        <Card>
          <CardHeader className="text-center"><CardTitle className="font-heading text-2xl">Welcome Back</CardTitle><CardDescription>Sign in to continue your journey</CardDescription></CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {form.formState.errors.root && <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">{form.formState.errors.root.message}</div>}
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" autoComplete="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>Password</FormLabel><FormControl>
                    <div className="relative">
                      <Input type={show ? 'text' : 'password'} placeholder="••••••••" autoComplete="current-password" {...field} />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground" onClick={() => setShow(v => !v)}>
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</Button>
              </form>
            </Form>
            <p className="text-center text-sm text-muted-foreground mt-6">No account? <Link to="/register" className="text-primary hover:underline font-medium">Create one free</Link></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
