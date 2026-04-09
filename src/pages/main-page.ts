import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class MainPage {
  private readonly headerMiddle: Locator;
  private readonly logoutLink: Locator;
  private readonly loginLink: Locator;

  constructor(private readonly page: Page) {
    this.headerMiddle = page.locator('.header-middle');
    this.logoutLink = this.headerMiddle.locator('a[href="/logout"]');
    this.loginLink = this.headerMiddle.locator('a[href="/login"]');
  }

  async expectHeaderMiddleVisible(): Promise<void> {
    await expect(this.headerMiddle).toBeVisible();
  }

  async expectLogoutVisible(): Promise<void> {
    await expect(this.logoutLink).toBeVisible();
  }

  async expectLoginVisible(): Promise<void> {
    await expect(this.loginLink).toBeVisible();
  }

  async clickLogout(): Promise<void> {
    await this.logoutLink.click();
  }
}
