import type { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';

import type { ProductCatalogGateway } from '../contracts/product-catalog-gateway';
import type { ProductListResponse } from '../models/product';

/**
 * API client implementation for fetching products and managing shopping cart items.
 * Provides methods to list products and add items to cart via REST API.
 */
export class AutomationExerciseProductGateway implements ProductCatalogGateway {
  /**
   * Initializes the product gateway with an API request context.
   * @param request - The Playwright APIRequestContext used to make API calls.
   */
  constructor(private readonly request: APIRequestContext) {}

  /**
   * Retrieves the list of available products from the API.
   * @returns An array of products from the catalog.
   * @throws Error if the API response indicates failure.
   */
  async listProducts() {
    const response = await this.request.get('/api/productsList');
    const body = (await response.json()) as ProductListResponse;

    expect(response.status()).toBe(200);
    await expect(response).toBeOK();
    expect(body.responseCode).toBe(200);

    return body.products;
  }

  /**
   * Adds a product to the shopping cart via the API.
   * @param productId - The ID of the product to add to cart.
   * @throws Error if the API response indicates failure.
   */
  async addToCart(productId: number): Promise<void> {
    const response = await this.request.get(`/add_to_cart/${productId}`);

    expect(response.status()).toBe(200);
    await expect(response).toBeOK();
  }
}
