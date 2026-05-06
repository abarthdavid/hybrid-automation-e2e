import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { acceptConsentIfPresent } from './consent-helper';

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
    await acceptConsentIfPresent(this.page);
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

  /**
   * Proceeds from cart to checkout page.
   */
  async proceedToCheckout(): Promise<void> {
    const checkoutButton = this.page.locator('.check_out');

    await expect(checkoutButton).toBeVisible();
    await checkoutButton.click();
    await expect(this.page).toHaveURL(/\/checkout/);
  }

  /**
   * Verifies that checkout summary contains all expected product descriptions.
   * @param expectedDescriptions - Product descriptions expected in checkout summary.
   */
  async expectCheckoutSummaryContainsDescriptions(
    expectedDescriptions: string[],
  ): Promise<void> {
    const checkoutSummary = this.page.locator('#cart_items');

    await expect(checkoutSummary).toBeVisible();

    for (const description of expectedDescriptions) {
      await expect(checkoutSummary).toContainText(description);
    }
  }
}
