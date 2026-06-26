import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlowButton from '../ui/GlowButton';

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function AuthModal({ onClose, onSuccess }: Props) {
  const { login, signup, isLoading, error } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (tab === 'login') {
      await login(email, password);
    } else {
      await signup(email, password, name);
    }
    if (!error) onSuccess();
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="w-full max-w-md bg-slate-900 border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 border-b border-white/[0.06]">
            <button onClick={onClose} className="absolute top-5 right-5 text-slate-600 hover:text-slate-300 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-black text-white text-lg tracking-tight">
                AngelReach<span className="text-emerald-400">.ai</span>
              </span>
            </div>
            {/* Tabs */}
            <div className="flex gap-1 bg-slate-800/60 rounded-lg p-1">
              {(['login', 'signup'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-150 ${
                    tab === t ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-semibold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Angel Dimitrov"
                    className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-semibold">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === 'signup' ? 'Min. 8 characters' : '••••••••'}
                  className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg pl-10 pr-10 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}
              </div>
            )}

            <GlowButton variant="primary" loading={isLoading} className="w-full justify-center">
              {tab === 'login' ? 'Sign In to Platform' : 'Create My Account'}
            </GlowButton>

            <p className="text-center text-xs text-slate-600">
              {tab === 'login' ? "No account? " : "Have an account? "}
              <button type="button" onClick={() => setTab(tab === 'login' ? 'signup' : 'login')} className="text-emerald-400 hover:text-emerald-300 font-semibold">
                {tab === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
