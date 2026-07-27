import { expect, Page, Locator } from '@playwright/test';

export class LoginPage {
  // Centralized locators definition
  private readonly page: Page;
  private readonly databaseLink: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page; 
    this.databaseLink = page.getByRole('link', { name: 'bofl_live_demo', exact: true });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    
    // Strict exact matching enabled for negative validation
    this.errorMessage = page.getByText('Wrong login/password', { exact: true });
  }

  // Select Database
  // async selectDatabase() {
  //   await this.databaseLink.waitFor({ state: 'visible' });
  //   await this.databaseLink.click();
  // }

  // Fill Email with Autofill/Cache clearance
  async fillEmail(email: string) {
    await this.emailInput.waitFor({ state: 'visible' });
    // FIXED: Clear any browser autofill text (like abc@gmail.com) before filling Excel data
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }

  // Fill Password with Autofill/Cache clearance
  async fillPassword(password: string) {
    await this.passwordInput.waitFor({ state: 'visible' });
    // FIXED: Clear any pre-filled or cached password before filling Excel data
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  // Click Login Button
  async clickLoginBtn() {
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
  }

  // Common Login Workflow Method
  async login(email: string, password: string) {
    // await this.selectDatabase();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginBtn();
  }

  // Verify Invalid Login Error Message
  async verifyInvalidLogin() {
    await expect(this.errorMessage).toBeVisible();
  }
}