import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import type { AutomationAccount } from '../models/automation-account';

export class RegistrationPage {
  private readonly nameInput: Locator;
  private readonly loginPasswordInput: Locator;
  private readonly signupButton: Locator;
  private readonly titleMrRadio: Locator;
  private readonly passwordInput: Locator;
  private readonly birthDaySelect: Locator;
  private readonly birthMonthSelect: Locator;
  private readonly birthYearSelect: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly companyInput: Locator;
  private readonly address1Input: Locator;
  private readonly address2Input: Locator;
  private readonly countrySelect: Locator;
  private readonly stateInput: Locator;
  private readonly cityInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly mobileNumberInput: Locator;
  private readonly createAccountButton: Locator;
  private readonly accountCreatedHeading: Locator;
  private readonly signupExistingEmailError: Locator;

  constructor(private readonly page: Page) {
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    this.loginPasswordInput = page.getByRole('textbox', { name: 'Password' });
    this.signupButton = page.getByRole('button', { name: 'Signup' });
    this.titleMrRadio = page.getByRole('radio', { name: 'Mr.' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
    this.birthDaySelect = page.locator('#days');
    this.birthMonthSelect = page.locator('#months');
    this.birthYearSelect = page.locator('#years');
    this.firstNameInput = page.getByRole('textbox', { name: 'First name *' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name *' });
    this.companyInput = page.locator('#company');
    this.address1Input = page.locator('#address1');
    this.address2Input = page.locator('#address2');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipCodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.locator('#mobile_number');
    this.createAccountButton = page.getByRole('button', {
      name: 'Create Account',
    });
    this.accountCreatedHeading = page.getByRole('heading', {
      name: 'Account Created!',
    });
    this.signupExistingEmailError = page.getByText(
      'Email Address already exist!',
    );
  }

  async goto(): Promise<void> {
    await this.page.goto('/signup');
  }

  async completeRegistration(account: AutomationAccount): Promise<void> {
    await this.titleMrRadio.check();
    await this.passwordInput.fill(account.password);
    await this.birthDaySelect.selectOption(account.birth_date);
    await this.birthMonthSelect.selectOption(account.birth_month);
    await this.birthYearSelect.selectOption(account.birth_year);
    await this.firstNameInput.fill(account.firstname);
    await this.lastNameInput.fill(account.lastname);
    await this.companyInput.fill(account.company);
    await this.address1Input.fill(account.address1);
    await this.address2Input.fill(account.address2);
    await this.countrySelect.selectOption(account.country);
    await this.stateInput.fill(account.state);
    await this.cityInput.fill(account.city);
    await this.zipCodeInput.fill(account.zipcode);
    await this.mobileNumberInput.fill(account.mobile_number);
    await this.createAccountButton.click();
  }

  async expectAccountCreated(): Promise<void> {
    await expect(this.accountCreatedHeading).toBeVisible();
  }

  async expectExistingEmailError(): Promise<void> {
    await expect(this.signupExistingEmailError).toBeVisible();
  }
}
