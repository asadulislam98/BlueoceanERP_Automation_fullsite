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

    // Initializing the added locators
    this.currencyInput = page.getByRole('textbox', { name: 'Currency', exact: true });
    this.usdOption = page.getByRole('link', { name: 'USD' });
    this.purchaseTypeDropdown = page.getByLabel('Purchase Type');
    this.invoiceNoInput = page.getByRole('textbox', { name: 'Invoice No' });
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

  async fillEndPosition(pos: string = '7') {
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

  // Handles subsequent operations sequentially following the initial upload process
  async configurePurchaseDetails(invoiceNo: string = 'CN260605') {
    // 1. Target and click Currency dropdown list, then select USD
    await this.currencyInput.waitFor({ state: 'visible' });
    await this.currencyInput.click();
    await this.usdOption.waitFor({ state: 'visible' });
    await this.usdOption.click();

    // 2. Select the "Import" option directly from the Purchase Type dropdown matrix
    await this.purchaseTypeDropdown.waitFor({ state: 'visible' });
    await this.purchaseTypeDropdown.selectOption({ label: 'Import' });

    // 3. Clear and update Invoice Number input field
    await this.invoiceNoInput.waitFor({ state: 'visible' });
    await this.invoiceNoInput.click();
    await this.invoiceNoInput.clear();
    await this.invoiceNoInput.fill(invoiceNo);
  }

  async navigateAndUploadExcelSaleOrder() {
    await this.page.pause(); 
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

    // Runs subsequent workflow items sequentially after previous steps complete
    await this.configurePurchaseDetails();
  }
}