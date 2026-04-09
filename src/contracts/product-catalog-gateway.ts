import type { Product } from '../models/product';

/**
 * Contract interface for product catalog and cart operations.
 * Defines the methods that product gateway implementations must provide.
 */
export interface ProductCatalogGateway {
  /**
   * Retrieves the list of available products.
   * @returns An array of products in the catalog.
   */
  listProducts(): Promise<Product[]>;
  /**
   * Adds a product to the shopping cart.
   * @param productId - The ID of the product to add.
   */
  addToCart(productId: number): Promise<void>;
}
