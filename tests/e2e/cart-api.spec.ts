import { expect, test } from '@/fixtures/automation-fixture';

test('adds a product from the API catalog to the cart', async ({
  cartPage,
  productCatalog,
}) => {
  const products = await productCatalog.listProducts();

  expect(products.length).toBeGreaterThan(0);

  const selectedProduct = products[0];

  expect(selectedProduct).toBeDefined();

  await productCatalog.addToCart(selectedProduct.id);

  await cartPage.goto();
  await cartPage.expectProductInCart(selectedProduct.id, selectedProduct.name);
});
