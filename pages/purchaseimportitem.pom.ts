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
  private readonly fourthCell: Locator; // Added locator for the cell

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
    this.fourthCell = page.getByRole('cell').nth(3); // Targets the 4th cell element
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

//   async fillStartPosition(pos: string = '2') {
//     await this.startPositionInput.waitFor({ state: 'visible' });
//     await this.startPositionInput.clear();
//     await this.startPositionInput.fill(pos);
//   }

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

  // Click the targeted cell element
  async clickFourthCell() {
    await this.fourthCell.waitFor({ state: 'visible' });
    await this.fourthCell.click();
  }

  async navigateAndUploadExcelSaleOrder() {
    await this.page.pause(); 
    await this.clickHomeMenu();
    await this.clickBoflCustomModule();
    await this.clickUploadExcel();
    await this.clickExcelPurchaseOrder();
    await this.clickNewButton();
    await this.fillSheetName();
    // await this.fillStartPosition();
    await this.fillEndPosition();
    await this.uploadPurchaseImportFile();
    await this.clickFinalUploadButton(); 
    await this.clickFourthCell(); // Final click step executed after upload completes
  }
}