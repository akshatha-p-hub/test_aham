import { type Page, type Locator, expect } from '@playwright/test';

export class DataModelPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel('Login');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Submit' });
  }

  async fillDetails() {
  //await this.page.getByRole('class', { name: 'Customizations' }).click();
    await this.page.getByRole('button', { name: 'Open Settings' }).click();
    await this.page.getByText('Customizations').click();
    await this.page.getByText('Data Model').click();
    await expect(this.page.locator('body')).toContainText('Object Builder');

    //await this.page.getByRole('button', { list : 'lucide-funnel' }).click();
    await expect(this.page.locator('body')).toContainText('Object Name');
    await expect(this.page.locator('body')).toContainText('Field Label');

    //code for sorting
    await this.page.getByRole('button', { name: 'Click to sort' }).first().click();
    await this.page.getByRole('button', { name: 'Click to sort' }).nth(1).click();

  }
  async validateDate() {
    const dateLocators = this.page.locator('gridcell').filter({ 
      hasText: /\d{1,2} \w+ \d{4}/ 
    });
    const count = await dateLocators.count();
    expect(count).toEqual(0);
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