import { useState, useEffect } from 'react';
import { Users, Search, UserPlus, UserCheck, Clock, X, Check } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/features/auth/AuthContext';
import { getChessRank } from '@/features/ranks/chessRanks';
import { toast } from 'sonner';

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
  const { currentUser } = useAuth();
  const userId = currentUser?.id ?? '';

  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends]         = useState<FriendEntry[]>([]);
  const [sentIds, setSentIds]         = useState<string[]>([]);
  const [received, setReceived]       = useState<RequestEntry[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (!userId) return;
    setFriends(loadJSON<FriendEntry[]>(storageKey('friends', userId), []));
    setSentIds(loadJSON<string[]>(storageKey('sent', userId), []));
    setReceived(loadJSON<RequestEntry[]>(storageKey('received', userId), []));
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold">Friends</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Connect with other history learners</p>
          </div>
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
                placeholder="Search by username..."
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
                          <><Clock className="w-3.5 h-3.5" /> Sent</>
                        ) : (
                          <><UserPlus className="w-3.5 h-3.5" /> Add</>
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
              <UserCheck className="w-4 h-4" /> Friends
              {friends.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">{friends.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1 gap-1.5">
              <UserPlus className="w-4 h-4" /> Requests
              {received.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0 bg-primary/20 text-primary">{received.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex-1 gap-1.5">
              <Clock className="w-4 h-4" /> Sent
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
                    <p className="text-sm text-muted-foreground">No friends yet. Search for users above!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {friends.map(friend => {
                      const rank = getChessRank(friend.videoXp);
                      return (
                        <div key={friend.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent/20 transition-colors">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                              {getInitials(friend.username)}
                            </AvatarFallback>
                          </Avatar>
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
                          <div className={`shrink-0 flex flex-col items-center px-2 py-1 rounded-lg border ${rank.borderColor} ${rank.bgColor}`}>
                            <span className="text-base leading-none">{rank.icon}</span>
                            <span className={`text-[10px] font-bold mt-0.5 ${rank.color}`}>{rank.name}</span>
                          </div>
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
                    <p className="text-sm text-muted-foreground">No incoming friend requests</p>
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
                            <Check className="w-3.5 h-3.5" /> Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => declineRequest(req)}
                          >
                            <X className="w-3.5 h-3.5" /> Decline
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
                    <p className="text-sm text-muted-foreground">No pending sent requests</p>
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
                          <Badge variant="outline" className="text-xs text-muted-foreground shrink-0">Pending</Badge>
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
    </AppShell>
  );
}
