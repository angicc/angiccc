import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/layout/AppShell';
import { LevelProgress } from '@/components/shared/LevelProgress';
import { StreakBadge } from '@/components/shared/StreakBadge';
import { AchievementCard } from '@/components/shared/AchievementCard';
import { useAuth, useAuthInternal } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { useTheme } from '@/components/ThemeProvider';
import { ACHIEVEMENTS } from '@/features/progress/xpSystem';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { currentUser, progress, logout } = useAuth();
  const { updateUsername, resetProgress } = useAuthInternal();
  const { subscription } = useSubscription();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [newName, setNewName] = useState(currentUser?.username ?? '');

  if (!currentUser || !progress) return null;
  const tier = subscription?.tier ?? 'free';
  const tierLabel: Record<string, string> = { free:'Free', pro:'Pro Learner', master:'Master Student' };

  function saveName() {
    if (!newName.trim() || newName.length < 3) { toast.error('Username must be at least 3 characters.'); return; }
    updateUsername(newName.trim()); toast.success('Username updated!');
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="achievements">Achievements</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger></TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-5">
                  <Avatar className="h-16 w-16"><AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">{currentUser.avatarInitials}</AvatarFallback></Avatar>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="font-heading text-xl font-bold">{currentUser.username}</h1>
                      {tier === 'master' && <Badge className="text-xs bg-amber-500 text-white">Master Student</Badge>}
                      {tier === 'pro' && <Badge variant="default" className="text-xs">Pro Learner</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Member since {new Date(currentUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <LevelProgress xp={progress.xp} />
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[['Total XP', progress.xp.toLocaleString()], ['Level', progress.level], ['Lessons', `${progress.completedLessons.length}/14`], ['Streak', <StreakBadge key="s" streak={progress.streak} compact />]].map(([label, val]) => (
                <Card key={String(label)}><CardContent className="pt-4 pb-3 text-center"><div className="text-lg font-bold font-heading">{val}</div><div className="text-xs text-muted-foreground mt-0.5">{label}</div></CardContent></Card>
              ))}
            </div>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center justify-between">Current Plan <Button size="sm" variant="outline" onClick={() => navigate('/pricing')}>Change Plan</Button></CardTitle></CardHeader>
              <CardContent className="flex items-center gap-3">
                <Crown className={`w-5 h-5 ${tier === 'master' ? 'text-amber-400' : tier === 'pro' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="font-medium">{tierLabel[tier]}</span>
                {subscription?.renewsAt && <span className="text-xs text-muted-foreground ml-auto">Renews {new Date(subscription.renewsAt).toLocaleDateString()}</span>}
              </CardContent>
            </Card>
            {tier === 'master' && (
              <Button variant="outline" className="gap-2 w-full" onClick={() => toast.info('PDF download coming soon!')}><Download className="w-4 h-4" />Download Lesson Notes (PDF)</Button>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ACHIEVEMENTS.map(a => <AchievementCard key={a.id} achievement={a} unlocked={progress.achievements.includes(a.id)} />)}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Display Name</CardTitle></CardHeader>
              <CardContent className="flex gap-3">
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Username" className="max-w-xs" />
                <Button onClick={saveName}>Save</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 flex items-center justify-between">
                <Label htmlFor="dark-mode" className="cursor-pointer">Dark Mode</Label>
                <Switch id="dark-mode" checked={theme === 'dark'} onCheckedChange={c => setTheme(c ? 'dark' : 'light')} />
              </CardContent>
            </Card>
            <Card className="border-destructive/30">
              <CardContent className="pt-5 flex items-center justify-between">
                <div><p className="font-medium text-sm">Reset All Progress</p><p className="text-xs text-muted-foreground">Clears XP, lessons, and quiz scores permanently.</p></div>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Reset</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Reset all progress?</AlertDialogTitle><AlertDialogDescription>This will permanently delete all your XP, completed lessons, quiz scores, and achievements. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { resetProgress(); toast.success('Progress reset.'); }}>Yes, reset everything</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
            <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => { logout(); navigate('/'); }}>Log Out</Button>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
