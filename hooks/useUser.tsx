import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getSupabase } from '../services/supabaseClient';
import type { Session, SignInWithPasswordCredentials } from '@supabase/supabase-js';

interface UserContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithEmail: (credentials: SignInWithPasswordCredentials) => Promise<any>;
  // FIX: Use a specific type for email-based sign-up credentials to resolve destructuring error on a union type.
  signUpWithEmail: (credentials: { email: string; password: string; fullName: string; }) => Promise<any>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    // Fetches full user profile from the 'profiles' table when session is available
    if (session?.user) {
      supabase
        .from('profiles')
        .select('full_name, avatar_url, role')
        .eq('id', session.user.id)
        .single()
        .then(({ data: profileData, error }) => {
          if (error) {
            console.error('Error fetching user profile:', error.message);
            // This might happen if the trigger has a slight delay. Fallback gracefully.
            setUser({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              avatar_url: session.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.user_metadata?.full_name || session.user.email || 'A')}`,
              role: 'user', // Default fallback role
            });
          } else if (profileData) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              full_name: profileData.full_name,
              avatar_url: profileData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.full_name || session.user.email || 'A')}`,
              role: profileData.role,
            });
          }
        });
    } else {
      setUser(null);
    }
  }, [session, supabase]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
            redirectTo: window.location.origin,
            // FIX: The 'prompt' option for Supabase OAuth must be nested within 'queryParams'.
            queryParams: {
                prompt: 'select_account', // Helps resolve issues with multiple logged-in accounts
            }
        },
    });
    if (error) console.error('Error logging in with Google:', error.message);
  };

  const signInWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'facebook',
        options: {
            redirectTo: window.location.origin,
        },
    });
    if (error) console.error('Error logging in with Facebook:', error.message);
  };

  const signInWithEmail = async (credentials: SignInWithPasswordCredentials) => {
    return await supabase.auth.signInWithPassword(credentials);
  };

  // FIX: Use a specific type for email-based sign-up credentials to resolve destructuring error on a union type.
  const signUpWithEmail = async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
  };
  
  const value = { user, session, loading, signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail, signOut };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};