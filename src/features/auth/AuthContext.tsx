import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserProgress } from '@/types';
import { loadProgress, createInitialProgress } from '@/features/progress/progressStore';

const USERS_KEY = 'historify:users';
const CUR_KEY = 'historify:currentUserId';

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

interface AuthCtx { currentUser: User | null; progress: UserProgress | null; login(e: string, p: string): Promise<{success:boolean;error?:string}>; register(u: string, e: string, p: string): Promise<{success:boolean;error?:string}>; logout(): void; refreshProgress(): void; }
const AuthContext = createContext<AuthCtx | null>(null);

interface AuthInternalCtx {
  updateUsername(n: string): void;
  resetProgress(): void;
  updateEmail(email: string, currentPassword: string): Promise<{success:boolean;error?:string}>;
  updatePassword(currentPwd: string, newPwd: string): Promise<{success:boolean;error?:string}>;
}
const AuthInternalContext = createContext<AuthInternalCtx>({
  updateUsername: () => {},
  resetProgress: () => {},
  updateEmail: async () => ({ success: false }),
  updatePassword: async () => ({ success: false }),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const id = localStorage.getItem(CUR_KEY);
    if (!id) return null;
    return getUsers().find(u => u.id === id) ?? null;
  });
  const [progress, setProgress] = useState<UserProgress | null>(() => {
    const id = localStorage.getItem(CUR_KEY);
    if (!id) return null;
    return loadProgress(id);
  });

  const refreshProgress = useCallback(() => { if (currentUser) setProgress(loadProgress(currentUser.id)); }, [currentUser]);

  const login = useCallback(async (email: string, password: string) => {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, error: 'No account found with that email.' };
    const sha = await hashPassword(password);
    const legacy = btoa(password);
    if (user.passwordHash !== sha && user.passwordHash !== legacy) return { success: false, error: 'Incorrect password.' };
    if (user.passwordHash === legacy) {
      saveUsers(users.map(u => u.id === user.id ? { ...u, passwordHash: sha } : u));
    }
    localStorage.setItem(CUR_KEY, user.id); setCurrentUser(user); setProgress(loadProgress(user.id));
    return { success: true };
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) return { success: false, error: 'Email already registered.' };
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) return { success: false, error: 'Username already taken.' };
    const newUser: User = { id: crypto.randomUUID(), username, email, passwordHash: await hashPassword(password), avatarInitials: username.slice(0,2).toUpperCase(), createdAt: new Date().toISOString() };
    saveUsers([...users, newUser]);
    const p = createInitialProgress(newUser.id);
    localStorage.setItem(CUR_KEY, newUser.id); setCurrentUser(newUser); setProgress(p);
    return { success: true };
  }, []);

  const logout = useCallback(() => { localStorage.removeItem(CUR_KEY); setCurrentUser(null); setProgress(null); }, []);

  const updateUsername = useCallback((name: string) => {
    if (!currentUser) return;
    const users = getUsers().map(u => u.id === currentUser.id ? { ...u, username: name, avatarInitials: name.slice(0,2).toUpperCase() } : u);
    saveUsers(users); setCurrentUser(users.find(u => u.id === currentUser.id)!);
  }, [currentUser]);

  const updateEmail = useCallback(async (email: string, currentPassword: string) => {
    if (!currentUser) return { success: false, error: 'Not logged in.' };
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
    const updated = users.map(u => u.id === currentUser.id ? { ...u, email } : u);
    saveUsers(updated);
    setCurrentUser(updated.find(u => u.id === currentUser.id)!);
    return { success: true };
  }, [currentUser]);

  const updatePassword = useCallback(async (currentPwd: string, newPwd: string) => {
    if (!currentUser) return { success: false, error: 'Not logged in.' };
    const users = getUsers();
    const user = users.find(u => u.id === currentUser.id)!;
    const sha = await hashPassword(currentPwd);
    const legacy = btoa(currentPwd);
    if (user.passwordHash !== sha && user.passwordHash !== legacy) {
      return { success: false, error: 'Current password is incorrect.' };
    }
    const newHash = await hashPassword(newPwd);
    saveUsers(users.map(u => u.id === currentUser.id ? { ...u, passwordHash: newHash } : u));
    return { success: true };
  }, [currentUser]);

  const resetProgress = useCallback(() => { if (currentUser) setProgress(createInitialProgress(currentUser.id)); }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, progress, login, register, logout, refreshProgress }}>
      <AuthInternalContext.Provider value={{ updateUsername, resetProgress, updateEmail, updatePassword }}>
        {children}
      </AuthInternalContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() { const c = useContext(AuthContext); if (!c) throw new Error('useAuth outside AuthProvider'); return c; }
export function useAuthInternal() { return useContext(AuthInternalContext); }
