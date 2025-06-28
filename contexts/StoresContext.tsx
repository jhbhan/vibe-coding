import { GROCERY_STORES } from '@/constants/groceryStores';
import { addStoreAsync, fetchStoresAsync } from '@/constants/supabase';
import { Store } from '@/types';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface StoresContextType {
  stores: Store[];
  addStore: (store: string) => Promise<void>;
}

const initialStoreContext: StoresContextType = {
  stores: GROCERY_STORES,
  addStore: async () => {}
};

export const StoresContext = createContext<StoresContextType>(initialStoreContext);

export const StoresProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>(GROCERY_STORES);

  const fetchItems = async () => {
    const { data, error } = await fetchStoresAsync();
    if (!error && data) setStores(data as Store[]);
    if (error)
      alert(error)
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addStore = async (store: string) => {
    if (!store || stores.map(s => s.name).includes(store))
      return; // Prevent duplicates or empty stores
    const { data, error } = await addStoreAsync({
      name: store,
      id: '',
      image: ''
    });

    if (error) {
      alert('Error adding store: ' + error.message);
      return;
    }
    else {
      setStores(prev => [...prev, data as Store]);
    }
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