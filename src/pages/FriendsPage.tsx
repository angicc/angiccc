import { useState, useEffect, useRef } from 'react';
import { Users, Search, UserPlus, UserCheck, Clock, X, Check, MessageSquare, Swords, Send, Gift } from 'lucide-react';
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
  loadThread, saveThread, autoReplyFor, loadDuelRecord,
  type ChatMsg,
} from '@/features/friends/friendInteractions';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  checkServerOnline, fetchOnlineFriendIds, apiAddFriend, apiSendMessage, socialApiConfigured,
} from '@/services/social';

// Connection-status chip labels (kept local, mirroring the deep-dive pattern).
const NET_LABEL: Record<string, { live: string; offline: string }> = {
  en: { live: 'Live · server connected', offline: 'Offline mode · saved locally' },
  es: { live: 'En vivo · servidor conectado', offline: 'Modo sin conexión · guardado local' },
  ru: { live: 'Онлайн · сервер подключён', offline: 'Офлайн-режим · данные локально' },
  mk: { live: 'Во живо · сервер поврзан', offline: 'Офлајн режим · зачувано локално' },
  de: { live: 'Live · Server verbunden', offline: 'Offline-Modus · lokal gespeichert' },
  fr: { live: 'En direct · serveur connecté', offline: 'Mode hors ligne · sauvegarde locale' },
};

const MOCK_USERS = [
  { id: 'm1', username: 'HistoriaClio',    xp: 5840, videoXp: 2200, country: '🇩🇪', streak: 62 },
  { id: 'm2', username: 'ChronoMaster',   xp: 5210, videoXp: 1800, country: '🇫🇷', streak: 44 },
  { id: 'm3', username: 'TimeTraveler99', xp: 4780, videoXp: 1400, country: '🇬🇧', streak: 38 },
  { id: 'm4', username: 'AncientScholar', xp: 4120, videoXp: 900,  country: '🇮🇹', streak: 27 },
  { id: 'm5', username: 'MedievalMind',   xp: 3650, videoXp: 600,  country: '🇪🇸', streak: 19 },
];

type FriendEntry = { id: string; username: string; xp: number; videoXp: number; country: string; streak: number };
type RequestEntry = { fromId: string; fromUsername: string; xp: number };

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
  const [sentIds, setSentIds]         = useState<string[]>([]);
  const [received, setReceived]       = useState<RequestEntry[]>([]);
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
    setSentIds(loadJSON<string[]>(storageKey('sent', userId), []));
    setReceived(loadJSON<RequestEntry[]>(storageKey('received', userId), []));
  }, [userId]);

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

  // Pool of searchable users: mock users minus current user and already-friends
  const friendIds = new Set(friends.map(f => f.id));
  const pool = MOCK_USERS.filter(u => u.id !== userId && !friendIds.has(u.id));

  const searchResults = searchQuery.trim().length > 0
    ? pool.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  function sendRequest(user: typeof MOCK_USERS[number]) {
    if (!userId) return;
    const newSent = [...sentIds, user.id];
    setSentIds(newSent);
    saveJSON(storageKey('sent', userId), newSent);

    // Simulate writing to the target user's received requests
    const targetReceived = loadJSON<RequestEntry[]>(storageKey('received', user.id), []);
    targetReceived.push({ fromId: userId, fromUsername: currentUser?.username ?? 'You', xp: 0 });
    saveJSON(storageKey('received', user.id), targetReceived);

    // Best-effort server write — persists across devices when the backend is up.
    if (socialApiConfigured()) void apiAddFriend(user.username);

    toast.success(`Friend request sent to ${user.username}`);
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

    toast.success(`${req.fromUsername} is now your friend!`);
  }

  function declineRequest(req: RequestEntry) {
    if (!userId) return;
    const newReceived = received.filter(r => r.fromId !== req.fromId);
    setReceived(newReceived);
    saveJSON(storageKey('received', userId), newReceived);
    toast.success(`Request from ${req.fromUsername} declined`);
  }

  function removeFriend(friend: FriendEntry) {
    if (!userId) return;
    const newFriends = friends.filter(f => f.id !== friend.id);
    setFriends(newFriends);
    saveJSON(storageKey('friends', userId), newFriends);
    toast.success(`Removed ${friend.username} from friends`);
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
              {(NET_LABEL[language] ?? NET_LABEL.en)[serverOnline ? 'live' : 'offline']}
            </span>
          )}
        </div>

        {/* Search */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="w-4 h-4" /> Find Users
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
                  const alreadySent = sentIds.includes(user.id);
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
              <p className="text-sm text-muted-foreground text-center py-2">No users found matching "{searchQuery}"</p>
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
            <TabsTrigger value="sent" className="flex-1 gap-1.5">
              <Clock className="w-4 h-4" /> {t.fr_tab_sent}
              {sentIds.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">{sentIds.length}</Badge>
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
                              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-background" title="Online" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold truncate">{friend.username}</span>
                              {friend.country && <span className="text-xs">{friend.country}</span>}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs text-muted-foreground">{friend.xp.toLocaleString()} XP</span>
                              <span className="text-xs text-muted-foreground">{friend.streak}d streak</span>
                            </div>
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
                            className="gap-1.5 shrink-0"
                            onClick={() => setChatFriend(friend)}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t.fr_message}</span>
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

          {/* Sent requests */}
          <TabsContent value="sent">
            <Card>
              <CardContent className="pt-4 pb-4">
                {sentIds.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <Clock className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                    <p className="text-sm text-muted-foreground">{t.fr_no_sent}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sentIds.map(sentId => {
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
                              <p className="text-xs text-muted-foreground">Request pending</p>
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
            onClose={() => setChatFriend(null)}
            onChallenge={() => { const f = chatFriend; setChatFriend(null); setDuelFriend(f); }}
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
                            } else {
                              setGiftSentMsg(res.error ?? 'Gift failed.');
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
        />
      )}
    </AppShell>
  );
}

// ── Sliding chat drawer with a canned-reply opponent ─────────────────────────
function ChatDrawer({ userId, friend, t, onClose, onChallenge }: {
  userId: string;
  friend: FriendEntry;
  t: Record<string, string>;
  onClose: () => void;
  onChallenge: () => void;
}) {
  const [thread, setThread] = useState<ChatMsg[]>(() => loadThread(userId, friend.id));
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const record = loadDuelRecord(userId, friend.id);

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
    // The friend replies shortly with a canned line, so the thread feels live.
    setTimeout(() => {
      const reply: ChatMsg = { id: crypto.randomUUID(), from: friend.id, text: autoReplyFor(friend.id, next.length), ts: new Date().toISOString() };
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
