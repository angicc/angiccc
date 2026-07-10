// ─── Zone B: Fixed Top Utility Header (70px, Layer 1 — Stone Slate) ──────────
// Left: global search (Ctrl+K) + the current page title. Right: XP mini-pill
// with progress, notification bell, language selector, theme toggle, and the
// account menu. Separation from Zone C comes from elevation, not hard rules —
// the only stroke is a 1px rgba(255,255,255,0.05) hairline under the header.
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Search, Globe, Check, Bell, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { xpToNextLevel } from '@/features/progress/xpSystem';
import { SearchDialog } from '@/components/shared/SearchDialog';
import { Sidebar } from './Sidebar';
import { LANGUAGE_LABELS, type Language, type TranslationKeys } from '@/i18n/translations';

// Route prefix → page-title translation key. First (longest) match wins, so
// keep more specific prefixes above shorter ones.
const PAGE_TITLES: [string, keyof TranslationKeys][] = [
  ['/timeline-map', 'nav_timeline_map'],
  ['/dashboard',    'nav_dashboard'],
  ['/eras',         'nav_eras'],
  ['/timeline',     'nav_timeline'],
  ['/tutor',        'nav_tutor'],
  ['/smart-quiz',   'nav_smart_quiz'],
  ['/essay',        'nav_essay'],
  ['/video-review', 'nav_video_review'],
  ['/debate',       'nav_debate'],
  ['/crisis',       'nav_crisis'],
  ['/flashcards',   'nav_flashcards'],
  ['/friends',      'nav_friends'],
  ['/leaderboard',  'nav_leaderboard'],
  ['/progress',     'nav_progress'],
  ['/notes',        'nav_notes'],
  ['/profile',      'nav_profile'],
  ['/guide',        'nav_guide'],
  ['/report',       'nav_report'],
];

export function TopBar() {
  const { currentUser, progress, startLogout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const avatarKey = currentUser ? `historify:avatar:${currentUser.id}` : '';
  const [avatarUrl, setAvatarUrl] = useState(() => (avatarKey ? localStorage.getItem(avatarKey) ?? '' : ''));

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Sync avatar when user changes
  useEffect(() => {
    setAvatarUrl(avatarKey ? localStorage.getItem(avatarKey) ?? '' : '');
  }, [avatarKey]);

  const LANGS = Object.entries(LANGUAGE_LABELS) as [Language, string][];
  const titleKey = PAGE_TITLES.find(([prefix]) => pathname.startsWith(prefix))?.[1];
  const pageTitle = titleKey ? t[titleKey] : '';
  const xpInfo = progress ? xpToNextLevel(progress.xp) : null;

  return (
    <>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.logout_title}</AlertDialogTitle>
            <AlertDialogDescription>{t.logout_desc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.btn_cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={() => { startLogout(); }}>{t.nav_logout}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="h-[70px] bg-layer-1 flex items-center px-4 lg:px-6 gap-3 shrink-0 sticky top-0 z-20 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
        {/* Mobile nav trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden"><Menu className="w-5 h-5" /></Button></SheetTrigger>
          <SheetContent side="left" className="p-0 w-60"><Sidebar onNavigate={() => setOpen(false)} /></SheetContent>
        </Sheet>

        {/* ── Left: global search + current page title ── */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-layer-2 hover:bg-accent text-muted-foreground text-sm transition-colors w-56"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{t.search_placeholder}</span>
          <kbd className="ml-auto text-[10px] font-sans bg-white/5 text-muted-foreground px-1.5 py-0.5 rounded shrink-0">Ctrl+K</kbd>
        </button>
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setSearchOpen(true)}>
          <Search className="w-4 h-4" />
        </Button>
        {pageTitle && (
          <h1 className="hidden md:block font-heading text-base font-bold text-foreground truncate">{pageTitle}</h1>
        )}

        <div className="flex-1" />

        {/* ── Right: XP mini-pill · bell · language · theme · account ── */}
        {progress && xpInfo && (
          <div className="hidden sm:flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-full bg-layer-2" title={`Lv.${progress.level}`}>
            <Flame className="w-3.5 h-3.5 text-primary" />
            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${Math.min(xpInfo.percent, 100)}%` }} />
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">{xpInfo.current}/{xpInfo.needed} XP</span>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title={t.notif_title} className="relative">
              <Bell className="w-4 h-4" />
              {progress != null && progress.streak > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="px-3 py-2">
              <p className="font-semibold text-sm">{t.notif_title}</p>
              {progress && progress.streak > 0 && (
                <p className="text-xs text-primary mt-1.5 flex items-center gap-1.5">
                  <Flame className="w-3 h-3" />{progress.streak}{t.sidebar_streak}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1.5">{t.notif_empty}</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title="Language">
              <Globe className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {LANGS.map(([code, label]) => (
              <DropdownMenuItem
                key={code}
                onClick={() => setLanguage(code)}
                className="flex items-center justify-between"
              >
                <span>{label}</span>
                {language === code && <Check className="w-3.5 h-3.5 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        {currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={currentUser.username} />}
                  <AvatarFallback className="bg-layer-2 text-primary text-xs font-semibold">{currentUser.avatarInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-3 py-2"><p className="font-medium text-sm">{currentUser.username}</p><p className="text-xs text-muted-foreground truncate">{currentUser.email}</p></div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>{t.nav_profile}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/pricing')}>{t.nav_upgrade}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLogoutOpen(true)} className="text-destructive">{t.nav_logout}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>
    </>
  );
}
