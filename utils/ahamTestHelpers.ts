import { expect, type Page } from '@playwright/test';

const loginUrl = process.env.BASE_URL || '';

export async function loginToProject(page: Page): Promise<void> {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;

  if (!email || !password) {
    throw new Error('Missing EMAIL or PASSWORD values in the .env file.');
  }

  await page.goto(loginUrl);

  const emailField = page.locator('input[type="email"]');
  const passwordField = page.locator('input[type="password"]');

  await expect(emailField).toBeVisible();
  await expect(passwordField).toBeVisible();
  await emailField.fill(email);
  await passwordField.fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForLoadState('networkidle');

  const projectPicker = page.getByText(/AhamTest|No project|Open Projects/i).first();
  await expect(projectPicker).toBeVisible({ timeout: 30000 });
  await projectPicker.click();

  const projectOption = page
    .getByRole('option', { name: /AhamTest/i })
    .or(page.getByText(/^AhamTest$/i))
    .first();

  await expect(projectOption).toBeVisible({ timeout: 30000 });
  await projectOption.click();

  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toContainText(/AhamTest/i, { timeout: 30000 });
}

export async function expectModuleVisible(page: Page, moduleName: string): Promise<void> {
  await loginToProject(page);
  await expect(page.locator('body')).toContainText(moduleName);
}

export async function openTestManager(page: Page): Promise<void> {
  await loginToProject(page);
  await page.goto(`${loginUrl}/testmanager`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/testmanager/i);
  await expect(page.getByRole('heading', { name: /test manager/i })).toBeVisible();
}