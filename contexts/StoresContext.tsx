import { GROCERY_STORES } from '@/constants/groceryStores';
import { addStoreAsync, fetchStoresAsync } from '@/constants/supabase';
import { Store } from '@/types';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

export interface StoresContextType {
  stores: Store[];
  addStore: (store: Store) => void;
  storeNames: Record<number, string>
}

const initialStoreContext: StoresContextType = {
  stores: GROCERY_STORES,
  addStore: async () => false,
  storeNames: {}
};

export const StoresContext = createContext<StoresContextType>(initialStoreContext);

export const StoresProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>(GROCERY_STORES);
  const { user } = useAuth();

  const fetchItems = useCallback(async () => {
      const { data, error } = await fetchStoresAsync();
      if (!error && data) setStores(data as Store[]);
      if (error)
        alert(error)
  }, [user.user_id]);

  useEffect(() => {
    fetchItems();
  }, []);

  const addStore = (store: Store) => {
    setStores(prev => [...prev, store]);
  };
  
  const storeNames: Record<number, string> = useMemo(() => {
    var storeRecord: Record<number, string> = {};
    stores.forEach((x) => {
      storeRecord[x.id] = x.name
    })
    return storeRecord;
  }, [stores]);

  return (
    <StoresContext.Provider value={{ stores, addStore, storeNames }}>
      {children}
    </StoresContext.Provider>
  );
};

export const useStores = () => {
  const context = useContext(StoresContext);
  if (!context) throw new Error('useStores must be used within a StoresProvider');
  return context;
}; 