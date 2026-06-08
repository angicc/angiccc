import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ScrollText, MessageSquare, User, LogOut, Crown, Trophy, Layers, PenLine, BarChart2, Flame, Sparkles, HelpCircle, AlertTriangle, FileEdit, Film, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { Logo } from '@/components/shared/Logo';
import { xpToNextLevel } from '@/features/progress/xpSystem';
import { getVideoXp } from '@/features/videoReview/videoReviewStore';
import { getChessRank } from '@/features/ranks/chessRanks';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/eras', label: 'Eras & Lessons', icon: BookOpen },
  { to: '/timeline', label: 'Timeline', icon: ScrollText },
  { to: '/tutor', label: 'AI Tutor', icon: MessageSquare },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/friends', label: 'Friends', icon: Users },
  { to: '/flashcards', label: 'Flashcards', icon: Layers },
  { to: '/notes', label: 'My Notes', icon: PenLine },
  { to: '/progress', label: 'Progress', icon: BarChart2 },
  { to: '/smart-quiz', label: 'Smart Quiz', icon: Sparkles },
  { to: '/essay', label: 'Essay Challenge', icon: FileEdit },
  { to: '/video-review', label: 'Video Review', icon: Film },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/guide', label: 'App Guide', icon: HelpCircle },
  { to: '/report', label: 'Report a Problem', icon: AlertTriangle },
];

export function Sidebar({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const navigate = useNavigate();
  const { logout, progress, currentUser } = useAuth();
  const { subscription } = useSubscription();
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
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={onNavigate}
            className={({ isActive }) => cn('flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors', isActive ? 'bg-primary/15 text-primary font-medium border-r-2 border-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent')}>
            <Icon className="w-4 h-4 shrink-0" />{label}
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
                {progress.streak}d streak
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
            <Crown className="w-4 h-4 shrink-0" />Upgrade Plan
          </NavLink>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-muted-foreground px-3 py-2 h-auto font-normal">
              <LogOut className="w-4 h-4 shrink-0" />Log Out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log out of Historify?</AlertDialogTitle>
              <AlertDialogDescription>
                Your progress is saved. You can log back in anytime.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => { logout(); navigate('/'); onNavigate?.(); }}>
                Log Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
}
