import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Page object model for the shopping cart page.
 * Provides methods to navigate to and verify cart contents.
 */
export class CartPage {
  /**
   * Initializes the CartPage.
   * @param page - The Playwright page object.
   */
  constructor(private readonly page: Page) {}

  /**
   * Navigates to the shopping cart page.
   */
  async goto(): Promise<void> {
    await this.page.goto('/view_cart');
  }

  /**
   * Verifies that a specific product is visible in the cart with the correct name.
   * @param productId - The product ID to identify the product row.
   * @param productName - The expected product name to verify.
   */
  async expectProductInCart(
    productId: number,
    productName: string,
  ): Promise<void> {
    const productRow = this.page.locator(`#product-${productId}`);

    await expect(productRow).toBeVisible();
    await expect(productRow).toContainText(productName);
  }
}
