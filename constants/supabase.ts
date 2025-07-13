import { ItemPrice, ItemViewModel, Store } from '@/types';
import { createClient, PostgrestSingleResponse } from '@supabase/supabase-js';

export type supabaseResponse<T> = PostgrestSingleResponse<T>;

export const IS_DEV = process.env.EXPO_PUBLIC_IS_DEV === 'true';
export const DEV_EMAIL = process.env.EXPO_PUBLIC_DEV_EMAIL;
export const DEV_PASSWORD = process.env.EXPO_PUBLIC_DEV_PASSWORD;
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

      console.log('Fetched items:', data, error);
  
    if (error) throw error;
    return data as ItemViewModel[];
  };
  

export const fetchStoresAsync = async () => {
    return await supabase.from('stores').select('*');
}

export const addItemAsync = async (itemName: string, storeId: string, price: number) => {
    const newItem =  await supabase.from('items').insert({
        name: itemName
    }).select().single();

    console.debug(newItem.data.id);
    console.debug(storeId);
    console.debug(price);

    const insertedItemPrice = await supabase.from('item_prices').insert({
        item_id: newItem.data.id,
        store_id: storeId,
        price: price
    }).select().single();

    if (insertedItemPrice.error) {
        console.debug('Error inserting item price:', insertedItemPrice);
        throw new Error(insertedItemPrice.error.message);
    }
    console.debug('Inserted item price:', insertedItemPrice.data);

    return {
        ...newItem.data,
        prices: [insertedItemPrice.data as ItemPrice],
        historicalLow: insertedItemPrice.data as ItemPrice
    };
};

export const addStoreAsync = async (store: string): Promise<PostgrestSingleResponse<Store>> => {
    return await supabase.from('stores').insert({ name: store }).select().single();
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