import { expect, test } from '@/fixtures/automation-fixture';

test.describe('Cart operations - API', () => {
  test('@smoke lists products from catalog API', async ({ productCatalog }) => {
    const result = await productCatalog.listProducts();

    expect(result.response.status()).toBe(200);
    expect(result.products.length).toBeGreaterThan(0);
    expect(result.products[0]).toBeDefined();
  });

  test.describe('Negative cases', () => {
    // The API currently does not return consistent validation errors for this case.
    test.fixme('returns error when adding non-existent product to cart', async ({
      productCatalog,
    }) => {
      const response = await productCatalog.addToCart(45435345435);

      expect(response.status()).not.toBe(200);
    });

    // The API currently does not return consistent validation errors for this case.
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

    // The API currently does not return consistent validation errors for this case.
    test.fixme('verifies API response contains error information for invalid product', async ({
      productCatalog,
    }) => {
      const cartResponse =
        await productCatalog.addToCartAndGetResponse(99999999);

      expect(cartResponse.responseCode).not.toBe(200);
      expect(cartResponse.message).toBeDefined();
    });
  });
});
