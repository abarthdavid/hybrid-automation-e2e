import { expect, test } from '@/fixtures/automation-fixture';

test.describe('Cart operations', () => {
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
    await cartPage.expectProductInCart(
      selectedProduct.id,
      selectedProduct.name,
    );
  });

  test.describe('Negative cases', () => {
    //Please note that the API does not reply as expected, so this test is marked as fixme until such validation is implemented.
    test.fixme('returns error when adding non-existent product to cart', async ({
      productCatalog,
    }) => {
      const response = await productCatalog.addToCart(45435345435);

      expect(response.status()).not.toBe(200);
    });
    //Please note that the API does not reply as expected, so this test is marked as fixme until such validation is implemented.
    test.fixme('handles invalid product ID format gracefully', async ({
      productCatalog,
    }) => {
      const response = await productCatalog.addToCart(0);

      expect(response.ok()).toBeFalsy();
    });

    test('returns error when adding negative product ID', async ({
      productCatalog,
    }) => {
      const response = await productCatalog.addToCart(-1);

      expect(response.status()).not.toBe(200);
    });
    //Please note that the API does not reply as expected, so this test is marked as fixme until such validation is implemented.
    test.fixme('verifies API response contains error information for invalid product', async ({
      productCatalog,
    }) => {
      const cartResponse =
        await productCatalog.addToCartAndGetResponse(99999999);

      expect(cartResponse.responseCode).not.toBe(200);
      expect(cartResponse.message).toBeDefined();
    });
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
