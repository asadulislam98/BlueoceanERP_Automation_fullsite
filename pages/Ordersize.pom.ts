import { Page, Locator, expect } from '@playwright/test';
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

  // Locators for orderspairsexceedednegativetestcase
  private readonly salesMenuItem: Locator;
  private readonly ordersButton: Locator;
  private readonly salesOrderSheetMenuItem: Locator;
  private readonly searchBoxInput: Locator;
  private readonly searchProductionNoLink: Locator;
  private readonly sizeButton: Locator;
  private readonly zeroCellNth2: Locator;
  private readonly hashCell4_5: Locator;
  private readonly warningHeading: Locator;
  private readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Existing Locators Initialization
    this.homeMenuIcon = page.getByTitle('Home Menu');
    this.boflCustomModuleItem = page.getByRole('menuitem', { name: 'BOFL Custom Module' }).first();
    this.uploadExcelButton = page.getByRole('button', { name: 'Upload Excel' });
    this.excelSaleOrderSizeMenuItem = page.getByRole('menuitem', { name: 'Excel Sale Order Size' });
    this.newButton = page.getByRole('button', { name: 'New' });
    this.endPositionInput = page.getByRole('textbox', { name: 'End Position' });
    this.uploadFileLabel = page.locator('label').filter({ hasText: 'Upload your file' });
    this.finalUploadButton = page.getByRole('button', { name: ' Upload' });

    // Negative Testcase Locators Initialization
    this.salesMenuItem = page.getByRole('menuitem', { name: 'Sales' }).first();
    this.ordersButton = page.getByRole('button', { name: 'Orders' });
    this.salesOrderSheetMenuItem = page.getByRole('menuitem', { name: 'Sales Order Sheet' });
    this.searchBoxInput = page.getByRole('searchbox', { name: 'Search...' });
    this.searchProductionNoLink = page.getByRole('link', { name: 'Search Production No for:' });
    this.sizeButton = page.getByRole('button', { name: 'Size' });
    this.zeroCellNth2 = page.getByRole('cell', { name: '0' }).nth(3);
    this.hashCell4_5 = page.getByRole('cell', { name: '4.5#', exact: true });
    this.warningHeading = page.getByRole('heading', { name: 'Warning', exact: true });
    this.closeButton = page.getByText('Close');
  }

  // Completes the Excel Sale Order Size upload workflow
  async uploadExcelSaleOrderSize(endPos: string) {
    await this.homeMenuIcon.click();
    await this.boflCustomModuleItem.click();
    await this.uploadExcelButton.click();
    await this.excelSaleOrderSizeMenuItem.click();

    await this.newButton.click();

    await this.endPositionInput.waitFor({ state: 'visible' });
    await this.endPositionInput.fill(endPos);

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.uploadFileLabel.click();

    const fileChooser = await fileChooserPromise;
    const filePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
    await fileChooser.setFiles(filePath);

    await this.finalUploadButton.click();
    await this.page.waitForTimeout(2000);
    
  }

  // Negative Test Case: orderspairsexceedednegativetestcase
  async ordersPairsExceededNegativeTestCase(productionNo: string) {
    // 1. Home Icon Click
    await this.homeMenuIcon.click();

    // 2. Sales Menu Item Click
    await this.salesMenuItem.click();

    // 3. Orders Button Click
    await this.ordersButton.click();

    // 4. Sales Order Sheet Click
    await this.salesOrderSheetMenuItem.click();

    // 5. Searchbox e A3 theke neowa production no input
    await this.searchBoxInput.fill(productionNo);

    // 6. Search Production No for: link click
    await this.searchProductionNoLink.click();

    // 7. Size button click
    await this.sizeButton.click();

    // 8. Cell (0) nth(2) e 10 input
    await this.zeroCellNth2.click();
    await this.page.keyboard.type('10');

    // 9. Popup display korar jonno 4.5# cell e click
    await this.hashCell4_5.click();

    // 10. 'Warning' heading verify
    await expect(this.warningHeading).toBeVisible();

    // 11. Close button e click
    await this.closeButton.click();
  }
}