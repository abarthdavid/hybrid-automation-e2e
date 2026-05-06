import { expect, test as base } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { AutomationAccountBuilder } from '../builders/automation-account-builder';
import type {
  AccountGatewayResponse,
  ApiMessageResponse,
} from '../contracts/automation-account-gateway';
import type { ProductCatalogGateway } from '../contracts/product-catalog-gateway';
import { GatewayFactory } from '../factories/gateway-factory';
import type {
  AutomationAccount,
  AutomationAccountCredentials,
} from '../models/automation-account';
import { CartPage } from '../pages/cart-page';
import { acceptConsentIfPresent } from '../pages/consent-helper';
import { SignupPage } from '../pages/signup-page';
import { MainPage } from '../pages/main-page';
import { RegistrationPage } from '../pages/registration-page';

type CleanupFailure = {
  email: string;
  reason: string;
};

const isCleanupStrictMode = (): boolean => {
  if (!process.env.CI) {
    return false;
  }

  return ['1', 'true', 'yes', 'on'].includes(
    process.env.CLEANUP_STRICT_MODE?.toLowerCase() ?? '',
  );
};

const toCleanupFailureReason = (error: unknown): string => {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  }

  return String(error);
};

const buildCleanupSummary = (
  deletedAccountCount: number,
  cleanupFailures: CleanupFailure[],
): string => {
  const summaryLines = [
    `Cleanup attempted for ${deletedAccountCount + cleanupFailures.length} account(s).`,
    `Cleanup succeeded for ${deletedAccountCount} account(s).`,
    `Cleanup failed for ${cleanupFailures.length} account(s).`,
  ];

  if (cleanupFailures.length > 0) {
    summaryLines.push('', 'Deletion failures:');

    for (const failure of cleanupFailures) {
      summaryLines.push(`- ${failure.email}: ${failure.reason}`);
    }
  }

  return summaryLines.join('\n');
};

const publishCleanupSummaryToAllure = async (
  deletedAccountCount: number,
  cleanupFailures: CleanupFailure[],
  cleanupSummary: string,
): Promise<void> => {
  const cleanupStatus = cleanupFailures.length === 0 ? 'passed' : 'failed';

  await allure.parameter('account_cleanup_status', cleanupStatus);
  await allure.parameter(
    'account_cleanup_attempted',
    String(deletedAccountCount + cleanupFailures.length),
  );
  await allure.parameter(
    'account_cleanup_failures',
    String(cleanupFailures.length),
  );
  await allure.attachment('account-cleanup-summary', cleanupSummary, {
    contentType: 'text/plain',
  });
};

/**
 * Manager interface for account-related operations in tests.
 * Provides methods to create accounts, track cleanup, and verify login credentials.
 */
type AutomationAccountManager = {
  /**
   * Tracks an account for cleanup after the test.
   * @param account - The account credentials to mark for deletion.
   */
  trackForCleanup: (account: AutomationAccountCredentials) => void;
  /**
   * Verifies that login credentials are valid via API.
   * @param account - The credentials to verify.
   */
  verifyLogin: (account: AutomationAccountCredentials) => Promise<void>;
  /**
   * Creates an account via the API with default values.
   * @returns The created account.
   */
  createViaApi: () => Promise<AutomationAccount>;
};

const expectSuccessfulMessageResponse = (
  result: AccountGatewayResponse,
  expectedBody: ApiMessageResponse,
): void => {
  if (result.status !== 200 || !result.ok) {
    throw new Error(
      `Unexpected API transport response: ${JSON.stringify(result)}`,
    );
  }

  if (
    result.body.responseCode !== expectedBody.responseCode ||
    result.body.message !== expectedBody.message
  ) {
    throw new Error(
      `Unexpected API message response. Expected ${JSON.stringify(expectedBody)}, got ${JSON.stringify(result.body)}`,
    );
  }
};

/**
 * Custom fixtures available to all Automation Exercise tests.
 * Provides builders, page objects, and API gateways for test execution.
 */
type AutomationFixtures = {
  /** Builder for creating automation account instances. */
  accountBuilder: AutomationAccountBuilder;
  /** Manager for account creation and cleanup. */
  automationAccount: AutomationAccountManager;
  /** Page object for the shopping cart page. */
  cartPage: CartPage;
  /** Page object for the main/home page. */
  mainPage: MainPage;
  /** API gateway for product catalog operations. */
  productCatalog: ProductCatalogGateway;
  /** Page object for the registration page. */
  registrationPage: RegistrationPage;
  /** Page object for the signup/login page. */
  signupPage: SignupPage;
};

/**
 * Extended test instance with custom fixtures for automation testing.
 * Use this instead of the base test to access all custom fixtures.
 */
export const test = base.extend<AutomationFixtures>({
  accountBuilder: async ({}, use) => {
    await use(new AutomationAccountBuilder());
  },
  automationAccount: async ({ request, accountBuilder }, use, testInfo) => {
    const accountsToDelete: AutomationAccountCredentials[] = [];
    const cleanupFailures: CleanupFailure[] = [];
    let deletedAccountCount = 0;
    const accountGateway =
      GatewayFactory.createAutomationAccountGateway(request);

    await use({
      trackForCleanup: (account) => {
        accountsToDelete.push(account);
      },
      createViaApi: async () => {
        const account = accountBuilder.build();
        const result = await accountGateway.createAccount(account);

        expectSuccessfulMessageResponse(result, {
          responseCode: 201,
          message: 'User created!',
        });
        accountsToDelete.push(account);

        return account;
      },
      verifyLogin: async (account) => {
        const result = await accountGateway.verifyLogin(account);

        expectSuccessfulMessageResponse(result, {
          responseCode: 200,
          message: 'User exists!',
        });
      },
    });

    for (const account of accountsToDelete.reverse()) {
      try {
        const result = await accountGateway.deleteAccount(account);

        expectSuccessfulMessageResponse(result, {
          responseCode: 200,
          message: 'Account deleted!',
        });
        deletedAccountCount += 1;
      } catch (error) {
        cleanupFailures.push({
          email: account.email,
          reason: toCleanupFailureReason(error),
        });
        console.error(`Failed to delete account ${account.email}:`, error);
      }
    }

    const cleanupSummary = buildCleanupSummary(
      deletedAccountCount,
      cleanupFailures,
    );

    await publishCleanupSummaryToAllure(
      deletedAccountCount,
      cleanupFailures,
      cleanupSummary,
    );

    await testInfo.attach('account-cleanup-summary', {
      body: cleanupSummary,
      contentType: 'text/plain',
    });

    if (cleanupFailures.length === 0) {
      return;
    }

    console.warn(cleanupSummary);

    if (isCleanupStrictMode()) {
      throw new Error(cleanupSummary);
    }
  },
  productCatalog: async ({ page }, use) => {
    await use(GatewayFactory.createProductCatalogGateway(page.request));
  },
  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  mainPage: async ({ page }, use) => {
    await use(new MainPage(page));
  },
});

test.beforeEach(({ page }) => {
  page.on('domcontentloaded', () => {
    void acceptConsentIfPresent(page);
  });
});

export { expect };
