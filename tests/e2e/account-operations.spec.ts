import { test } from '../../src/fixtures/automation-fixture';
import type { AutomationAccount } from '../../src/models/automation-account';

test.describe('Account operations', () => {
  test.beforeEach(async ({ signupPage }) => {
    await signupPage.goto();
  });

  test.describe('Registration', () => {
    test('@smoke registers a new user and verifies the account through the API', async ({
      accountBuilder,
      automationAccount,
      signupPage,
      registrationPage,
    }) => {
      const account = accountBuilder
        .withOverrides({ name: 'Playwright Override User' })
        .build({ city: 'Budapest' });

      await signupPage.startSignup(account.name, account.email);
      await registrationPage.completeRegistration(account);
      await registrationPage.expectAccountCreated();

      automationAccount.trackForCleanup(account);
      await automationAccount.verifyLogin(account);
    });

    test('shows an error when registering with an existing email', async ({
      automationAccount,
      signupPage,
      registrationPage,
    }) => {
      const existingAccount = await automationAccount.createViaApi();

      await signupPage.startSignup(existingAccount.name, existingAccount.email);

      await automationAccount.verifyLogin(existingAccount);
      await registrationPage.expectExistingEmailError();
    });
  });

  test.describe('Authentication', () => {
    let createdAccount: AutomationAccount;

    test.beforeEach(async ({ automationAccount }) => {
      createdAccount = await automationAccount.createViaApi();
    });

    test('user should be able to logout via UI', async ({
      mainPage,
      signupPage,
    }) => {
      await signupPage.startLogin(
        createdAccount.email,
        createdAccount.password,
      );

      await mainPage.expectHeaderMiddleVisible();
      await mainPage.expectLogoutVisible();

      await mainPage.clickLogout();

      await mainPage.expectHeaderMiddleVisible();
      await mainPage.expectLoginVisible();
    });

    test('user should not be able to login with incorrect e-mail', async ({
      signupPage,
    }) => {
      const invalidEmail = 'testtest.com';

      await signupPage.goto();
      await signupPage.startLogin(invalidEmail, createdAccount.password);
      await signupPage.expectLoginErrorInvalidEmail(invalidEmail);
    });
  });
});
