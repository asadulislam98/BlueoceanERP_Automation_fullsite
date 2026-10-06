import { expect, Page, Locator } from '@playwright/test';
import * as path from 'path';

export class PurchaseImportItemPage {
  private readonly page: Page;
  private readonly homeMenuIcon: Locator;
  private readonly boflCustomModuleLink: Locator;
  private readonly uploadExcelButton: Locator;
  private readonly excelPurchaseOrderMenu: Locator;
  private readonly newButton: Locator;
  private readonly sheetNameInput: Locator;
  private readonly startPositionInput: Locator;
  private readonly endPositionInput: Locator;
  private readonly uploadFileLabel: Locator;
  private readonly finalUploadButton: Locator; 
  private readonly fourthCell: Locator; 

  // Additional form element locators
  private readonly currencyInput: Locator;
  private readonly usdOption: Locator;
  private readonly purchaseTypeDropdown: Locator;
  private readonly invoiceNoInput: Locator;

  // New locators initialized for the latest sequential steps
  private readonly expectedArrivalInput: Locator;
  private readonly confirmOrderButton: Locator;
  private readonly receiptButton: Locator;
  private readonly splitButton: Locator;
  private readonly emptyCellTarget: Locator; 

  // Final confirmation step locators
  private readonly mrrDateInput: Locator;
  private readonly saveManuallyButton: Locator;
  private readonly validateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.homeMenuIcon = page.getByTitle('Home Menu');
    
    this.boflCustomModuleLink = page.getByRole('menuitem', { name: 'BOFL Custom Module' }).first();
    this.uploadExcelButton = page.getByRole('button', { name: 'Upload Excel' });
    this.excelPurchaseOrderMenu = page.getByRole('menuitem', { name: 'Excel Purchase Order' });
    this.newButton = page.getByRole('button', { name: 'New' });
    this.sheetNameInput = page.getByRole('textbox', { name: 'Sheet Name' });
    this.startPositionInput = page.getByRole('textbox', { name: 'Start Position' });
    this.endPositionInput = page.getByRole('textbox', { name: 'End Position' });
    this.uploadFileLabel = page.locator('label').filter({ hasText: 'Upload your file' });
    this.finalUploadButton = page.getByRole('button', { name: 'Upload file' }); 
    this.fourthCell = page.getByRole('cell').nth(3);

    // Form adjustments selectors
    this.currencyInput = page.getByRole('textbox', { name: 'Currency', exact: true });
    this.usdOption = page.getByRole('link', { name: 'USD' });
    this.purchaseTypeDropdown = page.getByLabel('Purchase Type');
    this.invoiceNoInput = page.getByRole('textbox', { name: 'Invoice No' });

    // Workflow finalization selectors
    this.expectedArrivalInput = page.getByRole('textbox', { name: 'Expected Arrival?' });
    this.confirmOrderButton = page.getByRole('button', { name: 'Confirm Order' });
    this.receiptButton = page.getByRole('button', { name: ' 1 Receipt' });
    this.splitButton = page.getByRole('button', { name: 'Split' });
    this.emptyCellTarget = page.getByRole('cell').filter({ hasText: /^$/ }).nth(3);

    // Initializing newly added end-game execution locators
    this.mrrDateInput = page.getByRole('textbox', { name: 'MRR Date' });

