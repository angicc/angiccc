import { useState, useEffect, useRef, useMemo } from 'react';
import { Users, Search, UserPlus, UserCheck, Clock, X, Check, MessageSquare, Swords, Send, Gift, Activity, BookOpen, Flame, TrendingUp } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/features/auth/AuthContext';
import { getChessRank } from '@/features/ranks/chessRanks';
import { sendGift, GIFTABLE_TIERS } from '@/features/subscription/gifts';
import { PLANS } from '@/features/subscription/plans';
import { DuelArena } from '@/features/friends/DuelArena';
import {
  loadThread, saveThread, autoReplyFor, loadDuelRecord, markThreadRead, unreadCount, lastMessage,
  type ChatMsg,
} from '@/features/friends/friendInteractions';
import {
  recordFriendEvent, buildActivityFeed, relativeAge, type FriendEvent,
} from '@/features/friends/friendActivity';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  checkServerOnline, fetchOnlineFriendIds, apiAddFriend, apiSendMessage, socialApiConfigured,
} from '@/services/social';

const MOCK_USERS = [
  { id: 'm1', username: 'HistoriaClio',    xp: 5840, videoXp: 2200, country: '🇩🇪', streak: 62 },
  { id: 'm2', username: 'ChronoMaster',   xp: 5210, videoXp: 1800, country: '🇫🇷', streak: 44 },
  { id: 'm3', username: 'TimeTraveler99', xp: 4780, videoXp: 1400, country: '🇬🇧', streak: 38 },
  { id: 'm4', username: 'AncientScholar', xp: 4120, videoXp: 900,  country: '🇮🇹', streak: 27 },
  { id: 'm5', username: 'MedievalMind',   xp: 3650, videoXp: 600,  country: '🇪🇸', streak: 19 },
];

type FriendEntry = { id: string; username: string; xp: number; videoXp: number; country: string; streak: number };
type RequestEntry = { fromId: string; fromUsername: string; xp: number };
/** A sent request remembers when it went out, so it can actually resolve. */
type SentEntry = { id: string; at: string };

/**
 * How long a sent request stays pending before the recipient accepts.
 *
 * Requests used to sit in "Sent" forever: nothing ever accepted them, so
 * adding a friend was a dead end and the rest of the social layer — messaging,
 * duels, gifts — could never be reached at all. Friends here are local
 * fixtures with no server behind them, so the acceptance is simulated, but
 * staggered per person rather than all landing at once.
 */
const ACCEPT_BASE_MS = 6_000;
const ACCEPT_JITTER_MS = 9_000;

function acceptDelayFor(id: string): number {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ACCEPT_BASE_MS + (h % ACCEPT_JITTER_MS);
}

/** Sent requests were once a bare id list; keep those readable. */
function normaliseSent(raw: unknown): SentEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(v => (typeof v === 'string'
      ? { id: v, at: new Date(0).toISOString() }        // legacy: resolve at once
      : v && typeof (v as SentEntry).id === 'string'
        ? { id: (v as SentEntry).id, at: (v as SentEntry).at ?? new Date().toISOString() }
        : null))
    .filter((v): v is SentEntry => v !== null);
}

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

