import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, Search, Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { LevelProgress } from '@/components/shared/LevelProgress';
import { StreakBadge } from '@/components/shared/StreakBadge';
import { SearchDialog } from '@/components/shared/SearchDialog';
import { Sidebar } from './Sidebar';
import { LANGUAGE_LABELS, type Language } from '@/i18n/translations';

export function TopBar() {
  const { currentUser, progress, startLogout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
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
      <header className="h-14 border-b border-border bg-card/60 backdrop-blur-sm flex items-center px-4 gap-3 shrink-0 sticky top-0 z-20">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden"><Menu className="w-5 h-5" /></Button></SheetTrigger>
          <SheetContent side="left" className="p-0 w-60"><Sidebar onNavigate={() => setOpen(false)} /></SheetContent>
        </Sheet>

        <button
          onClick={() => setSearchOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted text-muted-foreground text-sm transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>{t.search_placeholder}</span>
          <kbd className="ml-2 text-xs bg-background px-1.5 py-0.5 rounded border border-border">Ctrl+K</kbd>
        </button>
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setSearchOpen(true)}>
          <Search className="w-4 h-4" />
        </Button>

        <div className="flex-1" />
        {progress && <StreakBadge streak={progress.streak} compact />}
        {progress && <div className="hidden sm:block"><LevelProgress xp={progress.xp} compact /></div>}

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
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">{currentUser.avatarInitials}</AvatarFallback>
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
