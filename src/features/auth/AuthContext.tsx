// ─── Authentication ──────────────────────────────────────────────────────────
// Two account worlds behind one interface.
//
// SERVER ACCOUNTS, when `VITE_API_URL` is configured. Credentials go to
// /api/auth, bcrypt runs there, and the session is an httpOnly cookie this
// page cannot read. This is what makes the social layer real: every
// /api/social route needs that session, so before this existed friends could
// only ever be local fixtures no matter what the server offered.
//
// LOCAL ACCOUNTS, when it is not — local dev, preview builds, the offline
// demo. Unchanged from before: users in localStorage, digest computed in the
// browser. Fine for a single-device demo, and clearly labelled as such.
//
// The server path is preferred whenever it answers. It falls back to local
// only when the backend is unreachable — never when the server actively says
// no, because "wrong password" must not quietly succeed against a stale local
// copy of the same account.
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserProgress } from '@/types';
import { loadProgress, createInitialProgress } from '@/features/progress/progressStore';
import {
  serverAuthConfigured, fetchSession, serverLogin, serverRegister, serverLogout,
  serverChangePassword, type ServerAccount,
} from '@/services/auth';
import { disconnectSocial } from '@/services/social';

const USERS_KEY = 'historify:users';
const CUR_KEY = 'historify:currentUserId';
/** Cached server identity, so a reload renders signed-in before /me answers. */
const SESSION_KEY = 'historify:serverUser';

function getUsers(): User[] { const r = localStorage.getItem(USERS_KEY); return r ? JSON.parse(r) : []; }
function saveUsers(u: User[]) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

async function hashPassword(password: string): Promise<string> {
  // crypto.subtle requires HTTPS; fall back to btoa on plain HTTP (e.g. local network)
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const data = new TextEncoder().encode(password);
      const buf = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch { /* fall through */ }
  return btoa(unescape(encodeURIComponent(password)));
}

/** A server account in the shape the rest of the app already understands. */
function toUser(account: ServerAccount): User {
  return {
    id: account.id,
    username: account.username,
    email: account.email,
    passwordHash: '',            // never mirrored client-side for server accounts
    avatarInitials: account.username.slice(0, 2).toUpperCase(),
    createdAt: account.createdAt,
    serverAccount: true,
    tier: account.tier,
  };
}

function cacheSession(user: User | null) {
  try {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  } catch { /* private mode — the /me call still resolves it */ }
}

function readCachedSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch { return null; }
}

export type AuthResult = { success: boolean; error?: string; notice?: string };

interface AuthCtx {
  currentUser: User | null;
  progress: UserProgress | null;
  login(e: string, p: string): Promise<AuthResult>;
  register(u: string, e: string, p: string, language?: string): Promise<AuthResult>;
  logout(): void;
  refreshProgress(): void;
  loggingOut: boolean;
  startLogout(): void;
  /** True when this session is authenticated against the server. */
  serverSession: boolean;
  /** False until the initial /me check has settled. */
  authReady: boolean;
}
const AuthContext = createContext<AuthCtx | null>(null);

