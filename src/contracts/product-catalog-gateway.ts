import type { Product } from '../models/product';

export interface ProductCatalogGateway {
  listProducts(): Promise<Product[]>;
  addToCart(productId: number): Promise<void>;
}
