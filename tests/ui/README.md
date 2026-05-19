# UI Layer Tests

This folder contains tests that verify user interface functionality and interactions.

## Structure

- `*.spec.ts` - UI test files
- `helpers/` - optional UI-specific helper code (only if actively used)

## Running UI Tests

```bash
npm run test:ui
```

## Guidelines

- Tests in this layer focus on UI interactions and visual workflows
- Use page objects (SignupPage, MainPage, CartPage, etc.) for UI operations
- API calls are allowed but only to support UI testing (e.g., test data setup)
- When a test involves UI actions, it belongs in this layer
- Tests should simulate real user behavior and interactions
