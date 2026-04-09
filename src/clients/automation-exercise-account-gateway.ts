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

export class AutomationExerciseAccountGateway implements AutomationAccountGateway {
  constructor(private readonly request: APIRequestContext) {}

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
