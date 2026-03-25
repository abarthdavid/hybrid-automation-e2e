import { test, expect } from './fixtures/automation-fixture';

type ProductListResponse = {
  responseCode: number;
  products: Array<{
    id: number;
    name: string;
    price: string;
  }>;
};

test('register a new user and verify the existence', async ({ page, automationAccount }) => {
  const email = `pw-${Date.now()}@example.com`;
  const password = 'sdfdsfs';

  await page.goto('https://automationexercise.com/login');
  await page.getByRole('textbox', { name: 'Name' }).fill('fddsfsdf');
  await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
  await page.getByRole('button', { name: 'Signup' }).click();
  await page.getByRole('radio', { name: 'Mr.' }).check();
  await page.getByRole('textbox', { name: 'Password *' }).fill(password);
  await page.locator('#days').selectOption('17');
  await page.locator('#months').selectOption('2');
  await page.locator('#years').selectOption('2005');
  await page.getByRole('textbox', { name: 'First name *' }).fill('sdf');
  await page.getByRole('textbox', { name: 'Last name *' }).fill('sdfdsf');
  await page.getByRole('textbox', { name: 'State *' }).fill('sdfdsf');
  await page.getByRole('textbox', { name: 'City * Zipcode *' }).fill('sdfsdf');
  await page.locator('#zipcode').fill('sdfdsf');
  await page.getByRole('textbox', { name: 'Mobile Number *' }).fill('435435');
  await page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill('fdgfdg');
  await page.getByRole('button', { name: 'Create Account' }).click();

  await expect(page.getByRole('heading', { name: 'Account Created!' })).toBeVisible();

  automationAccount.trackForCleanup({ email, password });
  await automationAccount.verifyLogin({ email, password });
});

test('get random product via api and add it to cart', async ({ page, request }) => {
  const productsResponse = await request.get('https://automationexercise.com/api/productsList');
  const productsBody = (await productsResponse.json()) as ProductListResponse;

  expect(productsResponse.status()).toBe(200);
  await expect(productsResponse).toBeOK();
  expect(productsBody.responseCode).toBe(200);
  expect(productsBody.products.length).toBeGreaterThan(0);

  const randomProduct = productsBody.products[Math.floor(Math.random() * productsBody.products.length)];
  const randomProductId = randomProduct.id;

  const addToCartResponse = await page.context().request.get(`https://automationexercise.com/add_to_cart/${randomProductId}`);

  expect(addToCartResponse.status()).toBe(200);
  await expect(addToCartResponse).toBeOK();

  await page.goto('https://automationexercise.com/view_cart');

  await expect(page.locator(`#product-${randomProductId}`)).toBeVisible();
  await expect(page.locator(`#product-${randomProductId}`)).toContainText(randomProduct.name);
});