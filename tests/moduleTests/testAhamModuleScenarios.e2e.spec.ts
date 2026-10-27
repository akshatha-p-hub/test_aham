import { test, expect } from '@playwright/test';
import { loginToProject, openTestManager } from '../../utils/ahamTestHelpers';

test.describe('Aham modules - end-to-end scenarios', () => {
  test('dashboard reporting controls and attention list work', async ({ page }) => {
    await loginToProject(page);

    const periodGroup = page.getByRole('radiogroup', { name: 'Period' });
    const sevenDays = periodGroup.getByRole('radio', { name: '7 days' });
    const thirtyDays = periodGroup.getByRole('radio', { name: '30 days' });
    const ninetyDays = periodGroup.getByRole('radio', { name: '90 days' });

    await sevenDays.check();
    await expect(sevenDays).toBeChecked();
    await ninetyDays.check();
    await expect(ninetyDays).toBeChecked();
    await thirtyDays.check();
    await expect(thirtyDays).toBeChecked();

    const attention = page.getByRole('heading', { name: 'Needs attention' }).locator('xpath=../../..');
    const items = attention.getByRole('listitem');
    await expect(items).toHaveCount(3);
    await attention.getByRole('button', { name: /Show all/i }).click();
    await expect(items).toHaveCount(6);
  });

  test('dashboard KPIs route to Testability, Bug Detection, Security Scan, and Test Manager', async ({ page }) => {
    await loginToProject(page);

    const journeys = [
      {
        action: /Requirements testable, open Testability/i,
        assertion: /Testability/i,
      },
      {
        action: /Open critical \+ high findings, open Bug Detection/i,
        assertion: /Bug Detection/i,
      },
      {
        action: /Known CVEs, open Security Scan/i,
        assertion: /Security Scan/i,
      },
      {
        action: /Requirements fully traced, open Test Manager/i,
        assertion: /Confirmed requirements/i,
      },
    ];

    for (const journey of journeys) {
      await page.getByRole('button', { name: journey.action }).click();
      await expect(page.locator('body')).toContainText(journey.assertion);
      if (journey !== journeys[journeys.length - 1]) {
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('project risk summary shows repository, security, and threat-model status', async ({ page }) => {
    await loginToProject(page);

    const riskTable = page.getByRole('table', { name: 'Risk by repo' });
    await expect(riskTable.getByRole('columnheader', { name: 'Repo' })).toBeVisible();
    await expect(riskTable.getByRole('columnheader', { name: 'Bugs' })).toBeVisible();
    await expect(riskTable.getByRole('columnheader', { name: 'Security' })).toBeVisible();
    await expect(riskTable.getByRole('row', { name: /test_aham/i })).toBeVisible();
    await expect(page.locator('body')).toContainText(/Threat model: never run for this scope/i);
  });

  test('Requirements and Testability health indicators are present on the dashboard', async ({ page }) => {
    await loginToProject(page);

    const body = page.locator('body');
    await expect(body).toContainText(/Requirements fully traced/i);
    await expect(body).toContainText(/Requirements testable/i);
    await expect(body).toContainText(/Requirements & design/i);
    await expect(body).toContainText(/Current|Never measured|Stale/i);
  });

  test('Test Manager covers requirements, scenarios, cases, and coverage', async ({ page }) => {
    await openTestManager(page);

    const body = page.locator('body');
    await expect(body).toContainText(/Confirmed requirements/i);
    await expect(body).toContainText(/Testability/i);
    await expect(body).toContainText(/Scenarios/i);
    await expect(body).toContainText(/Cases/i);
    await expect(body).toContainText(/Stage progress/i);
    await expect(body).toContainText(/Coverage by priority/i);
    await expect(body).toContainText(/Recently changed/i);
  });

  test('Coverage can be grouped by priority and section', async ({ page }) => {
    await openTestManager(page);

    const grouping = page.getByRole('radiogroup', { name: 'Group coverage by' });
    const priority = grouping.getByRole('radio', { name: 'Priority' });
    const section = grouping.getByRole('radio', { name: 'Section' });
    const coverageTable = page
      .getByRole('table')
      .filter({ has: page.getByRole('columnheader', { name: /Reqs/i }) });

    await expect(priority).toBeChecked();
    await expect(coverageTable.getByRole('columnheader', { name: 'Priority' })).toBeVisible();

    await section.check();
    await expect(section).toBeChecked();
    await expect(coverageTable.getByRole('columnheader', { name: 'Section' })).toBeVisible();

    await priority.check();
    await expect(priority).toBeChecked();
  });

  test('Test Plan tabs navigate through overview, traceability, assets, and runs', async ({ page }) => {
    await openTestManager(page);

    const tabNames = ['Overview', 'Traceability', 'Test assets', 'Runs'];
    for (const tabName of tabNames) {
      const tab = page.getByRole('tab', { name: tabName });
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByRole('tabpanel')).toBeVisible();
    }

    await expect(page.getByRole('heading', { name: 'Stage progress' })).toBeVisible();
  });

  test('all Aham module entries are available in the selected project shell', async ({ page }) => {
    await loginToProject(page);

    const moduleEntries = [
      'Dashboard',
      'Requirements',
      'Testability',
      'Test Plan',
      'Test Scenarios',
      'Test Cases',
      'Coverage',
      'Security Scan',
      'Bug Detection',
      'Threat Model',
      'Test Manager',
    ];

    const body = page.locator('body');
    for (const moduleName of moduleEntries) {
      await expect(body).toContainText(new RegExp(moduleName, 'i'));
    }
  });
});
