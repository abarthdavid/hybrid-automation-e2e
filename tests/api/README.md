# API Layer Tests

This folder contains tests that verify API functionality without UI interactions.

## Structure

- `*.spec.ts` - API test files
- `helpers/` - optional API-specific helper code (only if actively used)

## Running API Tests

```bash
npm run test:api
```

## Guidelines

- Tests in this layer focus on API endpoints and data contracts
- Use `page.context().request` for API calls
- Avoid UI page objects; use gateways/clients for API interactions
- Each test should be independent and not rely on UI state
