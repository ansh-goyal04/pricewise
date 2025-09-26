export type PriceHistoryItem = {
  price: number;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};
export type User={
  email:string;
}
export type ProductCard ={
  id: string;
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  discountRate: number | null;
  description?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  averagePrice?: number | null;
  category?: string | null;
  isOutOfStock?: boolean;
  priceHistory: Array<{
    id: string;
    price: number;
    date: Date;
    productId: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  Users:User[] | []
}

export type Product ={
  url: string;
  currency: string;
  image: string;
  title: string;
  currPrice: number;
  origPrice: number;
  discountRate: number | null;
  description?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  averagePrice?: number | null;
  isOutOfStock?: boolean;
  priceHistory: Array<{
    id: string;
    price: number;
    date: Date;
    productId: string;
  }>;
  
}

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";


  export type EmailContentType = {
    subject: string;
    body: string;
  };
  