import type { Page } from '@playwright/test';

/**
 * Accepts cookie/data consent only when the dialog is present and visible.
 */
export const acceptConsentIfPresent = async (page: Page): Promise<void> => {
  const consentButton = page
    .locator('.fc-consent-root button:has-text("Consent")')
    .first();

  const isVisible = await consentButton.isVisible().catch(() => false);

  if (!isVisible) {
    return;
  }

  await consentButton.click({ timeout: 5000 });
};
