import { test } from '../../src/fixtures/automation-fixture';

test('@smoke registers a new user and verifies the account through the API', async ({
  accountBuilder,
  automationAccount,
  signupPage,
  registrationPage,
}) => {
  const account = accountBuilder.build();

  await signupPage.goto();
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

  await signupPage.goto();
  await signupPage.startSignup(existingAccount.name, existingAccount.email);

  await automationAccount.verifyLogin(existingAccount);
  await registrationPage.expectExistingEmailError();
});

test(' user should be able to logout via UI', async ({
  mainPage,
  automationAccount,
  signupPage,
}) => {
  const newAccount = await automationAccount.createViaApi();

  await signupPage.goto();
  await signupPage.startLogin(newAccount.email, newAccount.password);

  await mainPage.expectHeaderMiddleVisible();
  await mainPage.expectLogoutVisible();

  await mainPage.clickLogout();

  await mainPage.expectHeaderMiddleVisible();
  await mainPage.expectLoginVisible();
});
