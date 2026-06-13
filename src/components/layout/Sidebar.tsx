import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ScrollText, MessageSquare, User, LogOut, Crown, Trophy, Layers, PenLine, BarChart2, Flame, Sparkles, HelpCircle, AlertTriangle, FileEdit, Film, Users, Scale, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Logo } from '@/components/shared/Logo';
import { xpToNextLevel } from '@/features/progress/xpSystem';
import { getVideoXp } from '@/features/videoReview/videoReviewStore';
import { getChessRank } from '@/features/ranks/chessRanks';
import { cn } from '@/lib/utils';

const NAV_KEYS = [
  { to: '/dashboard',   key: 'nav_dashboard'   as const, icon: LayoutDashboard },
  { to: '/eras',        key: 'nav_eras'        as const, icon: BookOpen },
  { to: '/timeline',     key: 'nav_timeline'     as const, icon: ScrollText },
  { to: '/timeline-map', key: 'nav_timeline_map' as const, icon: Globe2 },
  { to: '/tutor',       key: 'nav_tutor'       as const, icon: MessageSquare },
  { to: '/leaderboard', key: 'nav_leaderboard' as const, icon: Trophy },
  { to: '/friends',     key: 'nav_friends'     as const, icon: Users },
  { to: '/flashcards',  key: 'nav_flashcards'  as const, icon: Layers },
  { to: '/notes',       key: 'nav_notes'       as const, icon: PenLine },
  { to: '/progress',    key: 'nav_progress'    as const, icon: BarChart2 },
  { to: '/smart-quiz',  key: 'nav_smart_quiz'  as const, icon: Sparkles },
  { to: '/essay',       key: 'nav_essay'       as const, icon: FileEdit },
  { to: '/video-review',key: 'nav_video_review'as const, icon: Film },
  { to: '/debate',      key: 'nav_debate'      as const, icon: Scale },
  { to: '/profile',     key: 'nav_profile'     as const, icon: User },
  { to: '/guide',       key: 'nav_guide'       as const, icon: HelpCircle },
  { to: '/report',      key: 'nav_report'      as const, icon: AlertTriangle },
];

export function Sidebar({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const { progress, currentUser, startLogout } = useAuth();
  const { subscription } = useSubscription();
  const { t } = useLanguage();
  const tier = subscription?.tier ?? 'free';
  const tierLabel = { free: 'Free', pro: 'Pro Learner', master: 'Master Student' }[tier];
  const xpInfo = progress ? xpToNextLevel(progress.xp) : null;

  const avatarKey = currentUser ? `historify:avatar:${currentUser.id}` : '';
  const [avatarUrl] = useState<string>(() => (avatarKey ? localStorage.getItem(avatarKey) ?? '' : ''));
  const videoXp = currentUser ? getVideoXp(currentUser.id) : 0;
  const rank = getChessRank(videoXp);

  return (
    <aside className={cn('flex flex-col w-64 shrink-0 border-r border-border bg-card h-screen sticky top-0', className)}>
      {/* Logo + user identity */}
      <div className="px-4 py-5 border-b border-border space-y-3">
        <Logo />
        {currentUser && (
          <div className="flex items-center gap-2.5">
            <Avatar className="h-12 w-12 shrink-0">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={currentUser.username} />}
              <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                {currentUser.avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{currentUser.username}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Crown className={`w-3 h-3 ${tier === 'master' ? 'text-amber-400' : tier === 'pro' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-xs text-muted-foreground truncate">{tierLabel}</span>
              </div>
            </div>
            {/* Chess rank */}
            <div className={`ml-auto shrink-0 flex flex-col items-center px-1.5 py-1 rounded-lg border ${rank.borderColor} ${rank.bgColor}`}>
              <span className="text-base leading-none">{rank.icon}</span>
              <span className={`text-[11px] font-bold mt-0.5 ${rank.color}`}>{rank.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_KEYS.map(({ to, key, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={onNavigate}
            className={({ isActive }) => cn('flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors', isActive ? 'bg-primary/15 text-primary font-medium border-r-2 border-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent')}>
            <Icon className="w-4 h-4 shrink-0" />{t[key]}
          </NavLink>
        ))}
      </nav>

      {/* Mini XP progress widget */}
      {progress && xpInfo && (
        <div className="px-4 pb-3">
          <div className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                {progress.streak}{t.sidebar_streak}
              </span>
              <span className="text-primary font-semibold">Lv.{progress.level}</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${Math.min(xpInfo.percent, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-right">{xpInfo.current}/{xpInfo.needed} XP</p>
          </div>
        </div>
      )}

      {/* Bottom section */}
      <div className="px-3 py-3 border-t border-border space-y-1">
        {tier === 'free' && (
          <NavLink to="/pricing" onClick={onNavigate} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors mb-1">
            <Crown className="w-4 h-4 shrink-0" />{t.nav_upgrade}
          </NavLink>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-muted-foreground px-3 py-2 h-auto font-normal">
              <LogOut className="w-4 h-4 shrink-0" />{t.nav_logout}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.logout_title}</AlertDialogTitle>
              <AlertDialogDescription>
                {t.logout_desc}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.btn_cancel}</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                startLogout();
                onNavigate?.();
              }}>
                {t.nav_logout}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
}
