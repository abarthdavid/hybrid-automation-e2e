import { test } from '@/fixtures/automation-fixture';

test('@smoke registers a new user and verifies the account through the API', async ({
  accountBuilder,
  automationAccount,
  signupPage,
}) => {
  const account = accountBuilder.build();

  await signupPage.goto();
  await signupPage.startSignup(account.name, account.email);
  await signupPage.completeRegistration(account);
  await signupPage.expectAccountCreated();

  automationAccount.trackForCleanup(account);
  await automationAccount.verifyLogin(account);
});
