# PROMPTS

## Architectural log

### 1. Hybrid test strategy

- Goal: use API calls to establish state quickly, then use UI assertions to validate end-user behavior.
- Outcome: the cart flow uses the product API gateway to add an item to the cart and the cart page object to verify it in the browser.
- Manual rationale: this was implemented directly in fixtures and service layers instead of relying on an AI-only planner.

### 2. Strict layering refactor

- Goal: remove direct page construction from specs and keep `.spec.ts` files as orchestration only.
- Copilot/manual approach: page objects were moved behind fixture injection and API interactions remained behind gateway interfaces.
- Outcome: specs now consume fixture-provided pages and services only.

### 5. Layer split finalization

- Goal: finish the migration from a mixed legacy structure to clear API and UI test layers.
- Outcome:
  - API-only cases moved to `tests/api/`
  - UI interaction flows remain in `tests/ui/`
- Rule applied: if a test performs UI action, it belongs to the UI layer.

### 3. Broken selector handling strategy

- Repository status: no dedicated Playwright Healer Agent package or MCP server is configured in this repository.
- Manual alternative used:
  - prefer `getByRole`, placeholder, and stable ids before CSS selectors
  - use Playwright error snapshots and traces to inspect broken selectors after UI changes
  - centralize locator updates inside page objects so selector repairs happen in one layer
- MCP evidence alternative: when MCP-based exploration is not wired into the repo, the page object locators document the manually selected stable locator strategy.

### 4. Refactoring guidance

- DRY/SOLID focus:
  - builder for account test data
  - contract and client split for API dependencies
  - factory-based composition for fixture wiring
- Copilot/manual approach: refactoring decisions were captured in code structure rather than inline comments.