interface AuthInternalCtx {
  updateUsername(n: string): void;
  resetProgress(): void;
  updateEmail(email: string, currentPassword: string): Promise<AuthResult>;
  updatePassword(currentPwd: string, newPwd: string): Promise<AuthResult>;
}
const AuthInternalContext = createContext<AuthInternalCtx>({
  updateUsername: () => {},
  resetProgress: () => {},
  updateEmail: async () => ({ success: false }),
  updatePassword: async () => ({ success: false }),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (serverAuthConfigured()) {
      const cached = readCachedSession();
      if (cached) return cached;
    }
    const id = localStorage.getItem(CUR_KEY);
    if (!id) return null;
    return getUsers().find(u => u.id === id) ?? null;
  });
  const [progress, setProgress] = useState<UserProgress | null>(() => {
    const id = readCachedSession()?.id ?? localStorage.getItem(CUR_KEY);
    return id ? loadProgress(id) : null;
  });
  const [loggingOut, setLoggingOut] = useState(false);
  const [authReady, setAuthReady] = useState(!serverAuthConfigured());

  // Reconcile the cached identity with the server's view of the cookie. The
  // cached copy is only a paint-first optimisation: if the cookie expired or
  // was revoked (a password change elsewhere bumps tokenVersion), /me says so
  // and the stale identity has to go, or the UI would show a signed-in shell
  // over an API that 401s every call.
  useEffect(() => {
    if (!serverAuthConfigured()) return;
    let cancelled = false;
    void (async () => {
      const account = await fetchSession();
      if (cancelled) return;
      if (account) {
        const user = toUser(account);
        cacheSession(user);
        setCurrentUser(user);
        setProgress(loadProgress(user.id));
      } else if (readCachedSession()) {
        // We believed we were signed in and are not.
        cacheSession(null);
        setCurrentUser(null);
        setProgress(null);
      }
      setAuthReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const refreshProgress = useCallback(() => {
    if (currentUser) setProgress(loadProgress(currentUser.id));
  }, [currentUser]);

  const adopt = useCallback((user: User, server: boolean) => {
    if (server) cacheSession(user);
    else localStorage.setItem(CUR_KEY, user.id);
    setCurrentUser(user);
    setProgress(loadProgress(user.id));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (serverAuthConfigured()) {
      const result = await serverLogin(email, password);
      if (result.ok) { adopt(toUser(result.user), true); return { success: true }; }
      // A refusal is final — do NOT retry against localStorage, or a wrong
      // password would still sign the learner in from a stale local account.
      if (!('unavailable' in result)) return { success: false, error: result.error };
    }

    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, error: 'No account found with that email.' };
    const sha = await hashPassword(password);
    const legacy = btoa(password);
    if (user.passwordHash !== sha && user.passwordHash !== legacy) {
      return { success: false, error: 'Incorrect password.' };
    }
    if (user.passwordHash === legacy) {
      saveUsers(users.map(u => (u.id === user.id ? { ...u, passwordHash: sha } : u)));
    }
    adopt(user, false);
    return {
      success: true,
      notice: serverAuthConfigured() ? 'Signed in offline — the server could not be reached.' : undefined,
    };
  }, [adopt]);

  const register = useCallback(async (
    username: string, email: string, password: string, language = 'en',
  ): Promise<AuthResult> => {
    if (serverAuthConfigured()) {
      const result = await serverRegister(username, email, password, language);
      if ('pending' in result) {
        // The server will not confirm whether the address was already taken.
        return { success: false, error: result.message };
      }
      if (result.ok) { adopt(toUser(result.user), true); return { success: true }; }
      if (!('unavailable' in result)) return { success: false, error: result.error };
    }

    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered.' };
    }
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'Username already taken.' };
    }
    const newUser: User = {
      id: crypto.randomUUID(), username, email,
      passwordHash: await hashPassword(password),
      avatarInitials: username.slice(0, 2).toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    createInitialProgress(newUser.id);
    adopt(newUser, false);
    return {
      success: true,
      notice: serverAuthConfigured() ? 'Account created offline — the server could not be reached.' : undefined,
    };
  }, [adopt]);

  const logout = useCallback(() => {
    // Drop the live socket first: it authenticates from the session cookie, so
    // leaving it open after sign-out would keep broadcasting this user as
    // online to their friends.
    disconnectSocial();
    if (currentUser?.serverAccount) void serverLogout();
    cacheSession(null);
    localStorage.removeItem(CUR_KEY);
    setCurrentUser(null);
    setProgress(null);
  }, [currentUser]);

  const startLogout = useCallback(() => {
    setLoggingOut(true);
    setTimeout(() => { logout(); setLoggingOut(false); }, 2200);
  }, [logout]);

  const updateUsername = useCallback((name: string) => {
    if (!currentUser) return;
    if (currentUser.serverAccount) {
      const updated = { ...currentUser, username: name, avatarInitials: name.slice(0, 2).toUpperCase() };
      cacheSession(updated);
      setCurrentUser(updated);
      return;
    }
    const users = getUsers().map(u =>
      u.id === currentUser.id ? { ...u, username: name, avatarInitials: name.slice(0, 2).toUpperCase() } : u);
    saveUsers(users);
    setCurrentUser(users.find(u => u.id === currentUser.id)!);
  }, [currentUser]);

  const updateEmail = useCallback(async (email: string, currentPassword: string): Promise<AuthResult> => {
    if (!currentUser) return { success: false, error: 'Not logged in.' };
    if (currentUser.serverAccount) {
      // No server route changes an address yet, and faking it locally would
      // leave the client showing an address the server does not have.
      return { success: false, error: 'Changing your email is not available yet for online accounts.' };
    }
    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== currentUser.id)) {
      return { success: false, error: 'Email is already in use.' };
    }
    const user = users.find(u => u.id === currentUser.id)!;
    const sha = await hashPassword(currentPassword);
    const legacy = btoa(currentPassword);
    if (user.passwordHash !== sha && user.passwordHash !== legacy) {
      return { success: false, error: 'Current password is incorrect.' };
    }
    const updated = users.map(u => (u.id === currentUser.id ? { ...u, email } : u));
    saveUsers(updated);
    setCurrentUser(updated.find(u => u.id === currentUser.id)!);
    return { success: true };
  }, [currentUser]);

  const updatePassword = useCallback(async (currentPwd: string, newPwd: string): Promise<AuthResult> => {
    if (!currentUser) return { success: false, error: 'Not logged in.' };
    if (currentUser.serverAccount) {
      const result = await serverChangePassword(currentPwd, newPwd);
      if (result.ok) return { success: true };
      if ('unavailable' in result) return { success: false, error: 'Could not reach the server. Try again shortly.' };
      return { success: false, error: result.error };
    }
    const users = getUsers();
    const user = users.find(u => u.id === currentUser.id)!;
    const sha = await hashPassword(currentPwd);
    const legacy = btoa(currentPwd);
    if (user.passwordHash !== sha && user.passwordHash !== legacy) {
      return { success: false, error: 'Current password is incorrect.' };
    }
    const newHash = await hashPassword(newPwd);
    saveUsers(users.map(u => (u.id === currentUser.id ? { ...u, passwordHash: newHash } : u)));
    return { success: true };
  }, [currentUser]);

  const resetProgress = useCallback(() => {
    if (currentUser) setProgress(createInitialProgress(currentUser.id));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{
      currentUser, progress, login, register, logout, refreshProgress,
      loggingOut, startLogout,
      serverSession: !!currentUser?.serverAccount,
      authReady,
    }}>
      <AuthInternalContext.Provider value={{ updateUsername, resetProgress, updateEmail, updatePassword }}>
        {children}
      </AuthInternalContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error('useAuth outside AuthProvider');
  return c;
}
export function useAuthInternal() { return useContext(AuthInternalContext); }
