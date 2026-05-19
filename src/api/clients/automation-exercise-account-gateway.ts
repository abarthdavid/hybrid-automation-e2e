import type { APIRequestContext } from '@playwright/test';

import type {
  AccountGatewayResponse,
  ApiMessageResponse,
  AutomationAccountGateway,
} from '../contracts/automation-account-gateway';
import type {
  AutomationAccount,
  AutomationAccountCredentials,
} from '../models/automation-account';

const ACCOUNT_API_PATHS = {
  createAccount: '/api/createAccount',
  verifyLogin: '/api/verifyLogin',
  deleteAccount: '/api/deleteAccount',
} as const;

type RequestMethod = 'POST' | 'DELETE';

/**
 * API client implementation for managing Automation Exercise accounts.
 * Provides methods to create, verify, and delete user accounts via REST API.
 */
export class AutomationExerciseAccountGateway implements AutomationAccountGateway {
  /**
   * Initializes the account gateway with an API request context.
   * @param request - The Playwright APIRequestContext used to make API calls.
   */
  constructor(private readonly request: APIRequestContext) {}

  private async requestMessageResponse(
    path: string,
    method: RequestMethod,
    form: AutomationAccount | AutomationAccountCredentials,
  ): Promise<AccountGatewayResponse> {
    const response = await this.request.fetch(path, {
      method,
      form,
    });
    const body = (await response.json()) as ApiMessageResponse;

    return {
      status: response.status(),
      ok: response.ok(),
      body,
    };
  }

  /**
   * Creates a new user account via the API.
   * @param account - The account details to create.
   * @throws Error if the API response indicates failure.
   */
  async createAccount(
    account: AutomationAccount,
  ): Promise<AccountGatewayResponse> {
    return this.requestMessageResponse(
      ACCOUNT_API_PATHS.createAccount,
      'POST',
      account,
    );
  }

  /**
   * Verifies that a user account exists and credentials are correct.
   * @param account - The account credentials to verify.
   * @throws Error if the API response indicates failure or user doesn't exist.
   */
  async verifyLogin(
    account: AutomationAccountCredentials,
  ): Promise<AccountGatewayResponse> {
    return this.requestMessageResponse(
      ACCOUNT_API_PATHS.verifyLogin,
      'POST',
      account,
    );
  }

  /**
   * Deletes a user account via the API.
   * @param account - The account credentials for the account to delete.
   * @throws Error if the API response indicates failure.
   */
  async deleteAccount(
    account: AutomationAccountCredentials,
  ): Promise<AccountGatewayResponse> {
    return this.requestMessageResponse(
      ACCOUNT_API_PATHS.deleteAccount,
      'DELETE',
      account,
    );
  }
}
