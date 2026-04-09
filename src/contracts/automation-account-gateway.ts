import type {
  AutomationAccount,
  AutomationAccountCredentials,
} from '../models/automation-account';

/**
 * Contract interface for account management operations.
 * Defines the methods that account gateway implementations must provide.
 */
export interface AutomationAccountGateway {
  /**
   * Creates a new user account.
   * @param account - The account details to create.
   */
  createAccount(account: AutomationAccount): Promise<void>;
  /**
   * Verifies user login credentials.
   * @param account - The credentials to verify.
   */
  verifyLogin(account: AutomationAccountCredentials): Promise<void>;
  /**
   * Deletes a user account.
   * @param account - The credentials for the account to delete.
   */
  deleteAccount(account: AutomationAccountCredentials): Promise<void>;
}
