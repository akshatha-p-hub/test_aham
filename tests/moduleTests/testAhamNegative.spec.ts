import { test, expect, type Page } from '@playwright/test';

const loginUrl = process.env.BASE_URL || '';
const validEmail = process.env.EMAIL || '';
const validPassword = process.env.PASSWORD || '';

if (!validEmail || !validPassword) {
  throw new Error('Missing EMAIL or PASSWORD values in the .env file.');
}

async function openLoginPage(page: Page): Promise<void> {
  await page.goto(loginUrl);
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
}

async function login(page: Page, email: string, password: string): Promise<void> {
  await openLoginPage(page);
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: /sign in|sign/i }).click();
}

test.describe('Aham negative validation', () => {
  test('invalid email format is rejected on the login page', async ({ page }) => {
    await openLoginPage(page);

    await page.locator('input[type="email"]').fill('invalid-email');
    await page.locator('input[type="password"]').fill(validPassword);
    await page.getByRole('button', { name: /sign in|sign/i }).click();

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page).toHaveURL(new RegExp('3\\.129\\.154\\.1:8000|localhost:8000|127\\.0\\.0\\.1:8000|login', 'i'));
  });

  test('wrong password does not grant access to the project dashboard', async ({ page }) => {
    await login(page, validEmail, 'wrong-password');

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('body')).toContainText(/Sign in|Email|Password/i);
    await expect(page).not.toHaveURL(/project-dashboard|dashboard/i);
  });

  test('protected module routes redirect to login when no session exists', async ({ page }) => {
    const protectedRoutes = [
      '/project-dashboard',
      '/testmanager',
      '/testability',
      '/testplan',
      '/testcases',
      '/security-scan',
      '/bug-detection',
      '/threat-model',
      '/coverage',
      '/requirements',
    ];

    for (const route of protectedRoutes) {
      await page.goto(`${loginUrl}${route}`);
      await page.waitForLoadState('networkidle');

      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`(${route}|login|3\\.129\\.154\\.1:8000|localhost:8000|127\\.0\\.0\\.1:8000)`, 'i'));
    }
  });

  test('module names are not exposed as project data without an authenticated session', async ({ page }) => {
    const body = page.locator('body');

    await page.goto(`${loginUrl}/project-dashboard`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(body).toContainText(/Sign in|Email|Password/i);
    await expect(body).not.toContainText(/Confirmed requirements|Requirements fully traced|Testability|Bug Detection/i);
  });
});
