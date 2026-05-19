import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Page object model for the main/home page.
 * Provides methods to interact with header navigation and logout functionality.
 */
export class MainPage {
  private readonly headerMiddle: Locator;
  private readonly logoutLink: Locator;
  private readonly loginLink: Locator;
  private readonly productItems: Locator;
  private readonly successfullyAddedModal: Locator;
  private readonly continueButton: Locator;
  private readonly goToCartButton: Locator;
  /**
   * Initializes the MainPage with header locators.
   * @param page - The Playwright page object used to locate elements.
   */
  constructor(page: Page) {
    this.headerMiddle = page.locator('.header-middle');
    this.logoutLink = this.headerMiddle.locator('a[href="/logout"]');
    this.loginLink = this.headerMiddle.locator('a[href="/login"]');
    this.productItems = page.locator('.features_items .col-sm-4');
    this.successfullyAddedModal = page.locator('.modal-content');
    this.continueButton = this.successfullyAddedModal.locator(
      'button:has-text("Continue Shopping")',
    );
    this.goToCartButton = this.successfullyAddedModal.locator(
      'a:has-text("View Cart")',
    );
  }

  /**
   * Verifies that the header middle section is visible.
   */
  async expectHeaderMiddleVisible(): Promise<void> {
    await expect(this.headerMiddle).toBeVisible();
  }

  /**
   * Verifies that the logout link is visible.
   */
  async expectLogoutVisible(): Promise<void> {
    await expect(this.logoutLink).toBeVisible();
  }

  /**
   * Verifies that the login link is visible.
   */
  async expectLoginVisible(): Promise<void> {
    await expect(this.loginLink).toBeVisible();
  }

  /**
   * Clicks the logout link.
   */
  async clickLogout(): Promise<void> {
    await this.logoutLink.click();
  }

  /**
   * Verifies that the product card at the given index is visible.
   * @param productIndex - Zero-based index of the product card.
   */
  async expectProductVisible(productIndex: number): Promise<void> {
    await expect(this.productItems.nth(productIndex)).toBeVisible();
  }

  /**
   * Returns the description text of the product card at the given index.
   * @param productIndex - Zero-based index of the product card.
   */
  async getProductDescription(productIndex: number): Promise<string> {
    const productCard = this.productItems.nth(productIndex);
    const description =
      (
        await productCard.locator('.productinfo p').first().textContent()
      )?.trim() ?? '';

    return description;
  }

  /**
   * Adds the product at the given index to cart.
   * @param productIndex - Zero-based index of the product card.
   */
  async addProductToCart(productIndex: number): Promise<void> {
    const productCard = this.productItems.nth(productIndex);
    const addToCartButton = productCard
      .locator('.productinfo .add-to-cart')
      .first();

    await addToCartButton.click();
    await expect(this.successfullyAddedModal).toBeVisible();
  }

  /**
   * Closes add-to-cart success modal and continues shopping.
   */
  async continueShopping(): Promise<void> {
    await this.continueButton.click();
    await expect(this.successfullyAddedModal).toBeHidden();
  }

  /**
   * Opens the cart from the success modal.
   */
  async openCartFromAddToCartModal(): Promise<void> {
    await this.goToCartButton.click();
  }
}
