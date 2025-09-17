import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseClient';
import type { Session } from '@supabase/supabase-js';

interface UserContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // v2 API: getSession() is async.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // v2 API: onAuthStateChange returns the subscription directly in the data property.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
        const currentUser: User = {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || 'User',
            email: session.user.email || '',
            profileImageUrl: session.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${session.user.user_metadata?.full_name || 'A'}`
        }
        setUser(currentUser);
    } else {
        setUser(null);
    }
  }, [session]);

  const signInWithGoogle = async () => {
    // v2 API: The OAuth method is signInWithOAuth.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Error logging in with Google:', error.message);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
  };
  
  const value = { user, session, loading, signInWithGoogle, signOut };

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