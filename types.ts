export interface Item {
    id: string;
    name: string;
    isFavorite: boolean;
}

export interface ItemViewModel extends Item {
    prices: ItemPrice[],
    historicalLow: ItemPrice
}

export interface ItemPrice {
    item_id: string,
    store_id: string,
    price: number,
    created_at?: Date
};
  
export interface Store {
    id: string;
    name: string;
    image: string;
}