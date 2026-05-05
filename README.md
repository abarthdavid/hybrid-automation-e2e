# hybrid-automation-e2e

Playwright end-to-end automation framework aligned to these shared standards:

- TypeScript in strict mode
- Playwright with fixtures and locator-first page objects
- POM, Factory, Builder, and dependency inversion patterns
- ESLint, Prettier, Husky, GitHub Actions, and Allure reporting

## Project structure

```text
src/
  builders/      Test data builders
  clients/       Concrete API gateway implementations
  contracts/     Dependency inversion interfaces
  factories/     Composition helpers for test dependencies
  fixtures/      Shared Playwright fixtures
  models/        Domain types
  pages/         Page objects based on locators
tests/
  e2e/           Playwright specs
```

## Commands

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
npm run test:smoke
npm run report:html
npm run report:allure
npm run report:allure:generate
```

## Architecture rules

- Specs only orchestrate fixture-injected services and pages.
- API setup flows live behind gateway contracts and clients.
- Generated test data comes from builders or factories, not inline literals in specs.

## Reporting

- HTML report output: `playwright-report/`
- Allure raw results: `allure-results/`
- Generated Allure site: `allure-report/`
- Test commands clear stale `allure-results/` content before execution so the Allure report reflects only the current run.
- `npm run report:allure` regenerates the report and opens it via the Allure local web server.
- `npm run report:allure:generate` only regenerates static report files if you need artifacts without opening them.
- Account teardown publishes cleanup status and failure counts as Allure parameters and attaches an `account-cleanup-summary` artifact per test.
- Set `CLEANUP_STRICT_MODE=true` in CI to fail a test when tracked account deletion leaves residue.
- Failed CI runs retain Playwright traces inside uploaded `test-results` artifacts.

## Git hooks

Husky installs a `pre-commit` hook that runs ESLint, Prettier checks, strict type-checking, and the smoke suite.
