import { expect, test as base } from '@playwright/test';

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
import { SignupPage } from '../pages/signup-page';
import { MainPage } from '../pages/main-page';
import { RegistrationPage } from '../pages/registration-page';

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
  automationAccount: async ({ request, accountBuilder }, use) => {
    const accountsToDelete: AutomationAccountCredentials[] = [];
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
      } catch (error) {
        console.error(`Failed to delete account ${account.email}:`, error);
      }
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

test.beforeEach(async ({ page }) => {
  const consentButton = page.getByRole('button', { name: 'Consent' });

  await page.addLocatorHandler(consentButton, async () => {
    await consentButton.click();
  });
});

export { expect };
