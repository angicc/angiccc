import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserProgress } from '@/types';
import { loadProgress, createInitialProgress } from '@/features/progress/progressStore';

const USERS_KEY = 'historify:users';
const CUR_KEY = 'historify:currentUserId';

function getUsers(): User[] { const r = localStorage.getItem(USERS_KEY); return r ? JSON.parse(r) : []; }
function saveUsers(u: User[]) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

interface AuthCtx { currentUser: User | null; progress: UserProgress | null; login(e: string, p: string): Promise<{success:boolean;error?:string}>; register(u: string, e: string, p: string): Promise<{success:boolean;error?:string}>; logout(): void; refreshProgress(): void; }
const AuthContext = createContext<AuthCtx | null>(null);

interface AuthInternalCtx { updateUsername(n: string): void; resetProgress(): void; }
const AuthInternalContext = createContext<AuthInternalCtx>({ updateUsername: () => {}, resetProgress: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    const id = localStorage.getItem(CUR_KEY);
    if (id) { const u = getUsers().find(u => u.id === id) ?? null; setCurrentUser(u); if (u) setProgress(loadProgress(u.id)); }
  }, []);

  const refreshProgress = useCallback(() => { if (currentUser) setProgress(loadProgress(currentUser.id)); }, [currentUser]);

  const login = useCallback(async (email: string, password: string) => {
    const user = getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, error: 'No account found with that email.' };
    if (user.passwordHash !== btoa(password)) return { success: false, error: 'Incorrect password.' };
    localStorage.setItem(CUR_KEY, user.id); setCurrentUser(user); setProgress(loadProgress(user.id));
    return { success: true };
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) return { success: false, error: 'Email already registered.' };
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) return { success: false, error: 'Username already taken.' };
    const newUser: User = { id: crypto.randomUUID(), username, email, passwordHash: btoa(password), avatarInitials: username.slice(0,2).toUpperCase(), createdAt: new Date().toISOString() };
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

  const resetProgress = useCallback(() => { if (currentUser) setProgress(createInitialProgress(currentUser.id)); }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, progress, login, register, logout, refreshProgress }}>
      <AuthInternalContext.Provider value={{ updateUsername, resetProgress }}>
        {children}
      </AuthInternalContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() { const c = useContext(AuthContext); if (!c) throw new Error('useAuth outside AuthProvider'); return c; }
export function useAuthInternal() { return useContext(AuthInternalContext); }
