import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Flame, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth/AuthContext';
import { calculateLevel } from '@/features/progress/xpSystem';
import { getVideoXp } from '@/features/videoReview/videoReviewStore';
import { getChessRank } from '@/features/ranks/chessRanks';

// videoXp is worth 2× regular XP on the leaderboard
const leaderScore = (xp: number, videoXp: number) => xp + videoXp * 2;

const MOCK_USERS = [
  { id: 'm1', username: 'HistoriaClio',    xp: 5840, country: '🇩🇪', streak: 62, videoXp: 2200 },
  { id: 'm2', username: 'ChronoMaster',   xp: 5210, country: '🇫🇷', streak: 44, videoXp: 1800 },
  { id: 'm3', username: 'TimeTraveler99', xp: 4780, country: '🇬🇧', streak: 38, videoXp: 1400 },
  { id: 'm4', username: 'AncientScholar', xp: 4120, country: '🇮🇹', streak: 27, videoXp: 900 },
  { id: 'm5', username: 'MedievalMind',   xp: 3650, country: '🇪🇸', streak: 19, videoXp: 600 },
  { id: 'm6', username: 'RenaissanceKid', xp: 3200, country: '🇵🇹', streak: 15, videoXp: 350 },
  { id: 'm7', username: 'EmpireBuilder',  xp: 2750, country: '🇯🇵', streak: 11, videoXp: 150 },
  { id: 'm8', username: 'RevolutionR',    xp: 2100, country: '🇧🇷', streak: 8,  videoXp: 80  },
  { id: 'm9', username: 'WarChronicler',  xp: 1620, country: '🇰🇷', streak: 5,  videoXp: 30  },
  { id: 'm10', username: 'NewExplorer',   xp: 980,  country: '🇦🇺', streak: 3,  videoXp: 0   },
];

const RANK_STYLES = [
  { bg: 'bg-amber-500/10 border-amber-500/30',  icon: <Crown className="w-4 h-4 text-amber-400" />, label: 'text-amber-400' },
  { bg: 'bg-zinc-400/10 border-zinc-400/30',    icon: <Crown className="w-4 h-4 text-zinc-400" />, label: 'text-zinc-400' },
  { bg: 'bg-orange-600/10 border-orange-600/30',icon: <Crown className="w-4 h-4 text-orange-500" />, label: 'text-orange-500' },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const row = { hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.35 } } };

interface UserEntry { id: string; username: string; xp: number; country: string; streak: number; videoXp?: number; }

