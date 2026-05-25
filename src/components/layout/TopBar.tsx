import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { LevelProgress } from '@/components/shared/LevelProgress';
import { StreakBadge } from '@/components/shared/StreakBadge';
import { Sidebar } from './Sidebar';

export function TopBar() {
  const { currentUser, progress, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <header className="h-14 border-b border-border bg-card/60 backdrop-blur-sm flex items-center px-4 gap-4 shrink-0 sticky top-0 z-20">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden"><Menu className="w-5 h-5" /></Button></SheetTrigger>
        <SheetContent side="left" className="p-0 w-60"><Sidebar onNavigate={() => setOpen(false)} /></SheetContent>
      </Sheet>
      <div className="flex-1" />
      {progress && <StreakBadge streak={progress.streak} compact />}
      {progress && <div className="hidden sm:block"><LevelProgress xp={progress.xp} compact /></div>}
      <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>
      {currentUser && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">{currentUser.avatarInitials}</AvatarFallback></Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2"><p className="font-medium text-sm">{currentUser.username}</p><p className="text-xs text-muted-foreground truncate">{currentUser.email}</p></div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/pricing')}>Manage Plan</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); navigate('/'); }} className="text-destructive">Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
