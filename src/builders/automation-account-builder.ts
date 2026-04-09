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
   * Builds and returns a copy of the final automation account.
   * @returns A new copy of the constructed account.
   */
  build(): AutomationAccount {
    return { ...this.draft };
  }
}