function UserProfileModal({ user, rank, onClose }: { user: UserEntry | null; rank: number; onClose: () => void }) {
  if (!user) return null;
  const level = calculateLevel(user.xp);
  const rank_ = getChessRank(user.videoXp ?? 0);
  const score = leaderScore(user.xp, user.videoXp ?? 0);

  return (
    <Dialog open={!!user} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">{user.country}</span>
            {user.username}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Rank badge */}
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${rank_.borderColor} ${rank_.bgColor}`}>
            <span className="text-2xl">{rank_.icon}</span>
            <div>
              <p className={`font-bold text-sm ${rank_.color}`}>{rank_.name}</p>
              <p className="text-xs text-muted-foreground">{rank_.desc}</p>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Rank', value: `#${rank}` },
              { label: 'Level', value: `Lv ${level}` },
              { label: 'Streak', value: `${user.streak}d` },
            ].map(s => (
              <div key={s.label} className="p-2 rounded-lg border border-border bg-muted/20">
                <div className="font-bold text-sm">{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between"><span>Regular XP</span><span className="font-medium text-foreground">{user.xp.toLocaleString()} XP</span></div>
            <div className="flex justify-between"><span>Video XP</span><span className="font-medium text-foreground">{(user.videoXp ?? 0).toLocaleString()} XP</span></div>
            <div className="flex justify-between border-t border-border pt-1 mt-1"><span className="font-semibold">Leaderboard Score</span><span className="font-bold text-primary">{score.toLocaleString()} pts</span></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function LeaderboardPage() {
  const { currentUser, progress } = useAuth();
  const userXP = progress?.xp ?? 0;
  const userLevel = progress?.level ?? 1;
  const userStreak = progress?.streak ?? 0;

  const userVideoXp = currentUser ? getVideoXp(currentUser.id) : 0;

  const allUsers = [
    ...MOCK_USERS,
    { id: 'real', username: currentUser?.username ?? 'You', xp: userXP, country: '⭐', streak: userStreak, videoXp: userVideoXp },
  ].sort((a, b) => leaderScore(b.xp, b.videoXp ?? 0) - leaderScore(a.xp, a.videoXp ?? 0));

  const userRank = allUsers.findIndex(u => u.id === 'real') + 1;

  const [selectedUser, setSelectedUser] = useState<UserEntry | null>(null);
  const [selectedRank, setSelectedRank] = useState(0);

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
            <Trophy className="w-7 h-7 text-amber-400" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Top learners ranked by total XP earned.</p>
        </motion.div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-3 gap-3">
          {[allUsers[1], allUsers[0], allUsers[2]].map((u, i) => {
            const rankIdx = i === 1 ? 0 : i === 0 ? 1 : 2;
            const actualRank = rankIdx + 1;
            const isYou = u?.id === 'real';
            const s = RANK_STYLES[rankIdx];
            return (
              <motion.div
                key={u?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: i === 1 ? -12 : 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                className={!isYou ? 'cursor-pointer' : undefined}
                onClick={() => { if (!isYou) { setSelectedUser(u!); setSelectedRank(actualRank); } }}
              >
                <Card className={`border ${s.bg} text-center ${i === 1 ? 'scale-105' : ''}`}>
                  <CardContent className="pt-4 pb-3">
                    {s.icon}
                    <Avatar className="h-10 w-10 mx-auto my-2">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
                        {u?.country ?? '?'}
                      </AvatarFallback>
                    </Avatar>
                    <p className={`font-semibold text-xs truncate ${isYou ? 'text-primary' : ''}`}>{u?.username}</p>
                    <p className={`font-bold text-sm font-heading mt-0.5 ${s.label}`}>{leaderScore(u?.xp ?? 0, u?.videoXp ?? 0).toLocaleString()} pts</p>
                    <Badge variant="outline" className="text-xs mt-1">#{actualRank}</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Your rank */}
        {userRank > 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <Card className="border-primary/40 bg-primary/5">
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <span className="font-mono text-sm text-primary font-bold w-8">#{userRank}</span>
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">{currentUser?.avatarInitials ?? 'Y'}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">{currentUser?.username} <span className="text-xs text-muted-foreground">(You)</span></p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-primary" />{userXP.toLocaleString()} XP</span>
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{userStreak}d</span>
                  <Badge variant="outline" className="text-xs">Lv {userLevel}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Full rankings */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Full Rankings</CardTitle></CardHeader>
          <CardContent className="p-0">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              {allUsers.map((u, i) => {
                const rank = i + 1;
                const isYou = u.id === 'real';
                const level = calculateLevel(u.xp);
                return (
                  <motion.div
                    key={u.id}
                    variants={row}
                    className={`flex items-center gap-3 px-4 py-3 border-b border-border/50 last:border-0 transition-colors ${isYou ? 'bg-primary/5' : 'hover:bg-accent/30 cursor-pointer'}`}
                    onClick={() => { if (!isYou) { setSelectedUser(u); setSelectedRank(rank); } }}
                  >
                    <span className={`font-mono text-sm w-7 shrink-0 ${rank <= 3 ? RANK_STYLES[rank-1].label : 'text-muted-foreground'}`}>#{rank}</span>
                    <span className="text-base">{u.country}</span>
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className={`text-xs font-semibold ${isYou ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                        {u.username.slice(0,2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className={`flex-1 text-sm font-medium ${isYou ? 'text-primary' : ''}`}>
                      {u.username}{isYou && <span className="text-xs text-muted-foreground ml-1">(You)</span>}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Flame className="w-3 h-3 text-orange-400" />{u.streak}d</span>
                      <Badge variant={isYou ? 'default' : 'secondary'} className="text-xs">Lv {level}</Badge>
                      {(() => { const r = getChessRank(u.videoXp ?? 0); return <span title={r.name} className={`text-base leading-none ${r.color}`}>{r.icon}</span>; })()}
                      <span className="font-medium text-foreground w-24 text-right">{leaderScore(u.xp, u.videoXp ?? 0).toLocaleString()} pts</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </CardContent>
        </Card>
      </div>
      <UserProfileModal user={selectedUser} rank={selectedRank} onClose={() => setSelectedUser(null)} />
    </AppShell>
  );
}
