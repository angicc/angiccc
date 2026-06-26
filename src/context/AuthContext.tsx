import { createContext, useContext, useReducer, type ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  plan: 'starter' | 'growth' | 'agency';
};

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
};

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: AuthUser }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_USER' };

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
};

// ─── Reducer ────────────────────────────────────────────────────────────────

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, isLoading: action.payload, error: null };
    case 'SET_USER': return { ...state, user: action.payload, isLoading: false, error: null };
    case 'SET_ERROR': return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_USER': return { ...state, user: null, isLoading: false, error: null };
    default: return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
    error: null,
  });

  async function login(email: string, _password: string): Promise<void> {
    dispatch({ type: 'SET_LOADING', payload: true });
    // TODO: replace with await supabase.auth.signInWithPassword({ email, password })
    await new Promise((res) => setTimeout(res, 600));
    if (!email.includes('@')) {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid email address.' });
      return;
    }
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    dispatch({
      type: 'SET_USER',
      payload: { id: `usr_${Date.now()}`, email, name, plan: 'growth' },
    });
  }

  async function signup(email: string, _password: string, name: string): Promise<void> {
    dispatch({ type: 'SET_LOADING', payload: true });
    // TODO: replace with await supabase.auth.signUp({ email, password, options: { data: { name } } })
    await new Promise((res) => setTimeout(res, 800));
    if (!email.includes('@')) {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid email address.' });
      return;
    }
    dispatch({
      type: 'SET_USER',
      payload: { id: `usr_${Date.now()}`, email, name, plan: 'starter' },
    });
  }

  async function logout(): Promise<void> {
    dispatch({ type: 'SET_LOADING', payload: true });
    // TODO: replace with await supabase.auth.signOut()
    await new Promise((res) => setTimeout(res, 300));
    dispatch({ type: 'CLEAR_USER' });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
