export interface Item {
    id: string;
    name: string;
    is_favorite: boolean;
}

export interface ItemViewModel extends Item {
    item_prices: ItemPrice[],
    historical_low: ItemPrice
}

export interface EditableItemPrice extends ItemPrice {
    price_string: string;
}

export interface ItemPrice {
    id?: string
    item_id: string,
    store_id: string,
    price: number,
    created_at?: Date,
    user_id?: string // Optional, if the Item Price is user generated
};
  
export interface Store {
    id: string;
    name: string;
    user_id?: string, // Optional, if the store is user generated
}