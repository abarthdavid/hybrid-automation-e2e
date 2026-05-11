import { fakerEN as faker } from '@faker-js/faker';
import type { AutomationAccount } from '../models/automation-account';

/**
 * Builder class for creating automation test accounts.
 * Uses the builder pattern to allow flexible account creation with optional overrides.
 */
export class AutomationAccountBuilder {
  private readonly draft: AutomationAccount;

  /**
   * Initializes the builder with default automation account values.
   * Generates realistic data while keeping field formats compatible with registration flows.
   */
  constructor() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const baseEmail = faker.internet.email({
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      provider: 'example.com',
    });
    const [localPart, domain] = baseEmail.split('@');

    this.draft = {
      name: `${firstName} ${lastName}`,
      email: `${localPart}+${Date.now()}@${domain}`,
      password: 'Pass123!',
      title: faker.helpers.arrayElement(['Mr', 'Mrs']),
      birth_date: String(faker.number.int({ min: 1, max: 28 })),
      birth_month: String(faker.number.int({ min: 1, max: 12 })),
      birth_year: String(faker.number.int({ min: 1985, max: 2005 })),
      firstname: firstName,
      lastname: lastName,
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: 'India',
      zipcode: faker.location.zipCode('#####'),
      state: faker.location.state(),
      city: faker.location.city(),
      mobile_number: faker.string.numeric(10),
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
