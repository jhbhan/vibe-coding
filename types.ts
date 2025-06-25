export type Price = {
    store: string;
    price: number;
};

export type ItemPrice = {
    id: string;
    name: string;
    isFavorite: boolean;
    prices: Price[];
    historicalLow: Price & { date: Date };
  };
  