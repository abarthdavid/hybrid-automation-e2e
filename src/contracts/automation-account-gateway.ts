import type {
  AutomationAccount,
  AutomationAccountCredentials,
} from '../models/automation-account';

export interface AutomationAccountGateway {
  createAccount(account: AutomationAccount): Promise<void>;
  verifyLogin(account: AutomationAccountCredentials): Promise<void>;
  deleteAccount(account: AutomationAccountCredentials): Promise<void>;
}
