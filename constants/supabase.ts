import { ItemPrice, ItemViewModel, Store } from '@/types';
import { EXPO_PUBLIC_SUPABASE_ANON_KEY, EXPO_PUBLIC_SUPABASE_URL } from '@env';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = EXPO_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 

export const signInAsync = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

export const signOutAsync = async () => {
    return await supabase.auth.signOut();
};

export const fetchItemsAsync = async () => {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        item_prices (*)
      `);
  
    if (error) throw error;
    return data as ItemViewModel[];
  };
  

export const fetchStoresAsync = async () => {
    return await supabase.from('stores').select('*');
}

export const addItemAsync = async (item: ItemPrice) => {
    return await supabase.from('items').insert([item]);
};

export const addStoreAsync = async (store: Store) => {
    return await supabase.from('stores').insert([store]);
};