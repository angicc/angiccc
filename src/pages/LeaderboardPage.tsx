import { motion } from 'framer-motion';
import { Trophy, Crown, Flame, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth/AuthContext';
import { calculateLevel } from '@/features/progress/xpSystem';

const MOCK_USERS = [
  { id: 'm1', username: 'HistoriaClio',    xp: 5840, country: '🇩🇪', streak: 62 },
  { id: 'm2', username: 'ChronoMaster',   xp: 5210, country: '🇫🇷', streak: 44 },
  { id: 'm3', username: 'TimeTraveler99', xp: 4780, country: '🇬🇧', streak: 38 },
  { id: 'm4', username: 'AncientScholar', xp: 4120, country: '🇮🇹', streak: 27 },
  { id: 'm5', username: 'MedievalMind',   xp: 3650, country: '🇪🇸', streak: 19 },
  { id: 'm6', username: 'RenaissanceKid', xp: 3200, country: '🇵🇹', streak: 15 },
  { id: 'm7', username: 'EmpireBuilder',  xp: 2750, country: '🇯🇵', streak: 11 },
  { id: 'm8', username: 'RevolutionR',    xp: 2100, country: '🇧🇷', streak: 8  },
  { id: 'm9', username: 'WarChronicler',  xp: 1620, country: '🇰🇷', streak: 5  },
  { id: 'm10', username: 'NewExplorer',   xp: 980,  country: '🇦🇺', streak: 3  },
];

const RANK_STYLES = [
  { bg: 'bg-amber-500/10 border-amber-500/30',  icon: <Crown className="w-4 h-4 text-amber-400" />, label: 'text-amber-400' },
  { bg: 'bg-zinc-400/10 border-zinc-400/30',    icon: <Crown className="w-4 h-4 text-zinc-400" />, label: 'text-zinc-400' },
  { bg: 'bg-orange-600/10 border-orange-600/30',icon: <Crown className="w-4 h-4 text-orange-500" />, label: 'text-orange-500' },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const row = { hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.35 } } };

export default function LeaderboardPage() {
  const { currentUser, progress } = useAuth();
  const userXP = progress?.xp ?? 0;
  const userLevel = progress?.level ?? 1;
  const userStreak = progress?.streak ?? 0;

  const allUsers = [
    ...MOCK_USERS,
    { id: 'real', username: currentUser?.username ?? 'You', xp: userXP, country: '⭐', streak: userStreak },
  ].sort((a, b) => b.xp - a.xp);

  const userRank = allUsers.findIndex(u => u.id === 'real') + 1;

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
                    <p className={`font-bold text-sm font-heading mt-0.5 ${s.label}`}>{u?.xp.toLocaleString()} XP</p>
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
                    className={`flex items-center gap-3 px-4 py-3 border-b border-border/50 last:border-0 transition-colors ${isYou ? 'bg-primary/5' : 'hover:bg-accent/30'}`}
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
                      <span className="font-medium text-foreground w-20 text-right">{u.xp.toLocaleString()} XP</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
