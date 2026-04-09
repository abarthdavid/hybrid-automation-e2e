/**
 * Represents a product in the catalog.
 */
export type Product = {
  /** The unique identifier for the product. */
  id: number;
  /** The name of the product. */
  name: string;
  /** The price of the product as a string. */
  price: string;
};

/**
 * API response containing a list of products from the catalog.
 */
export type ProductListResponse = {
  /** The HTTP response code from the API. */
  responseCode: number;
  /** The array of products in the response. */
  products: Product[];
};
