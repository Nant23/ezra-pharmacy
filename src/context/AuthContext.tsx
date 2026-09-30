import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Address, User } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { mockUsers } from '../data/users';

const REGISTERED_USERS_KEY = 'ezra_registered_users';

export type StoredAccount = User;

export function getRegisteredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) return mockUsers;

    const parsed: Array<StoredAccount & { password?: string }> = JSON.parse(raw);
    if (!Array.isArray(parsed)) return mockUsers;

    const sanitized = parsed.map(account => {
      const safeAccount = { ...account };
      delete safeAccount.password;
      return safeAccount;
    });
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(sanitized));
    return sanitized;
  } catch {
    return mockUsers;
  }
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<AuthResult>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface AuthResult {
  success: boolean;
  message?: string;
  requiresEmailConfirmation?: boolean;
  isAdmin?: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface ProfileRecord {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  addresses?: Address[] | null;
  avatar_url?: string | null;
  created_at?: string | null;
}

async function loadAppUser(authUser: SupabaseUser): Promise<User> {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, email, phone, role, addresses, avatar_url, created_at')
    .eq('id', authUser.id)
    .maybeSingle();

  if (error) console.error('Failed to load user profile:', error);

  const profile = data as ProfileRecord | null;
  const metadata = authUser.user_metadata ?? {};
  const email = authUser.email ?? '';

  return {
    id: authUser.id,
    name: profile?.name || metadata.name || email.split('@')[0] || 'Customer',
    email: profile?.email || email,
    phone: profile?.phone || metadata.phone || '',
    role: profile?.role === 'admin' ? 'admin' : 'user',
    addresses: Array.isArray(profile?.addresses) ? profile.addresses : [],
    avatar: profile?.avatar_url || metadata.avatar_url || undefined,
    joinedDate: (profile?.created_at || authUser.created_at).slice(0, 10),
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    localStorage.removeItem('ezra_user');
    getRegisteredAccounts();

    if (!isSupabaseConfigured) {
      return;
    }

    let isMounted = true;
    const applySession = (authUser: SupabaseUser | null) => {
      if (!authUser) {
        if (isMounted) setUser(null);
        return;
      }

      window.setTimeout(() => {
        void loadAppUser(authUser)
          .then(profile => {
            if (isMounted) setUser(profile);
          })
          .catch(error => console.error('Failed to restore Supabase session:', error));
      }, 0);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session?.user ?? null);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('Failed to restore Supabase session:', error);
      applySession(data.session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'Supabase is not configured. Add your project URL and anon key, then restart the app.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) return { success: false, message: error.message };
      if (!data.user) return { success: false, message: 'Unable to load your account. Please try again.' };

      const appUser = await loadAppUser(data.user);
      setUser(appUser);
      return { success: true, isAdmin: appUser.role === 'admin' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to connect to Supabase. Please try again.',
      };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Failed to sign out:', error);
    }
    setUser(null);
  };

  const register = async (data: RegisterData): Promise<AuthResult> => {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'Supabase is not configured. Add your project URL and anon key, then restart the app.' };
    }

    try {
      const { data: result, error } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        options: {
          data: {
            name: data.name.trim(),
            phone: data.phone.trim(),
          },
        },
      });
      if (error) return { success: false, message: error.message };
      if (!result.user) return { success: false, message: 'Unable to create your account. Please try again.' };
      if (!result.user.identities?.length) {
        return { success: false, message: 'An account with this email already exists. Please sign in instead.' };
      }
      if (!result.session) return { success: true, requiresEmailConfirmation: true };

      setUser(await loadAppUser(result.user));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to connect to Supabase. Please try again.',
      };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
