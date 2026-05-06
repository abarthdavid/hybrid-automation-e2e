import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

import { acceptConsentIfPresent } from './consent-helper';

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
    await acceptConsentIfPresent(this.page);
  }

  /**
   * Fills out the signup form and clicks the signup button.
   * @param name - The user's name for signup.
   * @param email - The user's email address for signup.
   */
  async startSignup(name: string, email: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.fillEmailAndSubmit(
      this.signupEmailInput,
      email,
      this.signupButton,
    );
  }

  /**
   * Fills out the login form and clicks the login button.
   * @param email - The user's email address for login.
   * @param password - The user's password for login.
   */
  async startLogin(email: string, password: string): Promise<void> {
    await this.loginPasswordInput.fill(password);
    await this.fillEmailAndSubmit(
      this.loginEmailInput,
      email,
      this.loginButton,
    );
  }

  private async fillEmailAndSubmit(
    emailInput: Locator,
    email: string,
    submitButton: Locator,
  ): Promise<void> {
    await emailInput.fill(email);
    await acceptConsentIfPresent(this.page);
    await submitButton.click();
  }

  async expectLoginErrorInvalidEmail(invalidEmail: string): Promise<void> {
    const loginEmailValidity = await this.loginEmailInput.evaluate((input) => {
      const emailInput = input as HTMLInputElement;

      return {
        valid: emailInput.validity.valid,
        typeMismatch: emailInput.validity.typeMismatch,
        validationMessage: emailInput.validationMessage,
      };
    });

    await expect(this.loginEmailInput).toBeFocused();
    expect(loginEmailValidity.valid).toBeFalsy();
    expect(loginEmailValidity.typeMismatch).toBeTruthy();
    expect(loginEmailValidity.validationMessage).toContain(
      `Please include an '@' in the email address. '${invalidEmail}' is missing an \'@\'.`,
    );
  }
}
