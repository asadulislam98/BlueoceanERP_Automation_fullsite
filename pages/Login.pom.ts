import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly databaseLink: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly actualErrorMessageLocator: Locator;

  constructor(page: Page) {
    this.page = page; 
    this.databaseLink = page.getByRole('link', { name: 'bofl_live_demo', exact: true });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    
    // Generic locator to catch the live error alert container dynamically from UI
    this.actualErrorMessageLocator = page.locator('.alert-danger, p.alert');
  }

  // Fill Email field with autofill/cache clearance
  async fillEmail(email: string) {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }

  // Fill Password field with autofill/cache clearance
  async fillPassword(password: string) {
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  // Click Login button when visible
  async clickLoginBtn() {
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
  }

  // Re-usable common login workflow method
  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginBtn();
  }

  /**
   * Verify Invalid Login with strict exact matching and UI overlay display on failure
   * @param expectedMessage - Exact string expected by test (e.g., 'Wrong login/passwords')
   */
  async verifyInvalidLogin(expectedMessage: string) {
    // 1. Wait until error container appears on screen
    await this.actualErrorMessageLocator.waitFor({ state: 'visible' });

    // 2. Dynamically extract the raw live actual text from browser UI (No hardcoded values)
    const actualMessage = await this.actualErrorMessageLocator.innerText();

    // 3. Exact strict comparison: Checks spaces, commas, special characters, and casing
    const isExactMatch = actualMessage === expectedMessage;

    if (!isExactMatch) {
      // 4. Inject visual UI banner into browser DOM for immediate observation
      await this.page.evaluate(({ expectedMessage, actualMessage }) => {
        const div = document.createElement('div');
        div.id = 'playwright-custom-popup';
        
        // HTML Structure: Header is centered, while details remain left-aligned
        div.innerHTML = `
          <div style="text-align: center; margin-bottom: 6px;">
            Testcase Fail Reasion :
          </div>
          <div style="text-align: left;">
            Expected Message is : ${expectedMessage}<br/>
            Actual Message is : ${actualMessage}
          </div>
        `;

        div.style.position = 'fixed';
        div.style.top = '20px';
        div.style.left = '50%';
        div.style.transform = 'translateX(-50%)';
        div.style.backgroundColor = '#e01406'; // Bright Red
        div.style.color = '#ffffff';
        div.style.padding = '18px 28px';
        div.style.borderRadius = '8px';
        div.style.boxShadow = '0px 4px 16px rgba(0,0,0,0.4)';
        div.style.zIndex = '999999';
        div.style.fontSize = '16px';
        div.style.fontWeight = 'bold';
        div.style.lineHeight = '1.5';
        div.style.minWidth = '320px';

        document.body.appendChild(div);
      }, { expectedMessage, actualMessage });

      // Plain text formatting for console output/terminal report
      const popupText = `Testcase Fail Reasion :\nExpected Message is : ${expectedMessage} \nActual Message is : ${actualMessage}`;

      // 5. Hold UI banner for 10 seconds before failing
      await this.page.waitForTimeout(10000);

      // 6. Formally fail the test after display
      throw new Error(popupText);
    }
  }
}