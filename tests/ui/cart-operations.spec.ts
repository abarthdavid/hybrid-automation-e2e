import { expect, test } from '@/fixtures/automation-fixture';

test.describe('Cart operations - UI', () => {
  test('adds a product from the API catalog to the cart', async ({
    cartPage,
    productCatalog,
  }) => {
    const result = await productCatalog.listProducts();

    expect(result.response.status()).toBe(200);

    expect(result.products.length).toBeGreaterThan(0);

    const selectedProduct = result.products[0];

    expect(selectedProduct).toBeDefined();

    await productCatalog.addToCart(selectedProduct.id);

    await cartPage.goto();
    await cartPage.expectProductInCart(
      selectedProduct.id,
      selectedProduct.name,
    );
  });

  test('completes purchase flow and verifies checkout items match added cart items', async ({
    automationAccount,
    cartPage,
    mainPage,
    signupPage,
  }) => {
    const productIndices = [0, 1, 2];

    const createdAccount = await automationAccount.createViaApi();

    await signupPage.goto();
    await signupPage.startLogin(createdAccount.email, createdAccount.password);
    await mainPage.expectLogoutVisible();

    const selectedProductDescriptions: string[] = [];

    for (const productIndex of productIndices) {
      await mainPage.expectProductVisible(productIndex);

      const productDescription =
        await mainPage.getProductDescription(productIndex);
      selectedProductDescriptions.push(productDescription);

      await mainPage.addProductToCart(productIndex);

      if (productIndex < productIndices.length - 1) {
        await mainPage.continueShopping();
      }
    }

    await mainPage.openCartFromAddToCartModal();
    await cartPage.proceedToCheckout();

    await test.step('Validate checkout summary', async () => {
      await cartPage.expectCheckoutSummaryContainsDescriptions(
        selectedProductDescriptions,
      );
    });
  });
});
