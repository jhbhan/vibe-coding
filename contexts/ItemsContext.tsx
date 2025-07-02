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
    if (!item || items.map(i => i.name).includes(item.name))
      return; // Prevent duplicates or empty items

    const itemToAdd: ItemPrice = {
      item_id: '',
      store_id: '',
      price: 0
    };
    const { data, error } = await addItemAsync(itemToAdd);

    if (error) {
      alert('Error adding item: ' + error.message);
      return;
    }
    else {
      setItems(prev => [...prev, data as ItemViewModel]);
    }
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
  