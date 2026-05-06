import type { APIRequestContext, APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';

import type { ProductCatalogGateway } from '../contracts/product-catalog-gateway';
import type { CartResponse, ProductListResponse } from '../models/product';

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
   * Adds a product to the shopping cart via the API and returns the raw response.
   * @param productId - The ID of the product to add to cart.
   */
  async addToCart(productId: number): Promise<APIResponse> {
    return await this.request.get(`/add_to_cart/${productId}`);
  }

  /**
   * Adds a product to the shopping cart and returns the parsed response body.
   * @param productId - The ID of the product to add to cart.
   */
  async addToCartAndGetResponse(productId: number): Promise<CartResponse> {
    const response = await this.request.get(`/add_to_cart/${productId}`);
    const contentType = response.headers()['content-type'] ?? '';
    if (contentType.includes('application/json')) {
      return (await response.json()) as CartResponse;
    }
    const text = await response.text();
    return { responseCode: response.status(), message: text };
  }
}
