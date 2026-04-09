/**
 * Represents the login credentials for an automation account.
 */
export type AutomationAccountCredentials = {
  /** The email address of the account. */
  email: string;
  /** The password for the account. */
  password: string;
};

/**
 * Represents a complete automation test account with all registration details.
 */
export type AutomationAccount = AutomationAccountCredentials & {
  /** The full name of the user (for signup). */
  name: string;
  /** The title of the user (Mr, Mrs, Miss). */
  title: 'Mr' | 'Mrs' | 'Miss';
  /** The day of birth. */
  birth_date: string;
  /** The month of birth. */
  birth_month: string;
  /** The year of birth. */
  birth_year: string;
  /** The first name of the user. */
  firstname: string;
  /** The last name of the user. */
  lastname: string;
  /** The company name. */
  company: string;
  /** The first address line. */
  address1: string;
  /** The second address line. */
  address2: string;
  /** The country of residence. */
  country: string;
  /** The postal/zip code. */
  zipcode: string;
  /** The state or province. */
  state: string;
  /** The city of residence. */
  city: string;
  /** The mobile phone number. */
  mobile_number: string;
};
