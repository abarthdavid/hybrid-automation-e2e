import { expect, test as base } from '@playwright/test';

import { AutomationAccountBuilder } from '../builders/automation-account-builder';
import type { ProductCatalogGateway } from '../contracts/product-catalog-gateway';
import { GatewayFactory } from '../factories/gateway-factory';
import type {
  AutomationAccount,
  AutomationAccountCredentials,
  AutomationAccountOverrides,
} from '../models/automation-account';
import { CartPage } from '../pages/cart-page';
import { SignupPage } from '../pages/signup-page';

type AutomationAccountManager = {
  trackForCleanup: (account: AutomationAccountCredentials) => void;
  verifyLogin: (account: AutomationAccountCredentials) => Promise<void>;
  createViaApi: (
    overrides?: AutomationAccountOverrides,
  ) => Promise<AutomationAccount>;
};

type AutomationFixtures = {
  accountBuilder: AutomationAccountBuilder;
  automationAccount: AutomationAccountManager;
  cartPage: CartPage;
  productCatalog: ProductCatalogGateway;
  signupPage: SignupPage;
};

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
      createViaApi: async (overrides = {}) => {
        const account = new AutomationAccountBuilder().with(overrides).build();

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
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

test.beforeEach(async ({ page }) => {
  const consentButton = page.getByRole('button', { name: 'Consent' });

  await page.addLocatorHandler(consentButton, async () => {
    await consentButton.click();
  });
});

export { expect };
