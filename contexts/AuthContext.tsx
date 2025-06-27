import { signInAsync, signOutAsync, signUpAsync, supabase } from '@/constants/supabase';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any;
  signIn: (email: string, password: string) => Promise<string>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
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
      return 'Login failed: ' + error.message;
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

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const { data, error } = await signUpAsync(email, password, firstName, lastName);
    if (error) {
      console.error('Sign up failed:', error.message);
      return;
    }
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}; 