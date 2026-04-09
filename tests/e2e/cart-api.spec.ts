import { expect, test } from '@/fixtures/automation-fixture';

test('adds a random product from the API catalog to the cart', async ({
  cartPage,
  productCatalog,
}) => {
  const products = await productCatalog.listProducts();

  expect(products.length).toBeGreaterThan(0);

  const randomIndex = Math.floor(Math.random() * products.length);
  const randomProduct = products[randomIndex];

  expect(randomProduct).toBeDefined();

  if (!randomProduct) {
    throw new Error('Expected at least one product from the catalog API.');
  }

  await productCatalog.addToCart(randomProduct.id);

  await cartPage.goto();
  await cartPage.expectProductInCart(randomProduct.id, randomProduct.name);
});
