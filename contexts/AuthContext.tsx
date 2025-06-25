import { signInAsync, signOutAsync, supabase } from '@/constants/supabase';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = supabase.auth.getSession();
    session.then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await signInAsync(email, password);
    if (error) {
      console.error('Login failed:', error.message);
      return;
    }
    setUser(data.user);
  };
  
  const signOut = async () => {
    const { error } = await signOutAsync();
    if (error) {
      alert('Something happened while trying to log out...');
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}; 