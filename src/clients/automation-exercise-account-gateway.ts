import type { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';

import type { AutomationAccountGateway } from '../contracts/automation-account-gateway';
import type {
  AutomationAccount,
  AutomationAccountCredentials,
} from '../models/automation-account';

type ApiMessageResponse = {
  responseCode: number;
  message: string;
};

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

  /**
   * Creates a new user account via the API.
   * @param account - The account details to create.
   * @throws Error if the API response indicates failure.
   */
  async createAccount(account: AutomationAccount): Promise<void> {
    const response = await this.request.post('/api/createAccount', {
      form: account,
    });
    const body = (await response.json()) as ApiMessageResponse;

    expect(response.status()).toBe(200);
    await expect(response).toBeOK();
    expect(body).toEqual({
      responseCode: 201,
      message: 'User created!',
    });
  }

  /**
   * Verifies that a user account exists and credentials are correct.
   * @param account - The account credentials to verify.
   * @throws Error if the API response indicates failure or user doesn't exist.
   */
  async verifyLogin(account: AutomationAccountCredentials): Promise<void> {
    const response = await this.request.post('/api/verifyLogin', {
      form: account,
    });
    const body = (await response.json()) as ApiMessageResponse;

    expect(response.status()).toBe(200);
    await expect(response).toBeOK();
    expect(body).toEqual({
      responseCode: 200,
      message: 'User exists!',
    });
  }

  /**
   * Deletes a user account via the API.
   * @param account - The account credentials for the account to delete.
   * @throws Error if the API response indicates failure.
   */
  async deleteAccount(account: AutomationAccountCredentials): Promise<void> {
    const response = await this.request.delete('/api/deleteAccount', {
      form: account,
    });
    const body = (await response.json()) as ApiMessageResponse;

    expect(response.status()).toBe(200);
    await expect(response).toBeOK();
    expect(body).toEqual({
      responseCode: 200,
      message: 'Account deleted!',
    });
  }
}
