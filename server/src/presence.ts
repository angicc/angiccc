// ─── Online presence registry ─────────────────────────────────────────────────
// Tracks which users currently hold at least one live socket. A user is
// "online" while they have ≥1 connected socket; presence transitions
// (online/offline) are emitted to their friends so the client can light up
// avatars and enable live challenges. Kept in-memory (per node); for a
// multi-node deployment back this with Redis and the socket.io Redis adapter.

type UserId = string;

class PresenceRegistry {
  // userId → set of socket ids
  private sockets = new Map<UserId, Set<string>>();

  /** Register a socket for a user. Returns true if this brought them online. */
  add(userId: UserId, socketId: string): boolean {
    let set = this.sockets.get(userId);
    const wasOffline = !set || set.size === 0;
    if (!set) { set = new Set(); this.sockets.set(userId, set); }
    set.add(socketId);
    return wasOffline;
  }

  /** Drop a socket. Returns true if this took the user offline. */
  remove(userId: UserId, socketId: string): boolean {
    const set = this.sockets.get(userId);
    if (!set) return false;
    set.delete(socketId);
    if (set.size === 0) { this.sockets.delete(userId); return true; }
    return false;
  }

  isOnline(userId: UserId): boolean {
    const set = this.sockets.get(userId);
    return !!set && set.size > 0;
  }

  /** Filter a candidate list down to those currently online. */
  onlineAmong(userIds: UserId[]): UserId[] {
    return userIds.filter(id => this.isOnline(id));
  }

  onlineCount(): number {
    return this.sockets.size;
  }
}

export const presence = new PresenceRegistry();
