import { test } from '@playwright/test';
import { expectModuleVisible } from '../../utils/ahamTestHelpers';

test.describe('Test Cases module', () => {
  test('module is visible in the project shell', async ({ page }) => {
    await expectModuleVisible(page, 'Test Cases');
  });
});