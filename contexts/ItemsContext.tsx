import { addItemAsync, fetchItemsAsync } from '@/constants/supabase';
import { ItemPrice, ItemViewModel } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ItemsContextType {
  items: ItemViewModel[];
  addItem: (items: ItemViewModel) => void;
  refresh: () => Promise<void>;
}

const initialItemsContext = {
  items: [],
  addItem: () => {},
  refresh: async () => {},
}

export const ItemsContext = createContext<ItemsContextType>(initialItemsContext);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ItemViewModel[]>([]);

  const fetchItems = async () => {
    const data = await fetchItemsAsync();
    if (data)
      setItems(data)
  };

  const addItem = async (item: ItemViewModel) => {
    setItems(prev => [...prev, item]);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <ItemsContext.Provider value={{ items, addItem, refresh: fetchItems }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) throw new Error('useItems must be used within an ItemsProvider');
  return context;
};
  