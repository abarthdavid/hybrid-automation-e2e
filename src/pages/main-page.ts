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

  /**
   * Initializes the MainPage with header locators.
   * @param page - The Playwright page object used to locate elements.
   */
  constructor(page: Page) {
    this.headerMiddle = page.locator('.header-middle');
    this.logoutLink = this.headerMiddle.locator('a[href="/logout"]');
    this.loginLink = this.headerMiddle.locator('a[href="/login"]');
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
}
