import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Download, Bookmark, Shield, Bell, Mail, KeyRound, Smartphone, Eye, EyeOff, Clock, Star, Camera, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AppShell } from '@/components/layout/AppShell';
import { LevelProgress } from '@/components/shared/LevelProgress';
import { StreakBadge } from '@/components/shared/StreakBadge';
import { AchievementCard } from '@/components/shared/AchievementCard';
import { useAuth, useAuthInternal } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { useTheme } from '@/components/ThemeProvider';
import { ACHIEVEMENTS } from '@/features/progress/xpSystem';
import { getBookmarks } from '@/features/bookmarks/bookmarkStore';
import { LESSONS } from '@/features/content/lessonsData';
import { getTranslatedEra, getTranslatedLesson } from '@/i18n/contentTranslations';
import { ERAS } from '@/features/content/erasData';
import { getVideoXp } from '@/features/videoReview/videoReviewStore';
import { getChessRank, getXpToNextRank } from '@/features/ranks/chessRanks';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const ERA_COLOR: Record<string, string> = {
  ancient: 'text-amber-400', 'middle-ages': 'text-blue-400',
  'early-modern': 'text-emerald-400', modern: 'text-rose-400',
};

function FakeQRCode() {
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1],
    [0,1,1,0,0,1,0,0,1,0,0,1,1,0,1,0,1,1,0,0,1],
    [1,0,1,1,0,0,1,0,1,1,0,0,1,0,0,1,1,0,1,1,0],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,1,0,0,1,0,0,1,0,1,1,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,1,1,1,0],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,1,0,1,0,0,1,1,0],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,1,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,0,0,0,1,0,1],
  ];
  return (
    <div className="inline-block p-3 bg-white rounded-lg">
      {pattern.map((row, i) => (
        <div key={i} className="flex">
          {row.map((cell, j) => (
            <div key={j} className={`w-2.5 h-2.5 ${cell ? 'bg-black' : 'bg-white'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const { currentUser, progress, startLogout } = useAuth();
  const { updateUsername, resetProgress, updateEmail, updatePassword } = useAuthInternal();
  const { subscription } = useSubscription();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const avatarKey = currentUser ? `historify:avatar:${currentUser.id}` : '';
  const [avatarUrl, setAvatarUrl] = useState<string>(() => localStorage.getItem(avatarKey) ?? '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2 MB.'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setAvatarUrl(url);
      localStorage.setItem(avatarKey, url);
      toast.success('Profile picture updated!');
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAvatarUrl('');
    localStorage.removeItem(avatarKey);
    toast.success('Profile picture removed.');
  }

  const [newName, setNewName] = useState(currentUser?.username ?? '');

  // Email change
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Password change
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confPwd, setConfPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  // 2FA
  const twoFaKey = currentUser ? `historify:2fa:${currentUser.id}` : '';
  const [twoFaEnabled, setTwoFaEnabled] = useState(() => localStorage.getItem(twoFaKey) === 'enabled');
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [backupCodes] = useState(() =>
    Array.from({ length: 6 }, () => Math.random().toString(36).slice(2, 8).toUpperCase())
  );

  // Notifications
  const notifKey = currentUser ? `historify:notif:${currentUser.id}` : '';
  const defaultNotif = { lessonReminders: true, achievements: true, weeklyDigest: false };
  const [notif, setNotif] = useState<typeof defaultNotif>(() => {
    try { return JSON.parse(localStorage.getItem(notifKey) ?? JSON.stringify(defaultNotif)); } catch { return defaultNotif; }
  });

  if (!currentUser || !progress) return null;
  const tier = subscription?.tier ?? 'free';
  const tierLabel: Record<string, string> = { free:'Free', pro:'Pro Learner', master:'Master Student' };

  const videoXp = getVideoXp(currentUser.id);
  const chessRank = getChessRank(videoXp);
  const rankProgress = getXpToNextRank(videoXp);

  const bookmarkedLessons = LESSONS.filter(l => getBookmarks(currentUser.id).includes(l.id));

  function saveName() {
    if (!newName.trim() || newName.length < 3) { toast.error('Username must be at least 3 characters.'); return; }
    updateUsername(newName.trim()); toast.success('Username updated!');
  }

  async function saveEmail() {
    if (!newEmail.includes('@')) { toast.error('Enter a valid email.'); return; }
    setEmailLoading(true);
    const result = await updateEmail(newEmail, emailPassword);
    setEmailLoading(false);
    if (result.success) { toast.success('Email updated!'); setNewEmail(''); setEmailPassword(''); }
    else toast.error(result.error ?? 'Failed to update email.');
  }

  async function savePassword() {
    if (newPwd.length < 6) { toast.error('New password must be at least 6 characters.'); return; }
    if (newPwd !== confPwd) { toast.error('Passwords do not match.'); return; }
    setPwdLoading(true);
    const result = await updatePassword(curPwd, newPwd);
    setPwdLoading(false);
    if (result.success) { toast.success('Password updated!'); setCurPwd(''); setNewPwd(''); setConfPwd(''); }
    else toast.error(result.error ?? 'Failed to update password.');
  }

  function enable2FA() {
    if (!/^\d{6}$/.test(twoFaCode)) { toast.error('Enter a valid 6-digit code.'); return; }
    localStorage.setItem(twoFaKey, 'enabled');
    setTwoFaEnabled(true);
    setShow2FASetup(false);
    setTwoFaCode('');
    toast.success('Two-factor authentication enabled!');
  }

  function disable2FA() {
    localStorage.removeItem(twoFaKey);
    setTwoFaEnabled(false);
    toast.success('2FA disabled.');
  }

  function saveNotif(key: keyof typeof defaultNotif, val: boolean) {
    const updated = { ...notif, [key]: val };
    setNotif(updated);
    localStorage.setItem(notifKey, JSON.stringify(updated));
    toast.success('Preference saved.');
  }

  return (
    <AppShell>
      {/* 2FA Setup Dialog */}
      <Dialog open={show2FASetup} onOpenChange={v => { setShow2FASetup(v); setTwoFaCode(''); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Smartphone className="w-4 h-4" />{t.prof_setup_2fa}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{t.prof_2fa_scan}</p>
            <div className="flex justify-center"><FakeQRCode /></div>
            <div className="p-3 rounded-lg bg-muted text-xs font-mono text-center break-all select-all text-muted-foreground">
              JBSWY3DPEHPK3PXP (demo secret)
            </div>
            <div>
              <Label className="text-xs mb-1 block">{t.prof_2fa_enter_code}</Label>
              <Input value={twoFaCode} onChange={e => setTwoFaCode(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="123456" maxLength={6} className="font-mono tracking-widest text-center text-lg" />
            </div>
            <Button className="w-full" onClick={enable2FA}>{t.prof_2fa_verify}</Button>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">{t.prof_2fa_backup}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {backupCodes.map(c => <code key={c} className="text-xs bg-muted rounded px-2 py-1 text-center font-mono">{c}</code>)}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto space-y-6">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="overview">{t.prof_overview}</TabsTrigger>
            <TabsTrigger value="achievements">{t.prof_achievements}</TabsTrigger>
            <TabsTrigger value="bookmarks">{t.prof_bookmarks}</TabsTrigger>
            <TabsTrigger value="settings">{t.prof_settings}</TabsTrigger>
          </TabsList>

          {/* ── Overview ── */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative group">
                      <Avatar className="h-16 w-16">
                        {avatarUrl && <AvatarImage src={avatarUrl} alt={currentUser.username} />}
                        <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">{currentUser.avatarInitials}</AvatarFallback>
                      </Avatar>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Camera className="w-5 h-5 text-white" />
                      </button>
                    </div>
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
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[[t.prog_xp_total, progress.xp.toLocaleString()], [t.dash_level, progress.level], [t.prog_lessons, `${progress.completedLessons.length}/${LESSONS.length}`], [t.prog_streak, <StreakBadge key="s" streak={progress.streak} compact />]].map(([label, val]) => (
                <Card key={String(label)}><CardContent className="pt-4 pb-3 text-center"><div className="text-lg font-bold font-heading">{val}</div><div className="text-xs text-muted-foreground mt-0.5">{label}</div></CardContent></Card>
              ))}
            </div>
            {/* Chess Rank */}
            <Card className={`border ${chessRank.borderColor} ${chessRank.bgColor}`}>
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2">
                <span className="text-lg">{chessRank.icon}</span>
                {t.prof_historical_rank}: <span className={chessRank.color}>{chessRank.name}</span>
              </CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">{chessRank.desc}</p>
                <p className="text-xs text-muted-foreground">Inspired by: <span className="text-foreground font-medium">{chessRank.historicalFigure}</span></p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Video XP: <span className={`font-bold ${chessRank.color}`}>{videoXp.toLocaleString()}</span></span>
                  {rankProgress ? <span>Next rank in <span className="font-medium text-foreground">{(rankProgress.needed - rankProgress.current).toLocaleString()} XP</span></span> : <span className={`font-bold ${chessRank.color}`}>MAX RANK</span>}
                </div>
                {rankProgress && (
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 bg-amber-500`} style={{ width: `${rankProgress.pct}%` }} />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center justify-between">{t.prof_plan} <Button size="sm" variant="outline" onClick={() => navigate('/pricing')}>{t.prof_change_plan}</Button></CardTitle></CardHeader>
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

          {/* ── Achievements ── */}
          <TabsContent value="achievements" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ACHIEVEMENTS.map(a => <AchievementCard key={a.id} achievement={a} unlocked={progress.achievements.includes(a.id)} />)}
            </div>
          </TabsContent>

          {/* ── Bookmarks ── */}
          <TabsContent value="bookmarks" className="mt-4">
            {bookmarkedLessons.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">{t.prof_no_bookmarks}</p>
                <p className="text-sm mt-1">{t.prof_no_bookmarks_hint}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {bookmarkedLessons.map(rawLesson => {
                  const lesson = getTranslatedLesson(rawLesson, language);
                  const eraRaw = ERAS.find(e => e.id === lesson.eraId);
                  const era = eraRaw ? getTranslatedEra(eraRaw, language) : undefined;
                  return (
                    <Card key={lesson.id} className="cursor-pointer hover:border-primary/40 hover:-translate-y-0.5 transition-all" onClick={() => navigate(`/eras/${lesson.eraId}/lessons/${lesson.id}`)}>
                      <CardContent className="py-3 px-4 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{lesson.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.estimatedMinutes}m</span>
                          <span className="flex items-center gap-1"><Star className="w-3 h-3" />+{lesson.xpReward}</span>
                          <Badge variant="outline" className={`text-xs ${ERA_COLOR[lesson.eraId] ?? ''}`}>{era?.shortName}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ── Settings ── */}
          <TabsContent value="settings" className="space-y-4 mt-4">
            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

            {/* Profile Picture */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Camera className="w-4 h-4" />{t.prof_picture}</CardTitle></CardHeader>
              <CardContent className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={currentUser.username} />}
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">{currentUser.avatarInitials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="w-3.5 h-3.5" />{avatarUrl ? t.prof_change_photo : t.prof_upload_photo_btn}
                  </Button>
                  {avatarUrl && (
                    <Button size="sm" variant="ghost" className="gap-2 text-destructive hover:text-destructive" onClick={removeAvatar}>
                      <Trash2 className="w-3.5 h-3.5" />{t.prof_remove_photo_btn}
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF · max 2 MB</p>
                </div>
              </CardContent>
            </Card>

            {/* Display name */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Mail className="w-4 h-4" />{t.prof_display_name}</CardTitle></CardHeader>
              <CardContent className="flex gap-3">
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder={t.prof_username} className="max-w-xs" />
                <Button onClick={saveName}>{t.prof_save_btn}</Button>
              </CardContent>
            </Card>

            {/* Change email */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Mail className="w-4 h-4" />{t.prof_change_email}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-muted-foreground">{t.prof_current_email} <span className="text-foreground">{currentUser.email}</span></div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><Label className="text-xs mb-1 block">{t.prof_new_email}</Label><Input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="new@email.com" type="email" /></div>
                  <div><Label className="text-xs mb-1 block">{t.prof_cur_password}</Label><Input value={emailPassword} onChange={e => setEmailPassword(e.target.value)} placeholder="Verify identity" type="password" /></div>
                </div>
                <Button size="sm" onClick={saveEmail} disabled={emailLoading || !newEmail || !emailPassword}>
                  {emailLoading ? t.prof_updating : t.prof_update_email}
                </Button>
              </CardContent>
            </Card>

            {/* Change password */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><KeyRound className="w-4 h-4" />{t.prof_change_password}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><Label className="text-xs mb-1 block">{t.prof_cur_password}</Label>
                  <div className="relative max-w-xs">
                    <Input value={curPwd} onChange={e => setCurPwd(e.target.value)} type={showPwd ? 'text' : 'password'} placeholder="••••••••" />
                    <button className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground" onClick={() => setShowPwd(p => !p)}>
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><Label className="text-xs mb-1 block">{t.prof_new_password}</Label><Input value={newPwd} onChange={e => setNewPwd(e.target.value)} type="password" placeholder={t.prof_min_chars} /></div>
                  <div><Label className="text-xs mb-1 block">{t.prof_confirm_password}</Label><Input value={confPwd} onChange={e => setConfPwd(e.target.value)} type="password" placeholder={t.prof_repeat_pwd} /></div>
                </div>
                <Button size="sm" onClick={savePassword} disabled={pwdLoading || !curPwd || !newPwd || !confPwd}>
                  {pwdLoading ? t.prof_updating : t.prof_update_password}
                </Button>
              </CardContent>
            </Card>

            {/* 2FA */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Smartphone className="w-4 h-4" />{t.prof_2fa_title}</CardTitle></CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm">{twoFaEnabled ? t.prof_2fa_enabled_msg : t.prof_2fa_disabled_msg}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{twoFaEnabled ? t.prof_2fa_enabled_desc : t.prof_2fa_disabled_desc}</p>
                </div>
                {twoFaEnabled
                  ? <Button size="sm" variant="outline" onClick={disable2FA} className="text-destructive border-destructive/30">{t.prof_2fa_disable}</Button>
                  : <Button size="sm" onClick={() => setShow2FASetup(true)} className="gap-1.5"><Shield className="w-3.5 h-3.5" />{t.prof_2fa_enable}</Button>
                }
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Bell className="w-4 h-4" />{t.prof_notif_title}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {([
                  { key: 'lessonReminders', label: t.prof_notif_reminders, desc: t.prof_notif_reminders_desc },
                  { key: 'achievements', label: t.prof_notif_achievements, desc: t.prof_notif_achievements_desc },
                  { key: 'weeklyDigest', label: t.prof_notif_weekly, desc: t.prof_notif_weekly_desc },
                ] as const).map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
                    <Switch checked={notif[key]} onCheckedChange={v => saveNotif(key, v)} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardContent className="pt-5 flex items-center justify-between">
                <Label htmlFor="dark-mode" className="cursor-pointer">{t.prof_dark_mode}</Label>
                <Switch id="dark-mode" checked={theme === 'dark'} onCheckedChange={c => setTheme(c ? 'dark' : 'light')} />
              </CardContent>
            </Card>

            <Separator />

            {/* Danger zone */}
            <Card className="border-destructive/30">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-destructive">{t.prof_danger_zone}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div><p className="font-medium text-sm">{t.prof_reset_title}</p><p className="text-xs text-muted-foreground">{t.prof_reset_desc}</p></div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="destructive" size="sm">{t.prof_reset_btn}</Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>{t.prof_reset_confirm}</AlertDialogTitle><AlertDialogDescription>{t.prof_reset_confirm_desc}</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>{t.btn_cancel}</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { resetProgress(); toast.success('Progress reset.'); }}>{t.prof_reset_yes}</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10">{t.nav_logout}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.logout_title}</AlertDialogTitle>
                  <AlertDialogDescription>{t.logout_desc}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.btn_cancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => startLogout()}>{t.nav_logout}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
