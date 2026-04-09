import { expect, test as base } from '@playwright/test';

import { AutomationAccountBuilder } from '../builders/automation-account-builder';
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
  automationAccount: async ({ request }, use) => {
    const accountsToDelete: AutomationAccountCredentials[] = [];
    const accountGateway =
      GatewayFactory.createAutomationAccountGateway(request);

    await use({
      trackForCleanup: (account) => {
        accountsToDelete.push(account);
      },
      createViaApi: async () => {
        const account = new AutomationAccountBuilder().build();

        await accountGateway.createAccount(account);
        accountsToDelete.push(account);

        return account;
      },
      verifyLogin: async (account) => {
        await accountGateway.verifyLogin(account);
      },
    });

    for (const account of accountsToDelete.reverse()) {
      await accountGateway.deleteAccount(account);
    }
  },
  productCatalog: async ({ page }, use) => {
    await use(
      GatewayFactory.createProductCatalogGateway(page.context().request),
    );
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
