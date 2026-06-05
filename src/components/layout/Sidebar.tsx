import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ScrollText, MessageSquare, User, LogOut, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { Logo } from '@/components/shared/Logo';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/eras', label: 'Eras & Lessons', icon: BookOpen },
  { to: '/timeline', label: 'Timeline', icon: ScrollText },
  { to: '/tutor', label: 'AI Tutor', icon: MessageSquare },
  { to: '/profile', label: 'Profile', icon: User },
];

export function Sidebar({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { subscription } = useSubscription();
  const tier = subscription?.tier ?? 'free';
  const tierLabel = { free: 'Free', pro: 'Pro Learner', master: 'Master Student' }[tier];

  return (
    <aside className={cn('flex flex-col w-60 shrink-0 border-r border-border bg-card h-screen sticky top-0', className)}>
      <div className="px-5 py-5 border-b border-border">
        <Logo />
        <div className="mt-1.5 flex items-center gap-1.5">
          <Crown className={`w-3 h-3 ${tier === 'master' ? 'text-amber-400' : tier === 'pro' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className="text-xs text-muted-foreground">{tierLabel}</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={onNavigate}
            className={({ isActive }) => cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors', isActive ? 'bg-primary/15 text-primary font-medium border-r-2 border-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent')}>
            <Icon className="w-4 h-4 shrink-0" />{label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-border space-y-1">
        {tier === 'free' && (
          <NavLink to="/pricing" onClick={onNavigate} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors mb-2">
            <Crown className="w-4 h-4 shrink-0" />Upgrade Plan
          </NavLink>
        )}
        <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-muted-foreground px-3 py-2.5 h-auto font-normal" onClick={() => { logout(); navigate('/'); onNavigate?.(); }}>
          <LogOut className="w-4 h-4 shrink-0" />Log Out
        </Button>
      </div>
    </aside>
  );
}
