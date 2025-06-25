import { supabase } from '@/constants/supabase';
import { ItemPrice } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ItemsContextType {
  items: ItemPrice[];
  setItems: (items: ItemPrice[]) => void;
  refresh: () => Promise<void>;
}

const initialItemsContext = {
  items: [],
  setItems: () => {},
  refresh: async () => {},
}

export const ItemsContext = createContext<ItemsContextType>(initialItemsContext);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ItemPrice[]>([]);

  const fetchItems = async () => {
    const { data, error } = await supabase.from('items').select('*');
    if (!error && data) setItems(data as ItemPrice[]);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <ItemsContext.Provider value={{ items, setItems, refresh: fetchItems }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) throw new Error('useItems must be used within an ItemsProvider');
  return context;
};
  