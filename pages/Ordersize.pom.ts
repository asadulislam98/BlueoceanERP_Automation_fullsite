import { Page, Locator } from '@playwright/test';
import * as path from 'path';

export class OrderSizePage {
  private readonly page: Page;

  // Locator Definitions
  private readonly homeMenuIcon: Locator;
  private readonly boflCustomModuleItem: Locator;
  private readonly uploadExcelButton: Locator;
  private readonly excelSaleOrderSizeMenuItem: Locator;
  private readonly newButton: Locator;
  private readonly endPositionInput: Locator;
  private readonly uploadFileLabel: Locator;
  private readonly finalUploadButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.homeMenuIcon = page.getByTitle('Home Menu');
    this.boflCustomModuleItem = page.getByRole('menuitem', { name: 'BOFL Custom Module' }).first();
    this.uploadExcelButton = page.getByRole('button', { name: 'Upload Excel' });
    this.excelSaleOrderSizeMenuItem = page.getByRole('menuitem', { name: 'Excel Sale Order Size' });
    this.newButton = page.getByRole('button', { name: 'New' });

    this.endPositionInput = page.getByRole('textbox', { name: 'End Position' });
    this.uploadFileLabel = page.locator('label').filter({ hasText: 'Upload your file' });
    this.finalUploadButton = page.getByRole('button', { name: ' Upload' });
  }

  // Completes the Excel Sale Order Size upload workflow
  async uploadExcelSaleOrderSize(endPos: string) {
    
    // 1. Navigation
    await this.homeMenuIcon.click();
    await this.boflCustomModuleItem.click();
    await this.uploadExcelButton.click();
    await this.excelSaleOrderSizeMenuItem.click();

    // 2. Open form
    await this.newButton.click();

    // 3. Fill form field
    await this.endPositionInput.waitFor({ state: 'visible' });
    await this.endPositionInput.fill(endPos);

    // 4. Handle file upload listener
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.uploadFileLabel.click();

    const fileChooser = await fileChooserPromise;
    const filePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
    await fileChooser.setFiles(filePath);

    // 5. Submit upload form
    await this.finalUploadButton.click();
    await this.page.waitForTimeout(2000);
  }
}