# Test Layer Organization Guide

This document describes the reorganized test structure separating API and UI concerns.

## Directory Structure

```
tests/
├── api/                           # Pure API tests (backend/contract testing)
│   ├── helpers/                   # optional API-specific helpers
│   └── *.spec.ts                  # API test files
│
├── ui/                            # UI tests (user interface interactions)
│   ├── helpers/                   # optional UI-specific helpers
│   └── *.spec.ts                  # UI test files
│
└── utils/                         # Shared test utilities
    ├── helpers/                   # optional shared helper functions
    └── README.md
```

## Migration Notes

- Legacy `tests/e2e/` has been removed.
- Former mixed tests were split by behavior:
  - UI interactions -> `tests/ui/`
  - API-only actions -> `tests/api/`
- Rule: when UI action happens, the test belongs to the UI layer.

## Layer Definitions

### API Layer (`tests/api/`)

**Purpose:** Test API endpoints and data contracts without user interface.

**Characteristics:**

- No page objects or UI interactions
- Focus on status codes, response bodies, and data validation
- Use `page.context().request` for HTTP calls
- Independent test execution
- Fast execution
- Tests endpoints in isolation

**Example:**

```typescript
test('returns products list', async ({ productCatalog }) => {
  const products = await productCatalog.listProducts();
  expect(products.length).toBeGreaterThan(0);
});
```

**Run with:**

```bash
npm run test:api
```

### UI Layer (`tests/ui/`)

**Purpose:** Test user interface workflows and interactions.

**Characteristics:**

- Uses page objects (SignupPage, MainPage, CartPage, etc.)
- Tests user interactions and visual workflows
- May call APIs to set up test data
- Simulates real user behavior
- Tests features end-to-end from the user's perspective

**Example:**

```typescript
test('user can register and login', async ({
  signupPage,
  mainPage,
  accountBuilder,
}) => {
  const account = accountBuilder.build();

  await signupPage.goto();
  await signupPage.startSignup(account.name, account.email);
  await mainPage.expectLogoutVisible();
});
```

**Run with:**

```bash
npm run test:ui
```

### Shared Utilities (`tests/utils/`)

**Purpose:** Provide common helpers used across both test layers.

**Contents:**

- Data builders (AccountBuilder, etc.)
- Common assertion helpers
- Test constants and configurations
- Retry and delay utilities
- Data generation helpers

**Import from either layer:** create shared helpers only when they have active usage.

## Test Selection Guide

### Use API Layer When:

- Testing API endpoints directly
- Verifying data contracts
- Testing error responses
- Validating API authentication/authorization
- Testing business logic at API level
- No UI interaction is needed

### Use UI Layer When:

- Testing user workflows
- Verifying page layout and interactions
- Testing form validation
- Testing navigation flows
- Testing accessibility features
- A UI action is involved in the test

**Rule of Thumb:** _Where a UI action happens, the test belongs in the UI layer._

## Running Tests

```bash
# Run all tests (both API and UI)
npm run test

# Run only API tests
npm run test:api

# Run only UI tests
npm run test:ui

# Run UI tests with browser visible
npm run test:ui-headed

# Run tests in debug mode
npm run test:debug

# Run tests with @smoke tag
npm run test:smoke
```

## Shared Fixtures

The common fixtures defined in `src/fixtures/automation-fixture.ts` are available to both layers:

- `accountBuilder` - Create test account data
- `automationAccount` - Manage account lifecycle (create, cleanup, verify)
- `productCatalog` - Product API gateway
- `cartPage` - Shopping cart page object
- `mainPage` - Main page object
- `signupPage` - Signup/login page object
- `registrationPage` - Registration page object

Both layers import from the same fixture file to maintain consistency.

## Adding New Tests

### For API Tests:

1. Create file in `tests/api/` matching pattern `*.spec.ts`
2. Import `test` from `src/fixtures/automation-fixture`
3. Focus on API endpoints and data validation
4. Add to appropriate describe block

### For UI Tests:

1. Create file in `tests/ui/` matching pattern `*.spec.ts`
2. Import `test` from `src/fixtures/automation-fixture`
3. Use page objects for interactions
4. Add to appropriate describe block

### For Shared Utilities:

1. Add helpers to `tests/utils/helpers/` only when there is active usage
2. Export for import in both layers
3. Document usage with JSDoc comments

## Configuration

Playwright configuration (`playwright.config.ts`) defines two projects:

- **api** - Runs tests from `tests/api/` directory
- **ui** - Runs tests from `tests/ui/` directory with viewport settings

Each project can have different configurations if needed (e.g., different timeout, retry settings).

## Benefits of This Structure

✅ **Clear Separation of Concerns** - API vs UI tests are clearly distinguished
✅ **Faster Feedback** - Run specific layers independently
✅ **Better Organization** - Easier to find and maintain tests
✅ **Improved Clarity** - Intent is obvious from test location
✅ **Layer-Specific Helpers** - Each layer can have optimized utilities
✅ **Scalability** - Easy to add new test files and layers
✅ **CI/CD Optimization** - Can run layers in parallel or separately
