// ─── REST → socket bridge ─────────────────────────────────────────────────────
// Socket.io lives in index.ts, but the events worth pushing live are decided in
// the route handlers — a friend request is only a friend request once it has
// been written. Rather than importing index.ts from a route (a cycle: index
// mounts the routers), index registers its `io` here once at boot and the
// routes emit through this seam.
//
// Emitting is FIRE-AND-FORGET and never authoritative. Everything pushed here
// is already durable in Postgres and re-fetchable on connect, so a dropped
// frame — recipient offline, socket layer not started, a test importing the
// router on its own — costs a notification, never data.

type Emitter = { to(room: string): { emit(event: string, payload: unknown): unknown } };

let io: Emitter | null = null;

/** Called once from index.ts after the Socket.io server is constructed. */
export function registerRealtime(server: Emitter): void {
  io = server;
}

/** Push an event into one user's private room, if the socket layer is up. */
export function notifyUser(userId: string, event: string, payload: unknown): void {
  if (!io) return;
  try {
    io.to(`user:${userId}`).emit(event, payload);
  } catch {
    // A failed notification must never fail the request that caused it.
  }
}
