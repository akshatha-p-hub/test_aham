import { test, expect, type Page } from '@playwright/test';
import { loginToProject, openTestManager } from '../../utils/ahamTestHelpers';

test.describe('Aham full module coverage', () => {
  test('project shell exposes the main Aham modules', async ({ page }) => {
    await loginToProject(page);

    const moduleNames = [
      'Dashboard',
      'Requirements',
      'Test Manager',
      'Testability',
      'Test Plan',
      'Test Scenarios',
      'Test Cases',
      'Coverage',
      'Security Scan',
      'Bug Detection',
      'Threat Model',
    ];

    const body = page.locator('body');
    for (const moduleName of moduleNames) {
      await expect(body).toContainText(new RegExp(moduleName, 'i'));
    }
  });

  test('dashboard sections are visible and the KPI actions open the linked workflows', async ({ page }) => {
    await loginToProject(page);

    const dashboardSections = [
      'Requirements & design',
      'Tests',
      'Code risk',
      'Headline numbers',
      'Needs attention',
    ];

    const body = page.locator('body');
    for (const section of dashboardSections) {
      await expect(body).toContainText(section);
    }

    const flowChecks = [
      { button: /Requirements testable, open Testability/i, expectedText: /Testability/i },
      { button: /Open critical \+ high findings, open Bug Detection/i, expectedText: /Bug Detection/i },
      { button: /Known CVEs, open Security Scan/i, expectedText: /Security Scan/i },
      { button: /Requirements fully traced, open Test Manager/i, expectedText: /Confirmed requirements|Test Manager/i },
    ];

    for (const flow of flowChecks) {
      const action = page.getByRole('button', { name: flow.button });
      await expect(action).toBeVisible({ timeout: 30000 });
      await action.click();
      await expect(page.locator('body')).toContainText(flow.expectedText, { timeout: 30000 });
      await page.goBack();
      await page.waitForLoadState('networkidle');
    }
  });

  test('test manager surfaces coverage, requirements, scenario, and traceability data', async ({ page }) => {
    await openTestManager(page);

    const body = page.locator('body');
    await expect(body).toContainText(/Confirmed requirements/i);
    await expect(body).toContainText(/Testability/i);
    await expect(body).toContainText(/Needs attention/i);
    await expect(body).toContainText(/Scenarios/i);
    await expect(body).toContainText(/Cases/i);
    await expect(body).toContainText(/Coverage by priority/i);
    await expect(body).toContainText(/Traceability/i);
  });

  test('risk and project health widgets summarize the selected project', async ({ page }) => {
    await loginToProject(page);

    const body = page.locator('body');
    await expect(body).toContainText(/Requirements fully traced/i);
    await expect(body).toContainText(/Requirements testable/i);
    await expect(body).toContainText(/Headline numbers/i);
    await expect(body).toContainText(/Needs attention/i);
    await expect(body).toContainText(/Threat model: never run for this scope/i);
  });

  test('all module affordances remain available from the project shell', async ({ page }) => {
    await loginToProject(page);

    const moduleNavigators = [
      'Dashboard',
      'Requirements',
      'Test Manager',
      'Testability',
      'Test Plan',
      'Test Scenarios',
      'Test Cases',
      'Coverage',
      'Security Scan',
      'Bug Detection',
      'Threat Model',
    ];

    const body = page.locator('body');
    for (const moduleName of moduleNavigators) {
      await expect(body).toContainText(moduleName);
    }
  });
});
