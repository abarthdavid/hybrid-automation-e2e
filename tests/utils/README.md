# Shared Testing Utilities

This folder contains shared helpers and utilities used across both API and UI test layers.

## Structure

- `helpers/` - optional shared helper functions
- `fixtures/` - optional shared Playwright fixtures
- `constants/` - optional shared test constants and configurations

## Contents

Shared utilities should include:

- Common test data builders
- Shared fixture configurations
- Common assertion helpers
- Environment and configuration utilities
- Shared cleanup and setup logic

## Usage

Import shared utilities in both API and UI tests:

```typescript
import { someHelper } from '../../utils/helpers/some-helper';
```
