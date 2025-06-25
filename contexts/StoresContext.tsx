import { GROCERY_STORES } from '@/constants/groceryStores';
import { fetchStoresAsync } from '@/constants/supabase';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface StoresContextType {
  stores: string[];
  addStore: (store: string) => void;
}

export const StoresContext = createContext<StoresContextType | undefined>(undefined);

export const StoresProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<string[]>(GROCERY_STORES);

  const fetchItems = async () => {
    const { data, error } = await fetchStoresAsync();
    if (!error && data) setStores(data as string[]);
    if (error)
      alert(error)
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addStore = (store: string) => {
    setStores(prev => [...prev, store]);
  };

  return (
    <StoresContext.Provider value={{ stores, addStore }}>
      {children}
    </StoresContext.Provider>
  );
};

export const useStores = () => {
  const context = useContext(StoresContext);
  if (!context) throw new Error('useStores must be used within a StoresProvider');
  return context;
}; 