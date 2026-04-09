import type { Locator, Page } from '@playwright/test';
export class SignupPage {
  private readonly nameInput: Locator;
  private readonly loginPasswordInput: Locator;
  private readonly loginButton: Locator;
  private readonly signupEmailInput: Locator;
  private readonly loginEmailInput: Locator;
  private readonly signupButton: Locator;

  constructor(private readonly page: Page) {
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.loginEmailInput = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.signupButton = page.getByRole('button', { name: 'Signup' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async startLogin(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }
}
