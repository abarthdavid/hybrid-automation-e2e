import type { Locator, Page } from '@playwright/test';

/**
 * Page object model for the signup/login page.
 * Provides methods to perform signup and login actions.
 */
export class SignupPage {
  private readonly nameInput: Locator;
  private readonly loginPasswordInput: Locator;
  private readonly loginButton: Locator;
  private readonly signupEmailInput: Locator;
  private readonly loginEmailInput: Locator;
  private readonly signupButton: Locator;

  /**
   * Initializes the SignupPage with locators for signup/login form elements.
   * @param page - The Playwright page object used to locate elements.
   */
  constructor(private readonly page: Page) {
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.loginEmailInput = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.signupButton = page.getByRole('button', { name: 'Signup' });
  }

  /**
   * Navigates to the signup/login page.
   */
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  /**
   * Fills out the signup form and clicks the signup button.
   * @param name - The user's name for signup.
   * @param email - The user's email address for signup.
   */
  async startSignup(name: string, email: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  /**
   * Fills out the login form and clicks the login button.
   * @param email - The user's email address for login.
   * @param password - The user's password for login.
   */
  async startLogin(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }
}
