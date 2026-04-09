export type Product = {
  id: number;
  name: string;
  price: string;
};

export type ProductListResponse = {
  responseCode: number;
  products: Product[];
};
