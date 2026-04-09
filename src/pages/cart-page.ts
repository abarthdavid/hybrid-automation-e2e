import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/view_cart');
  }

  async expectProductInCart(
    productId: number,
    productName: string,
  ): Promise<void> {
    const productRow = this.page.locator(`#product-${productId}`);

    await expect(productRow).toBeVisible();
    await expect(productRow).toContainText(productName);
  }
}
