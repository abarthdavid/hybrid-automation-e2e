import { expect, test as base } from '@playwright/test';

type AutomationAccountCredentials = {
  email: string;
  password: string;
};

type AutomationAccount = AutomationAccountCredentials & {
  name: string;
  title: 'Mr' | 'Mrs' | 'Miss';
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
};

type AutomationAccountOverrides = Partial<AutomationAccount>;

type AutomationFixtures = {
  automationAccount: {
    trackForCleanup: (account: AutomationAccountCredentials) => void;
    verifyLogin: (account: AutomationAccountCredentials) => Promise<void>;
    createViaApi: (overrides?: AutomationAccountOverrides) => Promise<AutomationAccount>;
  };
};

export const test = base.extend<AutomationFixtures>({
  automationAccount: async ({ request }, use) => {
    const accountsToDelete: AutomationAccountCredentials[] = [];

    const buildAccount = (overrides: AutomationAccountOverrides = {}): AutomationAccount => {
      const uniqueId = Date.now().toString();

      return {
        name: 'Playwright Test User',
        email: `pw-${uniqueId}@example.com`,
        password: 'Pass123!',
        title: 'Mr',
        birth_date: '17',
        birth_month: '2',
        birth_year: '2005',
        firstname: 'Playwright',
        lastname: 'User',
        company: 'QA',
        address1: 'Street 1',
        address2: 'Suite 2',
        country: 'India',
        zipcode: '12345',
        state: 'State',
        city: 'City',
        mobile_number: '1234567890',
        ...overrides,
      };
    };

    await use({
      trackForCleanup: (account) => {
        accountsToDelete.push(account);
      },
      createViaApi: async (overrides = {}) => {
        const account = buildAccount(overrides);
        const createAccountResponse = await request.post('https://automationexercise.com/api/createAccount', {
          form: account,
        });
        const createAccountBody = await createAccountResponse.json();

        expect(createAccountResponse.status()).toBe(200);
        await expect(createAccountResponse).toBeOK();
        expect(createAccountBody).toEqual({
          responseCode: 201,
          message: 'User created!',
        });

        accountsToDelete.push(account);
        return account;
      },
      verifyLogin: async ({ email, password }) => {
        const verifyLoginResponse = await request.post('https://automationexercise.com/api/verifyLogin', {
          form: {
            email,
            password,
          },
        });
        const verifyLoginBody = await verifyLoginResponse.json();

        expect(verifyLoginResponse.status()).toBe(200);
        await expect(verifyLoginResponse).toBeOK();
        expect(verifyLoginBody).toEqual({
          responseCode: 200,
          message: 'User exists!',
        });
      },
    });

    for (const account of accountsToDelete.reverse()) {
      const deleteAccountResponse = await request.delete('https://automationexercise.com/api/deleteAccount', {
        form: {
          email: account.email,
          password: account.password,
        },
      });
      const deleteAccountBody = await deleteAccountResponse.json();

      expect(deleteAccountResponse.status()).toBe(200);
      await expect(deleteAccountResponse).toBeOK();
      expect(deleteAccountBody).toEqual({
        responseCode: 200,
        message: 'Account deleted!',
      });
    }
  },
});

test.beforeEach(async ({ page }) => {
  await page.addLocatorHandler(
    page.getByRole('button', { name: 'Consent' }),
    async () => {
      await page.getByRole('button', { name: 'Consent' }).click();
    }
  );
});

export { expect };