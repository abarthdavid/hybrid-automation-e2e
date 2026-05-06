import type { APIResponse } from '@playwright/test';

import type { CartResponse, Product } from '../models/product';

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
   * Adds a product to the shopping cart and returns the raw API response.
   * @param productId - The ID of the product to add.
   */
  addToCart(productId: number): Promise<APIResponse>;
  /**
   * Adds a product to the shopping cart and returns the parsed response body.
   * @param productId - The ID of the product to add.
   */
  addToCartAndGetResponse(productId: number): Promise<CartResponse>;
}
