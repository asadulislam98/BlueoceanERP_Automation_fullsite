import { Page, Locator } from '@playwright/test';
import * as path from 'path';

export class SalesOrderSheetPage {
  private readonly page: Page;

  // Locator Definitions
  private readonly homeMenuIcon: Locator;
  private readonly boflCustomModuleItem: Locator;
  private readonly uploadExcelButton: Locator;
  private readonly excelSaleOrderSheetMenuItem: Locator;
  private readonly newButton: Locator;
  private readonly sheetNameInput: Locator;
  private readonly startPositionInput: Locator;
  private readonly endPositionInput: Locator;
  private readonly uploadFileLabel: Locator;
  private readonly finalUploadButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.homeMenuIcon = page.getByTitle('Home Menu');
    this.boflCustomModuleItem = page.getByRole('menuitem', { name: 'BOFL Custom Module' }).first();
    this.uploadExcelButton = page.getByRole('button', { name: 'Upload Excel' });
    this.excelSaleOrderSheetMenuItem = page.getByRole('menuitem', { name: 'Excel Sale Order Sheet' });
    this.newButton = page.getByRole('button', { name: 'New' });
    
    this.sheetNameInput = page.getByRole('textbox', { name: 'Sheet Name' });
    this.startPositionInput = page.getByRole('textbox', { name: 'Start Position' });
    this.endPositionInput = page.getByRole('textbox', { name: 'End Position' });
    
    this.uploadFileLabel = page.locator('label').filter({ hasText: 'Upload your file' });
    this.finalUploadButton = page.getByRole('button', { name: 'Upload file' });
  }

  // Completes the entire flow (Navigation + File Chooser Interaction + Upload Submission)
  async uploadExcelSalesOrderSheet(startPos: string, endPos: string) {
    // 1. Navigation
    
    await this.homeMenuIcon.click();
    await this.boflCustomModuleItem.click();
    await this.uploadExcelButton.click();
    await this.excelSaleOrderSheetMenuItem.click();

    // 2. Open form
    await this.newButton.click({ force: true });
    
    // 3. Fill form fields
    await this.sheetNameInput.waitFor({ state: 'visible' });
    await this.sheetNameInput.fill("Need Update"); 
    await this.startPositionInput.fill(startPos);
    await this.endPositionInput.fill(endPos);
    
    // 4. Set up a listener to catch the file chooser dialog event when the label is clicked
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    
    // Click the label as requested to open the file selection screen
    await this.uploadFileLabel.click();
    
    
    // Wait for the file chooser to active and assign the instance variable
    const fileChooser = await fileChooserPromise;
    
    // Resolve local spreadsheet path for Copy-1 (6).xlsx and load it into the file chooser event layer
    const filePath = path.resolve(__dirname, '../new_sales_order_sheet_format 1 - Copy-1 (6).xlsx');
    await fileChooser.setFiles(filePath);
    
    // 5. Submit the transaction stack by clicking the target button
    await this.finalUploadButton.click();
    
    // Wait for the system to finish processing the upload stream
    await this.page.waitForTimeout(2000);
  }
}