import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseClient';
import type { Session, SignInWithPasswordCredentials } from '@supabase/supabase-js';

interface UserContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithEmail: (credentials: SignInWithPasswordCredentials) => Promise<any>;
  signUpWithEmail: (credentials: SignInWithPasswordCredentials) => Promise<any>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
        const currentUser: User = {
            id: session.user.id,
            // For social providers, Supabase often populates full_name.
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            profileImageUrl: session.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.user_metadata?.full_name || session.user.email || 'A')}`
        }
        setUser(currentUser);
    } else {
        setUser(null);
    }
  }, [session]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) console.error('Error logging in with Google:', error.message);
  };

  const signInWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' });
    if (error) console.error('Error logging in with Facebook:', error.message);
  };

  const signInWithEmail = async (credentials: SignInWithPasswordCredentials) => {
    return await supabase.auth.signInWithPassword(credentials);
  };

  const signUpWithEmail = async (credentials: SignInWithPasswordCredentials) => {
    return await supabase.auth.signUp(credentials);
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