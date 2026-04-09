import type { APIRequestContext } from '@playwright/test';

import { AutomationExerciseAccountGateway } from '../clients/automation-exercise-account-gateway';
import { AutomationExerciseProductGateway } from '../clients/automation-exercise-product-gateway';
import type { AutomationAccountGateway } from '../contracts/automation-account-gateway';
import type { ProductCatalogGateway } from '../contracts/product-catalog-gateway';

/**
 * Factory for creating API gateway instances.
 * Centralizes the instantiation of gateway implementations.
 */
export class GatewayFactory {
  /**
   * Creates an instance of the automation account gateway.
   * @param request - The Playwright APIRequestContext for API calls.
   * @returns An AutomationAccountGateway instance.
   */
  static createAutomationAccountGateway(
    request: APIRequestContext,
  ): AutomationAccountGateway {
    return new AutomationExerciseAccountGateway(request);
  }

  /**
   * Creates an instance of the product catalog gateway.
   * @param request - The Playwright APIRequestContext for API calls.
   * @returns A ProductCatalogGateway instance.
   */
  static createProductCatalogGateway(
    request: APIRequestContext,
  ): ProductCatalogGateway {
    return new AutomationExerciseProductGateway(request);
  }
}
