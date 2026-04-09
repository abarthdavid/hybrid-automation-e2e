import type { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';

import type { ProductCatalogGateway } from '../contracts/product-catalog-gateway';
import type { ProductListResponse } from '../models/product';

export class AutomationExerciseProductGateway implements ProductCatalogGateway {
  constructor(private readonly request: APIRequestContext) {}

  async listProducts() {
    const response = await this.request.get('/api/productsList');
    const body = (await response.json()) as ProductListResponse;

    expect(response.status()).toBe(200);
    await expect(response).toBeOK();
    expect(body.responseCode).toBe(200);

    return body.products;
  }

  async addToCart(productId: number): Promise<void> {
    const response = await this.request.get(`/add_to_cart/${productId}`);

    expect(response.status()).toBe(200);
    await expect(response).toBeOK();
  }
}
