// ─── Zone A: Left Sidebar (240px fixed, Layer 0 — Deep Obsidian) ─────────────
// Borderless elevation hierarchy: the sidebar is the darkest surface in the
// app; the content panel beside it reads as "nearer" purely through its
// lighter backing — no hard divider lines. Navigation is grouped under small
// muted uppercase headers; the active route is marked with a thin vertical
// gold bar on the left edge, and hovering an item shifts its text toward gold.
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ScrollText, MessageSquare, User, LogOut, Crown, Trophy, Layers, PenLine, BarChart2, Flame, Sparkles, HelpCircle, AlertTriangle, FileEdit, Film, Users, Scale, Globe2, Hourglass, Wand2, Route, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { xpToNextLevel } from '@/features/progress/xpSystem';
import { getVideoXp } from '@/features/videoReview/videoReviewStore';
import { getChessRank } from '@/features/ranks/chessRanks';
import { cn } from '@/lib/utils';
import type { TranslationKeys } from '@/i18n/translations';

type NavKey = keyof TranslationKeys;

interface NavGroup {
  headerKey: NavKey;
  items: { to: string; key: NavKey; icon: React.ComponentType<{ className?: string }> }[];
}

// Three canonical blocks from the design spec (CHRONICLES / ACADEMY / LEDGER)
// plus AGORA for the social surfaces so every feature stays one click away.
const NAV_GROUPS: NavGroup[] = [
  {
    headerKey: 'nav_group_chronicles',
    items: [
      { to: '/dashboard',    key: 'nav_dashboard',    icon: LayoutDashboard },
      { to: '/eras',         key: 'nav_eras',         icon: BookOpen },
      { to: '/timeline',     key: 'nav_timeline',     icon: ScrollText },
      { to: '/timeline-map', key: 'nav_timeline_map', icon: Globe2 },
    ],
  },
  {
    headerKey: 'nav_group_academy',
    items: [
      { to: '/tutor',        key: 'nav_tutor',        icon: MessageSquare },
      { to: '/study-plan',   key: 'nav_study_plan',   icon: Route },
      { to: '/studio',       key: 'nav_studio',       icon: Wand2 },
      { to: '/smart-quiz',   key: 'nav_smart_quiz',   icon: Sparkles },
      { to: '/essay',        key: 'nav_essay',        icon: FileEdit },
      { to: '/video-review', key: 'nav_video_review', icon: Film },
      { to: '/debate',       key: 'nav_debate',       icon: Scale },
      { to: '/crisis',       key: 'nav_crisis',       icon: Hourglass },
      { to: '/imperium',     key: 'nav_imperium',     icon: Swords },
      { to: '/flashcards',   key: 'nav_flashcards',   icon: Layers },
    ],
  },
  {
    headerKey: 'nav_group_agora',
    items: [
      { to: '/friends',     key: 'nav_friends',     icon: Users },
      { to: '/leaderboard', key: 'nav_leaderboard', icon: Trophy },
    ],
  },
  {
    headerKey: 'nav_group_ledger',
    items: [
      { to: '/progress', key: 'nav_progress', icon: BarChart2 },
      { to: '/notes',    key: 'nav_notes',    icon: PenLine },
      { to: '/profile',  key: 'nav_profile',  icon: User },
      { to: '/guide',    key: 'nav_guide',    icon: HelpCircle },
      { to: '/report',   key: 'nav_report',   icon: AlertTriangle },
    ],
  },
];

export function Sidebar({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const { progress, currentUser, startLogout } = useAuth();
  const { subscription } = useSubscription();
  const { t } = useLanguage();
  const tier = subscription?.tier ?? 'free';
  const tierLabel = { free: 'Free', beginner: 'Beginner Student', pro: 'Pro Student', master: 'Master Student' }[tier];
  const xpInfo = progress ? xpToNextLevel(progress.xp) : null;

  const avatarKey = currentUser ? `historify:avatar:${currentUser.id}` : '';
  const [avatarUrl] = useState<string>(() => (avatarKey ? localStorage.getItem(avatarKey) ?? '' : ''));
  const videoXp = currentUser ? getVideoXp(currentUser.id) : 0;
  const rank = getChessRank(videoXp);

  return (
    <aside className={cn('flex flex-col w-60 shrink-0 bg-layer-0 h-screen sticky top-0', className)}>
      {/* ── Top: wordmark + full profile card (avatar, name, tier, rank) ── */}
      <div className="px-4 pt-5 pb-3 space-y-3">
        <Link to="/dashboard" onClick={onNavigate} className="block px-1 font-accent text-[15px] font-bold tracking-[0.28em] text-foreground select-none">
          HISTOR<span className="text-primary">IFY</span>
        </Link>
        {currentUser && (
          <Link
            to="/profile"
            onClick={onNavigate}
            title={t.nav_profile}
            className="block rounded-xl bg-layer-2/70 ring-1 ring-white/5 p-3 transition-all hover:bg-layer-2 hover:ring-primary/30"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 shrink-0 ring-1 ring-primary/30">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={currentUser.username} />}
                <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/[0.04] text-primary text-sm font-bold">
                  {currentUser.avatarInitials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground truncate">{currentUser.username}</span>
                  <span className="text-sm leading-none shrink-0" title={rank.name}>{rank.icon}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-1">
                  <Crown className={cn('w-3 h-3 shrink-0', tier === 'master' ? 'text-amber-400' : tier === 'pro' ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="text-[11px] text-muted-foreground truncate">{tierLabel}</span>
                </div>
              </div>
            </div>
            {progress && (
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground/90 tabular-nums">
                <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-primary" />{progress.streak}{t.sidebar_streak}</span>
                <span>Lv.{progress.level}</span>
                <span className="truncate max-w-[46%] text-right" title={rank.name}>{rank.name}</span>
              </div>
            )}
          </Link>
        )}
      </div>

      {/* ── Middle: grouped navigation (scrollable) ── */}
      <nav className="flex-1 px-3 pb-3 space-y-4 overflow-y-auto">
        {NAV_GROUPS.map(group => (
          <div key={group.headerKey}>
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60 select-none">
              {t[group.headerKey]}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ to, key, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={onNavigate}
                  className={({ isActive }) => cn(
                    'group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                    isActive
                      ? 'text-primary font-medium bg-white/[0.03]'
                      : 'text-muted-foreground hover:text-primary hover:translate-x-0.5',
                  )}>
                  {({ isActive }) => (
                    <>
                      {/* thin vertical gold bar — the active-route marker */}
                      <span className={cn(
                        'absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-full bg-primary transition-all duration-200',
                        isActive ? 'h-4 opacity-100' : 'h-0 opacity-0',
                      )} />
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{t[key]}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom: anchored streak card + low-contrast logout ── */}
      <div className="px-3 pb-4 pt-2 space-y-1">
        {progress && xpInfo && (
          <div className="p-3 rounded-xl bg-layer-2 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-primary" />
                {progress.streak}{t.sidebar_streak}
              </span>
              <span className="text-muted-foreground">Lv.{progress.level}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${Math.min(xpInfo.percent, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-right tabular-nums">{xpInfo.current}/{xpInfo.needed} XP</p>
          </div>
        )}
        {tier === 'free' && (
          <NavLink to="/pricing" onClick={onNavigate} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <Crown className="w-4 h-4 shrink-0" />{t.nav_upgrade}
          </NavLink>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-muted-foreground/60 hover:text-muted-foreground px-3 py-2 h-auto font-normal">
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
