import type { APIRequestContext } from '@playwright/test';

import { AutomationExerciseAccountGateway } from '../clients/automation-exercise-account-gateway';
import { AutomationExerciseProductGateway } from '../clients/automation-exercise-product-gateway';
import type { AutomationAccountGateway } from '../contracts/automation-account-gateway';
import type { ProductCatalogGateway } from '../contracts/product-catalog-gateway';

export class GatewayFactory {
  static createAutomationAccountGateway(
    request: APIRequestContext,
  ): AutomationAccountGateway {
    return new AutomationExerciseAccountGateway(request);
  }

  static createProductCatalogGateway(
    request: APIRequestContext,
  ): ProductCatalogGateway {
    return new AutomationExerciseProductGateway(request);
  }
}