function storageKey(type: 'friends' | 'sent' | 'received', userId: string): string {
  if (type === 'friends') return `historify:friends:${userId}`;
  if (type === 'sent')    return `historify:friendRequests:sent:${userId}`;
  return `historify:friendRequests:received:${userId}`;
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export default function FriendsPage() {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const userId = currentUser?.id ?? '';

  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends]         = useState<FriendEntry[]>([]);
  const [sent, setSent]               = useState<SentEntry[]>([]);
  const [received, setReceived]       = useState<RequestEntry[]>([]);
  // Bumped whenever anything social changes, so the activity feed and the
  // unread badges re-derive without a reload.
  const [socialTick, setSocialTick]   = useState(0);
  // Messaging + duel state
  const [chatFriend, setChatFriend]   = useState<FriendEntry | null>(null);
  const [giftFriend, setGiftFriend] = useState<FriendEntry | null>(null);
  const [giftSentMsg, setGiftSentMsg] = useState('');
  const [duelFriend, setDuelFriend]   = useState<FriendEntry | null>(null);
  // Online layer: null = probing, then live server status + presence set.
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [onlineIds, setOnlineIds]       = useState<Set<string>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    if (!userId) return;
    setFriends(loadJSON<FriendEntry[]>(storageKey('friends', userId), []));
    setSent(normaliseSent(loadJSON<unknown>(storageKey('sent', userId), [])));
    setReceived(loadJSON<RequestEntry[]>(storageKey('received', userId), []));
  }, [userId]);

  // Resolve pending requests once they have been out long enough. This runs on
  // a timer AND catches up on mount, so a request sent before a reload still
  // lands rather than being stuck pending forever.
  useEffect(() => {
    if (!userId || sent.length === 0) return;
    const resolve = () => {
      const now = Date.now();
      const ready = sent.filter(s => now - Date.parse(s.at) >= acceptDelayFor(s.id));
      if (ready.length === 0) return;

      const readyIds = new Set(ready.map(s => s.id));
      const added = ready
        .map(s => MOCK_USERS.find(u => u.id === s.id))
        .filter((u): u is typeof MOCK_USERS[number] => Boolean(u))
        .filter(u => !friends.some(f => f.id === u.id));

      const nextSent = sent.filter(s => !readyIds.has(s.id));
      setSent(nextSent);
      saveJSON(storageKey('sent', userId), nextSent);

      if (added.length === 0) return;
      const nextFriends = [...friends, ...added.map(u => ({ ...u }))];
      setFriends(nextFriends);
      saveJSON(storageKey('friends', userId), nextFriends);
      for (const u of added) {
        recordFriendEvent(userId, { type: 'friend_added', friendId: u.id, friendName: u.username });
      }
      setSocialTick(v => v + 1);
      toast.success(`${t.fr_toast_now_friend}: ${added.map(u => u.username).join(', ')}`);
    };
    resolve();
    const timer = setInterval(resolve, 2_000);
    return () => clearInterval(timer);
  }, [userId, sent, friends, t.fr_toast_now_friend]);

  // Probe the backend and keep friend presence fresh while the page is open.
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      const ok = await checkServerOnline();
      if (cancelled) return;
      setServerOnline(ok);
      if (ok) {
        const ids = await fetchOnlineFriendIds();
        if (!cancelled && ids) setOnlineIds(new Set(ids));
      }
    };
    void tick();
    const timer = setInterval(tick, 30_000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [userId]);

  // The merged timeline: what the learner actually did, plus what their friends
  // have been up to. Re-derived whenever anything social changes.
  const activityFeed = useMemo(
    () => (userId ? buildActivityFeed(userId, friends) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, friends, socialTick],
  );

  // Unread counts and last-message previews, so a friend row shows whether
  // there is anything waiting rather than looking identical either way.
  const threadInfo = useMemo(() => {
    const out: Record<string, { unread: number; preview: string }> = {};
    if (!userId) return out;
    for (const f of friends) {
      out[f.id] = { unread: unreadCount(userId, f.id), preview: lastMessage(userId, f.id)?.text ?? '' };
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, friends, socialTick, chatFriend]);

  // Pool of searchable users: mock users minus current user and already-friends
  const friendIds = new Set(friends.map(f => f.id));
  const pool = MOCK_USERS.filter(u => u.id !== userId && !friendIds.has(u.id));

  const searchResults = searchQuery.trim().length > 0
    ? pool.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  function sendRequest(user: typeof MOCK_USERS[number]) {
    if (!userId) return;
    const newSent = [...sent, { id: user.id, at: new Date().toISOString() }];
    setSent(newSent);
    saveJSON(storageKey('sent', userId), newSent);

    // Simulate writing to the target user's received requests
    const targetReceived = loadJSON<RequestEntry[]>(storageKey('received', user.id), []);
    targetReceived.push({ fromId: userId, fromUsername: currentUser?.username ?? 'You', xp: 0 });
    saveJSON(storageKey('received', user.id), targetReceived);

    // Best-effort server write — persists across devices when the backend is up.
    if (socialApiConfigured()) void apiAddFriend(user.username);

    toast.success(`${t.fr_toast_request_sent}: ${user.username}`);
  }

  function acceptRequest(req: RequestEntry) {
    if (!userId) return;
    // Find the user in MOCK_USERS (or build a minimal entry)
    const mockUser = MOCK_USERS.find(u => u.id === req.fromId);
    const newFriend: FriendEntry = mockUser
      ? { ...mockUser }
      : { id: req.fromId, username: req.fromUsername, xp: req.xp, videoXp: 0, country: '', streak: 0 };

    const newFriends = [...friends, newFriend];
    setFriends(newFriends);
    saveJSON(storageKey('friends', userId), newFriends);

    const newReceived = received.filter(r => r.fromId !== req.fromId);
    setReceived(newReceived);
    saveJSON(storageKey('received', userId), newReceived);

    recordFriendEvent(userId, { type: 'friend_added', friendId: newFriend.id, friendName: newFriend.username });
    setSocialTick(v => v + 1);
    toast.success(`${t.fr_toast_now_friend}: ${req.fromUsername}`);
  }

  function declineRequest(req: RequestEntry) {
    if (!userId) return;
    const newReceived = received.filter(r => r.fromId !== req.fromId);
    setReceived(newReceived);
    saveJSON(storageKey('received', userId), newReceived);
    toast.success(`${t.fr_toast_declined}: ${req.fromUsername}`);
  }

  function removeFriend(friend: FriendEntry) {
    if (!userId) return;
    const newFriends = friends.filter(f => f.id !== friend.id);
    setFriends(newFriends);
    saveJSON(storageKey('friends', userId), newFriends);
    toast.success(`${t.fr_toast_removed}: ${friend.username}`);
  }

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="p-2 rounded-xl bg-primary/10">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold">{t.fr_title}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{t.fr_subtitle}</p>
          </div>
          {/* Live connection status — real /healthz probe, refreshed every 30s */}
          {serverOnline !== null && (
            <span className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
              serverOnline
                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                : 'border-amber-400/30 bg-amber-400/5 text-amber-300/90'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${serverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400/70'}`} />
              {serverOnline ? t.fr_net_live : t.fr_net_offline}
            </span>
          )}
        </div>

        {/* Search */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="w-4 h-4" /> {t.fr_find_users}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t.fr_search}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map(user => {
                  const alreadySent = sent.some(x => x.id === user.id);
                  const rank = getChessRank(user.videoXp);
                  return (
                    <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent/30 transition-colors">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                          {getInitials(user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate">{user.username}</span>
                          <span className="text-xs">{user.country}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{user.xp.toLocaleString()} XP</span>
                          <span className="text-xs">{rank.icon}</span>
                          <span className={`text-xs font-medium ${rank.color}`}>{rank.name}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={alreadySent ? 'outline' : 'default'}
                        disabled={alreadySent}
                        onClick={() => sendRequest(user)}
                        className="gap-1.5 shrink-0"
                      >
                        {alreadySent ? (
                          <><Clock className="w-3.5 h-3.5" /> {t.fr_pending}</>
                        ) : (
                          <><UserPlus className="w-3.5 h-3.5" /> {t.fr_add}</>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {searchQuery.trim().length > 0 && searchResults.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">{t.fr_no_results} &ldquo;{searchQuery}&rdquo;</p>
            )}
          </CardContent>
        </Card>

        {/* Tabs: Friends / Requests / Sent */}
        <Tabs defaultValue="friends">
          <TabsList className="w-full">
            <TabsTrigger value="friends" className="flex-1 gap-1.5">
              <UserCheck className="w-4 h-4" /> {t.fr_tab_friends}
              {friends.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">{friends.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1 gap-1.5">
              <UserPlus className="w-4 h-4" /> {t.fr_tab_requests}
              {received.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0 bg-primary/20 text-primary">{received.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex-1 gap-1.5">
              <Activity className="w-4 h-4" /> {t.fr_tab_activity}
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex-1 gap-1.5">
              <Clock className="w-4 h-4" /> {t.fr_tab_sent}
              {sent.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">{sent.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Friends list */}
          <TabsContent value="friends">
            <Card>
              <CardContent className="pt-4 pb-4">
                {friends.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <Users className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                    <p className="text-sm text-muted-foreground">{t.fr_no_friends}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {friends.map(friend => {
                      const rank = getChessRank(friend.videoXp);
                      const isOnline = onlineIds.has(friend.id);
                      return (
                        <div key={friend.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent/20 transition-colors">
                          <div className="relative shrink-0">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                                {getInitials(friend.username)}
                              </AvatarFallback>
                            </Avatar>
                            {isOnline && (
                              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-background" title={t.fr_online} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold truncate">{friend.username}</span>
                              {friend.country && <span className="text-xs">{friend.country}</span>}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs text-muted-foreground">{friend.xp.toLocaleString()} XP</span>
                              <span className="text-xs text-muted-foreground">{t.fr_streak_word}: {friend.streak}</span>
                            </div>
                            {threadInfo[friend.id]?.preview && (
                              <p className="text-[11px] text-muted-foreground/80 truncate mt-0.5 italic">
                                {threadInfo[friend.id].preview}
                              </p>
                            )}
                          </div>
                          <div className={`shrink-0 hidden sm:flex flex-col items-center px-2 py-1 rounded-lg border ${rank.borderColor} ${rank.bgColor}`}>
                            <span className="text-base leading-none">{rank.icon}</span>
                            <span className={`text-[10px] font-bold mt-0.5 ${rank.color}`}>{rank.name}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 shrink-0 border-amber-400/40 text-amber-400 hover:bg-amber-400/10"
                            onClick={() => { setGiftFriend(friend); setGiftSentMsg(''); }}
                          >
                            <Gift className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t.gift_btn}</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 shrink-0 relative"
                            onClick={() => setChatFriend(friend)}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t.fr_message}</span>
                            {(threadInfo[friend.id]?.unread ?? 0) > 0 && (
                              <span
                                className="absolute -top-1.5 -right-1.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
                                title={t.fr_unread}
                              >
                                {threadInfo[friend.id].unread}
                              </span>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            className="gap-1.5 shrink-0 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-500/90 hover:to-amber-500/90 text-white border-0"
                            onClick={() => setDuelFriend(friend)}
                          >
                            <Swords className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t.fr_duel}</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => removeFriend(friend)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Incoming requests */}
          <TabsContent value="requests">
            <Card>
              <CardContent className="pt-4 pb-4">
                {received.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <UserPlus className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                    <p className="text-sm text-muted-foreground">{t.fr_no_requests}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {received.map(req => (
                      <div key={req.fromId} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                            {getInitials(req.fromUsername)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{req.fromUsername}</p>
                          <p className="text-xs text-muted-foreground">Wants to be your friend</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="default"
                            className="gap-1.5"
                            onClick={() => acceptRequest(req)}
                          >
                            <Check className="w-3.5 h-3.5" /> {t.fr_accept}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => declineRequest(req)}
                          >
                            <X className="w-3.5 h-3.5" /> {t.fr_decline}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity feed */}
          <TabsContent value="activity">
            <Card>
              <CardContent className="pt-4 pb-4">
                {activityFeed.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <Activity className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                    <p className="text-sm text-muted-foreground">{t.fr_activity_empty}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {activityFeed.map(ev => (
                      <ActivityRow key={ev.id} event={ev} t={t as unknown as Record<string, string>} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sent requests */}
          <TabsContent value="sent">
            <Card>
              <CardContent className="pt-4 pb-4">
                {sent.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <Clock className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                    <p className="text-sm text-muted-foreground">{t.fr_no_sent}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sent.map(({ id: sentId }) => {
                      const user = MOCK_USERS.find(u => u.id === sentId);
                      if (!user) return null;
                      return (
                        <div key={sentId} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                              {getInitials(user.username)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user.username}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">{t.fr_request_pending}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs text-muted-foreground shrink-0">{t.fr_pending}</Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Chat drawer ── */}
      <AnimatePresence>
        {chatFriend && (
          <ChatDrawer
            key={chatFriend.id}
            userId={userId}
            friend={chatFriend}
            t={t as unknown as Record<string, string>}
            onClose={() => { setChatFriend(null); setSocialTick(v => v + 1); }}
            onChallenge={() => { const f = chatFriend; setChatFriend(null); setDuelFriend(f); }}
            onMessage={() => {
              recordFriendEvent(userId, { type: 'message', friendId: chatFriend.id, friendName: chatFriend.username });
              setSocialTick(v => v + 1);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── History 1v1 duel arena ── */}
      {/* ── Gift-a-plan dialog ── */}
      {giftFriend && currentUser && (
        <div className="fixed inset-0 z-[1100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setGiftFriend(null)}>
          <div className="w-full max-w-md rounded-2xl border border-amber-400/30 bg-card p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading text-lg font-bold">{t.gift_title}</h3>
            </div>
            {giftSentMsg ? (
              <>
                <p className="text-sm text-emerald-400">{giftSentMsg}</p>
                <div className="flex justify-end">
                  <Button size="sm" onClick={() => setGiftFriend(null)}>OK</Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">{t.gift_desc.replace('{name}', giftFriend.username)}</p>
                <div className="grid gap-2">
                  {GIFTABLE_TIERS.map(tier => {
                    const plan = PLANS.find(pl => pl.id === tier)!;
                    return (
                      <button
                        key={tier}
                        className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-left hover:border-amber-400/50 hover:bg-amber-400/5 transition-colors"
                        onClick={() => {
                          void sendGift(
                            { id: currentUser.id, username: currentUser.username },
                            { id: giftFriend.id, username: giftFriend.username },
                            tier,
                          ).then(res => {
                            if (res.ok) {
                              setGiftSentMsg(t.gift_sent.replace('{name}', giftFriend.username).replace('{plan}', plan.name));
                              recordFriendEvent(userId, { type: 'gift', friendId: giftFriend.id, friendName: giftFriend.username });
                              setSocialTick(v => v + 1);
                            } else {
                              setGiftSentMsg(res.error ?? t.fr_gift_failed);
                            }
                          });
                        }}
                      >
                        <span className="text-sm font-semibold">{plan.name}</span>
                        <span className="text-sm text-muted-foreground">${plan.price}/mo</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-amber-400/90">{t.gift_reward_badge}</p>
              </>
            )}
          </div>
        </div>
      )}

      {duelFriend && currentUser && (
        <DuelArena
          userId={userId}
          playerName={currentUser.username}
          opponent={{ id: duelFriend.id, username: duelFriend.username, xp: duelFriend.xp }}
          language={language}
          t={t as unknown as Record<string, string>}
          onClose={() => setDuelFriend(null)}
          onResult={won => {
            recordFriendEvent(userId, {
              type: won ? 'duel_win' : 'duel_loss',
              friendId: duelFriend.id, friendName: duelFriend.username,
            });
            setSocialTick(v => v + 1);
          }}
        />
      )}
    </AppShell>
  );
}

// ── Sliding chat drawer with a canned-reply opponent ─────────────────────────
/** Icon + colour per activity kind, so the feed is scannable at a glance. */
const ACT_STYLE: Record<FriendEvent['type'], { icon: React.ComponentType<{ className?: string }>; tone: string }> = {
  friend_added:    { icon: UserCheck,      tone: 'text-emerald-400' },
  duel_win:        { icon: Swords,         tone: 'text-emerald-400' },
  duel_loss:       { icon: Swords,         tone: 'text-rose-400' },
  message:         { icon: MessageSquare,  tone: 'text-primary' },
  gift:            { icon: Gift,           tone: 'text-amber-400' },
  friend_lesson:   { icon: BookOpen,       tone: 'text-blue-400' },
  friend_quiz:     { icon: Check,          tone: 'text-violet-400' },
  friend_streak:   { icon: Flame,          tone: 'text-orange-400' },
  friend_levelup:  { icon: TrendingUp,     tone: 'text-primary' },
};

const ACT_LABEL_KEY: Record<FriendEvent['type'], string> = {
  friend_added: 'fr_act_added', duel_win: 'fr_act_duel_win', duel_loss: 'fr_act_duel_loss',
  message: 'fr_act_message', gift: 'fr_act_gift', friend_lesson: 'fr_act_lesson',
  friend_quiz: 'fr_act_quiz', friend_streak: 'fr_act_streak', friend_levelup: 'fr_act_xp',
};

function ActivityRow({ event, t }: { event: FriendEvent; t: Record<string, string> }) {
  const style = ACT_STYLE[event.type];
  const Icon = style.icon;
  const age = relativeAge(event.at);
  const ageLabel = age.unit === 'now'
    ? t.fr_time_now
    : `${age.value}${age.unit === 'm' ? t.unit_min_short : age.unit === 'h' ? t.unit_hour_short : t.unit_day_short}`;

  // Only the numeric detail the event actually carries.
  const detail =
    event.type === 'friend_quiz' && event.meta?.score !== undefined ? `${event.meta.score}%`
    : event.type === 'friend_streak' && event.meta?.streak !== undefined ? `${event.meta.streak}`
    : event.type === 'friend_levelup' && event.meta?.xp !== undefined ? `${event.meta.xp.toLocaleString()} XP`
    : event.type === 'friend_lesson' && (event.meta?.count ?? 0) > 1 ? `×${event.meta!.count}`
    : '';

  return (
    <div className="flex items-center gap-3 py-2 px-1 border-b border-border/50 last:border-0">
      <span className={`shrink-0 ${style.tone}`}><Icon className="w-4 h-4" /></span>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug truncate">
          <span className="font-semibold">{event.friendName}</span>
          <span className="text-muted-foreground"> — {t[ACT_LABEL_KEY[event.type]]}</span>
          {detail && <span className="text-foreground font-medium"> {detail}</span>}
        </p>
      </div>
      {event.simulated && (
        <span className="shrink-0 text-[9px] uppercase tracking-wider text-muted-foreground/60 border border-border rounded px-1 py-0.5" title={t.fr_act_simulated}>
          {t.fr_act_sim_short}
        </span>
      )}
      <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">{ageLabel}</span>
    </div>
  );
}

function ChatDrawer({ userId, friend, t, onClose, onChallenge, onMessage }: {
  userId: string;
  friend: FriendEntry;
  t: Record<string, string>;
  onClose: () => void;
  onChallenge: () => void;
  onMessage: () => void;
}) {
  const [thread, setThread] = useState<ChatMsg[]>(() => loadThread(userId, friend.id));
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const record = loadDuelRecord(userId, friend.id);

  // Opening the thread is what marks it read; keep it current as replies land
  // while the drawer is open, so closing it never leaves a phantom unread.
  useEffect(() => { markThreadRead(userId, friend.id); }, [userId, friend.id, thread.length]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [thread]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    const mine: ChatMsg = { id: crypto.randomUUID(), from: 'me', text, ts: new Date().toISOString() };
    const next = [...thread, mine];
    setThread(next);
    saveThread(userId, friend.id, next);
    // Best-effort durable copy on the server (socket relays it live when up).
    if (socialApiConfigured()) void apiSendMessage(friend.id, text);
    setDraft('');
    onMessage();
    // The friend replies shortly with a canned line, so the thread feels live.
    // The pool is localised — the replies used to be English in every language.
    setTimeout(() => {
      const replies = [t.fr_reply_1, t.fr_reply_2, t.fr_reply_3, t.fr_reply_4, t.fr_reply_5, t.fr_reply_6, t.fr_reply_7]
        .filter(Boolean);
      const reply: ChatMsg = {
        id: crypto.randomUUID(), from: friend.id,
        text: autoReplyFor(friend.id, next.length, replies), ts: new Date().toISOString(),
      };
      setThread(prev => { const t2 = [...prev, reply]; saveThread(userId, friend.id, t2); return t2; });
    }, 900);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2500] bg-black/50 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="w-full max-w-md h-full bg-card border-l border-border flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Avatar className="h-9 w-9 shrink-0"><AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">{friend.username.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{friend.username}</p>
            {(record.wins + record.losses) > 0 && (
              <p className="text-[11px] text-muted-foreground">{t.fr_duel_record}: {record.wins}W · {record.losses}L</p>
            )}
          </div>
          <Button size="sm" className="gap-1.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white border-0" onClick={onChallenge}>
            <Swords className="w-3.5 h-3.5" /> {t.fr_duel}
          </Button>
          <Button size="sm" variant="ghost" className="shrink-0" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {thread.length === 0 && (
            <div className="text-center py-10 text-sm text-muted-foreground">{t.fr_msg_empty}</div>
          )}
          {thread.map(m => (
            <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-snug break-words ${m.from === 'me' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm'}`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Composer */}
        <div className="p-3 border-t border-border flex gap-2">
          <Input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(); }}
            placeholder={t.fr_msg_placeholder}
            className="flex-1"
          />
          <Button size="icon" onClick={send} disabled={!draft.trim()}><Send className="w-4 h-4" /></Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
