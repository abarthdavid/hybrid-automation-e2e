import type {
  AutomationAccount,
  AutomationAccountCredentials,
} from '../models/automation-account';

export type ApiMessageResponse = {
  responseCode: number;
  message: string;
};

export type AccountGatewayResponse = {
  status: number;
  ok: boolean;
  body: ApiMessageResponse;
};

/**
 * Contract interface for account management operations.
 * Defines the methods that account gateway implementations must provide.
 */
export interface AutomationAccountGateway {
  /**
   * Creates a new user account.
   * @param account - The account details to create.
   */
  createAccount(account: AutomationAccount): Promise<AccountGatewayResponse>;
  /**
   * Verifies user login credentials.
   * @param account - The credentials to verify.
   */
  verifyLogin(
    account: AutomationAccountCredentials,
  ): Promise<AccountGatewayResponse>;
  /**
   * Deletes a user account.
   * @param account - The credentials for the account to delete.
   */
  deleteAccount(
    account: AutomationAccountCredentials,
  ): Promise<AccountGatewayResponse>;
}
