import { ItemPrice, ItemViewModel, Store } from '@/types';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

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

export const addItemAsync = async (itemName: string, storeId: string, price: number) => {
    const itemId =  await supabase.from('items').insert({
        name: itemName
    }).select('id').single();

    const insertedItemPrice = await supabase.from('item_prices').insert({
        item_id: itemId.data.id,
        store_id: storeId,
        price: price
    }).select('*').single();
};

export const addStoreAsync = async (store: string) => {
    return await supabase.from('stores').insert({ name: store });
};

export const signUpAsync = async (email: string, password: string, firstName: string, lastName: string) => {
    return await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName
            }
        }
    });
};