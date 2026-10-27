import { type Page, type Locator, expect } from '@playwright/test';

export class CPLoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByPlaceholder('Enter email address');
    this.passwordInput = page.getByPlaceholder('Enter password');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
  }

  async fillLoginPage(email: string, password: string) {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
    await expect(this.page).toHaveURL(/demo/);
  }
  async goto() {
    await this.page.goto(process.env.CP_BASE_URL || '');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  async assertSignInButtonDisabled() {
    await expect(this.signInButton).toBeDisabled();
  }
}