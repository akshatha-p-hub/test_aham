import { test, expect } from '@playwright/test';
import { loginToProject } from '../../utils/ahamTestHelpers';
import { expectModuleVisible } from '../../utils/ahamTestHelpers';

async function openBugDetection(page: import('@playwright/test').Page): Promise<void> {
  await loginToProject(page);
  await page.getByRole('button', { name: 'Bug Detection', exact: true }).click();
  await expect(page).toHaveURL(/bugdetect/i);
  await expect(page.getByRole('heading', { name: 'Bug Detection' })).toBeVisible();
}

test.describe('Bug Detection module', () => {
  test('module is visible in the project shell', async ({ page }) => {
    await expectModuleVisible(page, 'Bug Detection');
  });
});

test.describe('Bug Detection end-to-end flows', () => {
  test('setup, repository selection, and run action are available', async ({ page }) => {
    await openBugDetection(page);

    const setupTab = page.getByRole('tab', { name: 'Setup' });
    const resultTab = page.getByRole('tab', { name: 'Result' });
    const historyTab = page.getByRole('tab', { name: 'History' });

    await expect(setupTab).toBeVisible();
    await expect(resultTab).toBeVisible();
    await expect(historyTab).toBeVisible();
    await expect(setupTab).toHaveAttribute('aria-selected', 'true');

    await expect(page.getByText('Target', { exact: true })).toBeVisible();
    await expect(page.getByText('Repository', { exact: true })).toBeVisible();
    await expect(page.getByRole('combobox')).toBeVisible();
    await expect(page.getByText(/pick one or up to 10 of the project's repos/i)).toBeVisible();
    await expect(page.getByText('Specific files to analyse', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Run Bug Detection' })).toBeVisible();
  });

  test('repository selector exposes repository choices and keeps project context', async ({ page }) => {
    await openBugDetection(page);

    const repositoryPicker = page.getByRole('combobox');
    await expect(repositoryPicker).toBeVisible();
    await repositoryPicker.click();

    const repositoryOptions = page.getByRole('option');
    await expect(repositoryOptions.first()).toBeVisible();
    await expect(page.locator('body')).toContainText(/AhamTest/i);

    await page.keyboard.press('Escape');
    await expect(page.getByRole('heading', { name: 'Bug Detection' })).toBeVisible();
    await expect(page.locator('body')).toContainText(/Repository/i);
  });

  test('optional file paths can be entered and cleared without starting a scan', async ({ page }) => {
    await openBugDetection(page);

    const filePathField = page.locator('textarea').first();
    await expect(filePathField).toBeVisible();

    await filePathField.fill('src/example.ts\nsrc/services/example-service.ts');
    await expect(filePathField).toHaveValue('src/example.ts\nsrc/services/example-service.ts');

    await filePathField.fill('');
    await expect(filePathField).toHaveValue('');
    await expect(page.getByRole('button', { name: 'Run Bug Detection' })).toBeVisible();
    await expect(page).toHaveURL(/bugdetect/i);
  });

  test('Result tab displays a useful empty state when no analysis has been run', async ({ page }) => {
    await openBugDetection(page);

    const resultTab = page.getByRole('tab', { name: 'Result' });
    await resultTab.click();

    await expect(resultTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByText(/No results yet/i)).toBeVisible();
    await expect(page.getByText(/Run bug detection from the Setup tab/i)).toBeVisible();

    const setupTab = page.getByRole('tab', { name: 'Setup' });
    await setupTab.click();
    await expect(setupTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('button', { name: 'Run Bug Detection' })).toBeVisible();
  });

  test('History tab handles the no-history state and returns to setup', async ({ page }) => {
    await openBugDetection(page);

    const historyTab = page.getByRole('tab', { name: 'History' });
    await historyTab.click();

    await expect(historyTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('body')).toContainText(/History|No runs|No history|No results/i);

    const setupTab = page.getByRole('tab', { name: 'Setup' });
    await setupTab.click();
    await expect(setupTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('button', { name: 'Run Bug Detection' })).toBeVisible();
  });

  test('dashboard Bug Detection KPI opens the selected project analysis screen', async ({ page }) => {
    await loginToProject(page);

    const findingKpi = page.getByRole('button', {
      name: /Open critical \+ high findings, open Bug Detection/i,
    });
    await expect(findingKpi).toBeVisible();
    await findingKpi.click();

    await expect(page).toHaveURL(/bugdetect/i);
    await expect(page.getByRole('heading', { name: 'Bug Detection' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Setup' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Result' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'History' })).toBeVisible();
    await expect(page.locator('body')).toContainText(/AhamTest/i);
  });
});
