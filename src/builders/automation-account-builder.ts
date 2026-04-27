import type { AutomationAccount } from '../models/automation-account';

/**
 * Builder class for creating automation test accounts.
 * Uses the builder pattern to allow flexible account creation with optional overrides.
 */
export class AutomationAccountBuilder {
  private readonly draft: AutomationAccount;

  /**
   * Initializes the builder with default automation account values.
   * Generates a unique email using timestamp and random number.
   */
  constructor() {
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    this.draft = {
      name: 'Playwright Test User',
      email: `pw-${uniqueId}@example.com`,
      password: 'Pass123!',
      title: 'Mr',
      birth_date: '17',
      birth_month: '2',
      birth_year: '2005',
      firstname: 'Playwright',
      lastname: 'User',
      company: 'QA',
      address1: 'Street 1',
      address2: 'Suite 2',
      country: 'India',
      zipcode: '12345',
      state: 'State',
      city: 'City',
      mobile_number: '1234567890',
    };
  }

  /**
   * Applies partial field overrides to the current draft.
   * @param overrides Fields to override on the account draft.
   * @returns The current builder instance for fluent chaining.
   */
  withOverrides(overrides: Partial<AutomationAccount>): this {
    Object.assign(this.draft, overrides);
    return this;
  }

  /**
   * Builds and returns a copy of the final automation account.
   * Optional overrides can be applied without mutating the internal draft.
   * @returns A new copy of the constructed account.
   */
  build(overrides: Partial<AutomationAccount> = {}): AutomationAccount {
    return { ...this.draft, ...overrides };
  }
}
