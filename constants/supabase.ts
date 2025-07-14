import { Item, ItemPrice, ItemViewModel, Store } from '@/types';
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

    console.log(JSON.stringify(data as ItemViewModel[], null, 2));
  
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

export const updateItemAsync = async (item: ItemViewModel) => {
    const { id, name, is_favorite, item_prices } = item;
    const { data, error } = await supabase
        .from('items')
        .update({ name, is_favorite })
        .eq('id', id);
    if (error) throw error;
    console.debug('Updated item:', data);
    const newPrices = item_prices.filter(p => !p.id) as ItemPrice[];
    const existingPrices = item_prices.filter(p => p.id) as ItemPrice[]
    
    console.log('New prices:', newPrices);

    if (newPrices.length > 0) {
        const { data: insertedPrices, error: insertError } = await supabase
            .from('item_prices')
            .insert(newPrices.map(p => ({ ...p, item_id: id })))
            .select();
        if (insertError) throw insertError;
        console.debug('Inserted new prices:', insertedPrices);
    }
    if (existingPrices.length > 0) {
        const { data: updatedPrices, error: updateError } = await supabase
            .from('item_prices')
            .update(existingPrices.map(p => ({ price: p.price })))
            .in('id', existingPrices.map(p => p.id));
        if (updateError) throw updateError;
        console.debug('Updated existing prices:', updatedPrices);
    }
}

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