    this.saveManuallyButton = page.getByRole('button', { name: 'Save manually' });
    this.validateButton = page.getByRole('button', { name: 'Validate' });
  }

  async clickHomeMenu() {
    await this.homeMenuIcon.waitFor({ state: 'visible' });
    await this.homeMenuIcon.click();
  }

  async clickBoflCustomModule() {
    await this.boflCustomModuleLink.waitFor({ state: 'visible' });
    await this.boflCustomModuleLink.click();
  }

  async clickUploadExcel() {
    await this.uploadExcelButton.waitFor({ state: 'visible' });
    await this.uploadExcelButton.click();
  }

  async clickExcelPurchaseOrder() {
    await this.excelPurchaseOrderMenu.waitFor({ state: 'visible' });
    await this.excelPurchaseOrderMenu.click();
  }

  async clickNewButton() {
    await this.newButton.waitFor({ state: 'visible' });
    await this.newButton.click({ force: true });
  }

  async fillSheetName(name: string = 'CN260605 395PKG') {
    await this.sheetNameInput.waitFor({ state: 'visible' });
    await this.sheetNameInput.clear();
    await this.sheetNameInput.fill(name);
  }

  async fillEndPosition(pos: string = '6') {
    await this.endPositionInput.waitFor({ state: 'visible' });
    await this.endPositionInput.clear();
    await this.endPositionInput.fill(pos);
  }

  async uploadPurchaseImportFile() {
    await this.uploadFileLabel.waitFor({ state: 'visible' });
    const filePath = path.resolve(__dirname, '../Purchase_Import.xlsm');

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.uploadFileLabel.click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles(filePath);
  }

  async clickFinalUploadButton() {
    await this.finalUploadButton.waitFor({ state: 'visible' });
    await this.finalUploadButton.click();
  }

  async clickFourthCell() {
    await this.fourthCell.waitFor({ state: 'visible' });
    await this.fourthCell.click();
  }

  // Configurations for Currency, Purchase Type, and Invoice No fields
  async configurePurchaseDetails(invoiceNo: string = 'CN260605') {
    await this.currencyInput.waitFor({ state: 'visible' });
    await this.currencyInput.click();
    await this.usdOption.waitFor({ state: 'visible' });
    await this.usdOption.click();

    await this.purchaseTypeDropdown.waitFor({ state: 'visible' });
    await this.purchaseTypeDropdown.selectOption({ label: 'Import' });

    await this.invoiceNoInput.waitFor({ state: 'visible' });
    await this.invoiceNoInput.click();
    await this.invoiceNoInput.clear();
    await this.invoiceNoInput.fill(invoiceNo);
  }

  /**
   * Order finalization lifecycle.
   * @param invoiceNo - Invoice number to fill
   * @param isReceipt - Pass true to skip currency selection during receipt workflow execution
   */
  async processOrderFinalization(invoiceNo: string = 'CN260605', isReceipt: boolean = true) {
    // 1. Clicks Expected Arrival and enters a dynamic date evaluated 10 days out from today
    await this.expectedArrivalInput.waitFor({ state: 'visible' });
    await this.expectedArrivalInput.click();
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const formattedFutureDate = futureDate.toISOString().split('T')[0]; 
    
    await this.expectedArrivalInput.clear();
    await this.expectedArrivalInput.fill(formattedFutureDate);
    await this.page.keyboard.press('Enter'); 

    // 2. Click Confirm Order button
    await this.confirmOrderButton.waitFor({ state: 'visible' });
    await this.confirmOrderButton.click();

    // 3. Click Receipt button
    await this.receiptButton.waitFor({ state: 'visible' });
    await this.receiptButton.click();

    // 4. Click Split operations button
    await this.splitButton.waitFor({ state: 'visible' });
    await this.splitButton.click();

    // 5. Intercepts layout changes and clicks the 4th empty cell matching regex pattern
    await this.emptyCellTarget.waitFor({ state: 'visible' });
    await this.emptyCellTarget.click();

    // 6 & 7. Conditionally triggers Currency selection based on isReceipt flag
    if (!isReceipt) {
      await this.currencyInput.waitFor({ state: 'visible' });
      await this.currencyInput.click();
      
      await this.usdOption.waitFor({ state: 'visible' });
      await this.usdOption.click();
    }

    // 8. Format today's date and force fill MRR Date bypassing the readonly state
  const todayDate = new Date().toISOString().split('T')[0];

  // 'visible' এর জায়গায় 'attached' ব্যবহার করুন
  await this.mrrDateInput.waitFor({ state: 'attached', timeout: 30000 });
  await this.mrrDateInput.fill(todayDate, { force: true });
    

    // 9. Re-confirms Invoice Number with the exact matching context string passed down
    /*await this.invoiceNoInput.waitFor({ state: 'visible' });
    await this.invoiceNoInput.click();
    await this.invoiceNoInput.clear();
    await this.invoiceNoInput.fill(invoiceNo);
    comment reasion purchase invoice no will be  autoface reciept invoice no field. 
    */
    // 10. Persists system settings using Save Manually action item
    await this.saveManuallyButton.waitFor({ state: 'visible' });
    await this.saveManuallyButton.click();

    // 11. Finalizes structural verification lifecycle via Validate action button
    await this.validateButton.waitFor({ state: 'visible' });
    await this.validateButton.click();
  }

  async navigateAndUploadExcelSaleOrder() {
    await this.clickHomeMenu();
    await this.clickBoflCustomModule();
    await this.clickUploadExcel();
    await this.clickExcelPurchaseOrder();
    await this.newButton.waitFor({ state: 'visible' });
    await this.newButton.click({ force: true });
    await this.fillSheetName();
    await this.fillEndPosition();
    await this.uploadPurchaseImportFile();
    await this.clickFinalUploadButton(); 
    await this.clickFourthCell(); 

    // Runs purchase details configuration
    await this.configurePurchaseDetails();

    // Automatically picks up receipt workflow execution with currency selection skipped
    await this.processOrderFinalization('CN260605', true);
  }
}  