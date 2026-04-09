import type {
  AutomationAccount,
  AutomationAccountOverrides,
} from '../models/automation-account';

export class AutomationAccountBuilder {
  private readonly draft: AutomationAccount;

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

  with(overrides: AutomationAccountOverrides): this {
    Object.assign(this.draft, overrides);
    return this;
  }

  build(): AutomationAccount {
    return { ...this.draft };
  }
}
