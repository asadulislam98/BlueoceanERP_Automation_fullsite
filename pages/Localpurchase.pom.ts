import { Page, Locator, expect } from '@playwright/test';
import { LoginPage } from './Login.pom';
import * as fs from 'fs';
import * as path from 'path';

export class LocalPurchasePage {
  private readonly page: Page;
  private readonly loginPage: LoginPage;

  // Existing Locators
  private readonly homeMenuButton: Locator;
  private readonly purchaseMenuItem: Locator;
  private readonly newButton: Locator;
  private readonly vendorInput: Locator;
  private readonly vendorOption: Locator;
  private readonly purchaseTypeSelect: Locator;
  private readonly poOrderNoInput: Locator;
  private readonly expectedArrivalInput: Locator;

  // Locators for Raw Material Product Grid Selection Steps
  private readonly addProductButton: Locator;
  private readonly productDropdownInput: Locator;
  private readonly searchMoreLink: Locator;
  private readonly searchDropdownToggler: Locator;
  private readonly rawMaterialsCheckbox: Locator;
  private readonly searchProductBanner: Locator;
  private readonly adhesiveText: Locator;
  private readonly firstProductDataCell: Locator;

  // Locators for Consumable Product Grid Selection Steps
  private readonly consumableText: Locator;
  private readonly unitText: Locator;
  private readonly commonConText: Locator;
  private readonly cutterThreadCell: Locator;

  // Quantity Input Locators
  private readonly firstQuantityInput: Locator;
  private readonly secondQuantityInput: Locator;

  // Locators for Order Confirmation & Split Receipt Workflow
  private readonly confirmOrderButton: Locator;
  private readonly receiptButton: Locator;
  private readonly splitButton: Locator;
  private readonly todayCell: Locator;
  private readonly chalanNoInput: Locator;
  private readonly mrrDateInput: Locator;
  private readonly currencyInput: Locator;
  private readonly markAsTodoButton: Locator;
  private readonly quantityCellFour: Locator;
  private readonly validateButton: Locator;
  private readonly createBackorderButton: Locator;
  private readonly splitedReceiptsButton: Locator;
  private readonly readyStatusText: Locator;

  // NEW LOCATORS FOR: Partial received done by LC/TC
  private readonly kpstVendorOption: Locator;
  private readonly vendorReferenceInput: Locator;
  private readonly usdCurrencyOption: Locator;
  private readonly saveManuallyButton: Locator;
  private readonly searchInputBox: Locator;
  private readonly searchProductResultLink: Locator;
  private readonly tagsCellLocator: Locator;

  // NEW LOCATORS: Sole & Sales Order Sheet Steps
  private readonly isSoleCheckbox: Locator;
  private readonly addSoleSizeButton: Locator;
  private readonly sizeVariantDropdown: Locator;
  private readonly salesOrderSheetInput: Locator;
  private readonly recordSelectorCell: Locator;
  private readonly selectButton: Locator;
  private readonly loadButton: Locator;
  private readonly outsoleLink: Locator;

  // NEW LOCATORS FOR RECENTLY ADDED STEPS
  private readonly receiveProductsButton: Locator;
  private readonly emptyCellNth3: Locator;
  private readonly quantityCellThreeTwenty: Locator;

  // NEW LOCATORS FOR LC MANAGEMENT TASK
  private readonly lcManagementMenuItem: Locator;
  private readonly lcScttNoInput: Locator;
  private readonly openingDateInput: Locator;
  private readonly bankNameInput: Locator;
  private readonly partialReceiveItemCell: Locator;
  private readonly invoiceNoInput: Locator;

  // Dynamic Chalan Counter States
  private chalanCounter: number = 1;
  private xChalanCounter: number = 1;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);

    // Initializing Existing Locators
    this.homeMenuButton = page.getByTitle('Home Menu');
    this.purchaseMenuItem = page.getByRole('menuitem', { name: 'Purchase' }).first();
    this.newButton = page.getByRole('button', { name: 'New' });
    this.vendorInput = page.getByRole('textbox', { name: 'Vendor/Supplier?' });
    this.vendorOption = page.getByRole('link', { name: 'Al - Amin Safety & Mill Store' });
    this.purchaseTypeSelect = page.getByLabel('Purchase Type');
    this.poOrderNoInput = page.getByRole('textbox', { name: 'PO Order No' });
    this.expectedArrivalInput = page.getByRole('textbox', { name: 'Expected Arrival?' });

    // Product Selection Locators
    this.addProductButton = page.getByRole('button', { name: 'Add a product' });
    this.productDropdownInput = page.locator('td.o_field_cell.o_many2one_avatar_user_cell, div[name="product_id"] input, td[name="product_id"]').first();
    this.searchMoreLink = page.getByRole('link', { name: 'Search More...' });
    this.searchDropdownToggler = page.locator('.dropdown-toggle.o_searchview_dropdown_toggler');

    this.rawMaterialsCheckbox = page.getByRole('menuitemcheckbox', { name: 'Raw Materials ' });
    this.searchProductBanner = page.getByRole('banner').filter({ hasText: 'Search: Product' });
    this.adhesiveText = page.getByText('ADHESIVE (58)');
    this.firstProductDataCell = page.locator('.o_data_cell.cursor-pointer.o_field_cell.o_many2many_tags_cell.o_readonly_modifier').first();

    this.consumableText = page.getByText('consumable');
    this.unitText = page.getByText('Unit', { exact: true });
    this.commonConText = page.getByText('COMMON-CON (581)');
    this.cutterThreadCell = page.getByRole('cell', { name: 'CUTTER (THREAD)' });

    this.firstQuantityInput = page.locator('.o_field_widget.o_required_modifier.o_field_float > .o_input').first();
    this.secondQuantityInput = page.locator("xpath=//div[@name='product_qty']//input[@type='text']").last();

    // Initializing Receipt & Split Locators
    this.confirmOrderButton = page.getByRole('button', { name: 'Confirm Order' });
    this.receiptButton = page.getByRole('button', { name: ' 1 Receipt' });
    this.splitButton = page.getByRole('button', { name: 'Split' });
    this.todayCell = page.getByRole('cell', { name: 'Today' }).first();
    this.chalanNoInput = page.getByRole('textbox', { name: 'Chalan No' });
    this.mrrDateInput = page.getByRole('textbox', { name: 'MRR Date' });
    this.currencyInput = page.getByRole('textbox', { name: 'Currency', exact: true });
    this.markAsTodoButton = page.getByRole('button', { name: 'Mark as Todo' });
    this.quantityCellFour = page.getByRole('cell', { name: '4.00' }).nth(1);
    this.validateButton = page.getByRole('button', { name: 'Validate' });
    this.createBackorderButton = page.getByRole('button', { name: 'Create Backorder' });
    this.splitedReceiptsButton = page.getByRole('button', { name: ' Splited Receipts' });
    this.readyStatusText = page.getByText('Ready');

    // Initializing New Locators for LC/TC Flow
    this.kpstVendorOption = page.getByRole('link', { name: 'KPST SHOES(BD) CO.,LTD' });
    this.vendorReferenceInput = page.getByRole('textbox', { name: 'Vendor Reference?' });
    this.usdCurrencyOption = page.getByRole('link', { name: 'USD' });
    this.saveManuallyButton = page.getByRole('button', { name: 'Save manually' });
    this.searchInputBox = page.getByRole('searchbox', { name: 'Search...' });
    this.searchProductResultLink = page.getByRole('link', { name: /Search Product for:/i });
    this.tagsCellLocator = page.locator('.o_field_widget.o_readonly_modifier.o_field_many2many_tags').first();

    // NEW LOCATORS: Sole & Sales Order Sheet Steps
    this.isSoleCheckbox = page.locator('.o-checkbox.d-inline-block.me-2');
    this.addSoleSizeButton = page.getByRole('button', { name: 'Add Sole Size' });
    this.sizeVariantDropdown = page.locator('#size_variant_0');
    this.salesOrderSheetInput = page.getByRole('textbox', { name: 'Sales Order Sheet' });
    this.recordSelectorCell = page.locator('.o_list_record_selector.user-select-none').first();
    this.selectButton = page.getByRole('button', { name: 'Select' });
    this.loadButton = page.getByRole('button', { name: 'Load' });
    this.outsoleLink = page.getByRole('link', { name: /.*\(Outsole\)/i });

    // LOCATORS INITIALIZATION FOR NEW STEPS
    this.receiveProductsButton = page.getByRole('button', { name: 'Receive Products' });
    this.emptyCellNth3 = page.getByRole('cell').filter({ hasText: /^$/ }).nth(3);
    this.quantityCellThreeTwenty = page.getByRole('cell', { name: '320.00' }).nth(1);

    // LOCATORS FOR NEW LC MANAGEMENT TASK
    this.lcManagementMenuItem = page.getByRole('menuitem', { name: 'LC Management' });
    this.lcScttNoInput = page.getByRole('textbox', { name: 'LC/SC/TT No' });
    this.openingDateInput = page.getByRole('textbox', { name: 'Opening Date' });
    this.bankNameInput = page.getByRole('textbox', { name: 'Bank Name' });
    this.partialReceiveItemCell = page.getByRole('cell').filter({ hasText: /^$/ }).nth(4);
    this.invoiceNoInput = page.getByRole('textbox', { name: 'Invoice No' });
  }

  async performLogin(email: string, password: string) {
    await this.loginPage.login(email, password);
  }

  private async fillManualFutureDate(daysToAdd: number) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysToAdd);

    const day = String(targetDate.getDate()).padStart(2, '0');
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const year = targetDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    await this.expectedArrivalInput.click();
    await this.expectedArrivalInput.clear();
    await this.expectedArrivalInput.fill(formattedDate);
    await this.expectedArrivalInput.press('Enter');
  }

  private getTodayFormattedDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private getFiveDaysAgoFormattedDate(): string {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - 5);

    const day = String(targetDate.getDate()).padStart(2, '0');
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const year = targetDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private getNextChalanNumber(prefix: string): string {
    if (prefix === 'ch') {
      const formatted = `ch${String(this.chalanCounter).padStart(3, '0')}`;
      this.chalanCounter++;
      return formatted;
    } else {
      const formatted = `xch${String(this.xChalanCounter).padStart(3, '0')}`;
      this.xChalanCounter++;
      return formatted;
    }
  }

  private getNextCHFormattedChalanNumber(): string {
    const counterFilePath = path.resolve(__dirname, '../ch_counter.json');
    let counter = 112701;

    if (fs.existsSync(counterFilePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(counterFilePath, 'utf-8'));
        counter = data.counter || 112701;
      } catch {
        counter = 112701;
      }
    }

    const formattedNumber = `CH-${String(counter).padStart(8, '0')}`;
    fs.writeFileSync(counterFilePath, JSON.stringify({ counter: counter + 1 }), 'utf-8');
    return formattedNumber;
  }

  private getNextLCSCTTNumber(): string {
    const counterFilePath = path.resolve(__dirname, '../lc_sctt_counter.json');
    let counter = 1020304001;

    if (fs.existsSync(counterFilePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(counterFilePath, 'utf-8'));
        counter = data.counter || 1020304001;
      } catch {
        counter = 1020304001;
      }
    }

    fs.writeFileSync(counterFilePath, JSON.stringify({ counter: counter + 1 }), 'utf-8');
    return String(counter);
  }

  private getNextInvoiceNumber(): string {
    const counterFilePath = path.resolve(__dirname, '../invoice_counter.json');
    let counter = 12345678901;

    if (fs.existsSync(counterFilePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(counterFilePath, 'utf-8'));
        counter = data.counter || 12345678901;
      } catch {
        counter = 12345678901;
      }
    }

    fs.writeFileSync(counterFilePath, JSON.stringify({ counter: counter + 1 }), 'utf-8');
    return String(counter);
  }

  private async incrementExistingChalanNo(): Promise<string> {
    const currentValue = (await this.chalanNoInput.inputValue()).trim();

    const match = currentValue.match(/^([a-zA-Z]+)(\d+)$/);
    if (match) {
      const prefix = match[1];
      const numDigits = match[2].length;
      const nextNum = parseInt(match[2], 10) + 1;
      return `${prefix}${String(nextNum).padStart(numDigits, '0')}`;
    }

    return this.getNextChalanNumber('xch');
  }

  async createLocalPurchase(poNumber: string) {
    await this.homeMenuButton.click();
    await this.purchaseMenuItem.click();
    await this.newButton.click();

    await this.vendorInput.click();
    await this.vendorOption.click();

    await this.purchaseTypeSelect.selectOption({ label: 'Local' });
    await this.poOrderNoInput.fill(poNumber);

    await this.fillManualFutureDate(2);

    // Raw Material Selection
    await this.addProductButton.click();
    await this.page.waitForTimeout(500);
    await this.addProductButton.click();

    await this.productDropdownInput.click();
    await this.searchMoreLink.waitFor({ state: 'visible' });
    await this.searchMoreLink.click();

    await this.searchDropdownToggler.click();
    await this.rawMaterialsCheckbox.click();
    await this.searchProductBanner.click({ force: true });
    await this.adhesiveText.click();
    await this.firstProductDataCell.click();

    await this.firstQuantityInput.waitFor({ state: 'visible' });
    await this.firstQuantityInput.click();
    await this.firstQuantityInput.fill('2');
    await this.firstQuantityInput.press('Enter');

    // Consumable Selection
    await this.addProductButton.click();
    await this.page.waitForTimeout(500);
    await this.addProductButton.click();

    const lastProductInput = this.page.locator('td.o_field_cell.o_many2one_avatar_user_cell, div[name="product_id"] input, td[name="product_id"]').last();
    await lastProductInput.click();

    await this.searchMoreLink.waitFor({ state: 'visible' });
    await this.searchMoreLink.click();

    await this.searchDropdownToggler.click();
    await this.consumableText.click();

    await this.unitText.waitFor({ state: 'visible' });
    await this.unitText.click({ force: true });

    await this.commonConText.waitFor({ state: 'visible' });
    await this.commonConText.click({ force: true });

    await this.page.waitForTimeout(1000);

    await this.cutterThreadCell.scrollIntoViewIfNeeded();
    await this.cutterThreadCell.click({ force: true });

    await this.page.waitForTimeout(500);

    await this.secondQuantityInput.waitFor({ state: 'visible' });
    await this.secondQuantityInput.click();
    await this.secondQuantityInput.fill('4');
    await this.secondQuantityInput.press('Enter');

    // Confirm & Split Order Workflow
    await this.confirmOrderButton.click();
    await this.receiptButton.click();
    await this.splitButton.click();
    await this.todayCell.click();

    await this.chalanNoInput.click();
    await this.chalanNoInput.fill(this.getNextChalanNumber('ch'));

    await this.mrrDateInput.click();
    await this.mrrDateInput.fill(this.getTodayFormattedDate());
    await this.mrrDateInput.press('Enter');

    await this.currencyInput.click();
    await this.page.getByText('BDT', { exact: true }).first().click();

    await this.markAsTodoButton.click();

    await this.quantityCellFour.click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.type('2');
    await this.page.keyboard.press('Enter');

    await this.chalanNoInput.click();
    await this.chalanNoInput.fill(this.getNextChalanNumber('xch'));

    await this.validateButton.click();
    await this.createBackorderButton.click();
    await this.splitedReceiptsButton.click();
    await this.readyStatusText.click();

    await this.chalanNoInput.click();
    const newChalanNo = await this.incrementExistingChalanNo();
    await this.chalanNoInput.fill(newChalanNo);

    await this.validateButton.click();
    await this.splitedReceiptsButton.click();
  }

  async partialReceivedDoneByLCTC(lcPoNumber: string, prodNoSearchText: string) {
    await this.homeMenuButton.click();
    await this.purchaseMenuItem.click();
    await this.newButton.click();

    await this.vendorInput.click();
    await this.vendorInput.fill('kpst');
    await this.kpstVendorOption.click();

    await this.vendorReferenceInput.click();
    await this.vendorReferenceInput.fill('Outsole');

    await this.currencyInput.click();
    await this.usdCurrencyOption.click();

    await this.purchaseTypeSelect.selectOption({ label: 'Local' });

    await this.poOrderNoInput.click();
    await this.poOrderNoInput.fill(lcPoNumber);

    await this.saveManuallyButton.click();

    await this.addProductButton.click();
    await this.productDropdownInput.click();

    await this.searchMoreLink.waitFor({ state: 'visible' });
    await this.searchMoreLink.click();

    await this.searchInputBox.fill('T1464 Super lite gum');
    await this.searchProductResultLink.click();

    await this.tagsCellLocator.click();

    await this.firstQuantityInput.waitFor({ state: 'visible' });
    await this.firstQuantityInput.click();
    await this.firstQuantityInput.fill('4');
    await this.firstQuantityInput.press('Enter');

    await this.saveManuallyButton.click();

    await this.isSoleCheckbox.click();

    await this.addSoleSizeButton.click();

    await this.sizeVariantDropdown.selectOption({ label: 'Size 1' });

    await this.salesOrderSheetInput.click();
    await this.searchMoreLink.waitFor({ state: 'visible' });
    await this.searchMoreLink.click();

    await this.searchInputBox.fill(prodNoSearchText);

    const dynamicSearchLink = this.page.getByRole('link', { name: new RegExp(`Search Production No for:\\s*${prodNoSearchText}`, 'i') });
    await dynamicSearchLink.click();

    await this.recordSelectorCell.click();

    await this.selectButton.click();
    await this.loadButton.click();

    await this.outsoleLink.click();

    await this.confirmOrderButton.click();
    await this.receiveProductsButton.click();
    await this.splitButton.click();
    await this.emptyCellNth3.click();

    const dynamicChalanNo = this.getNextCHFormattedChalanNumber();
    await this.chalanNoInput.click();
    await this.chalanNoInput.fill(dynamicChalanNo);

    await this.mrrDateInput.click();
    await this.mrrDateInput.fill(this.getTodayFormattedDate());
    await this.mrrDateInput.press('Enter');

    await this.markAsTodoButton.click();

    await this.quantityCellThreeTwenty.click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.type('319');
    await this.page.keyboard.press('Enter');

    await this.validateButton.click();
    await this.createBackorderButton.click();
    await this.splitedReceiptsButton.click();
    await this.readyStatusText.click();
  }

  // NEW METHOD: LC Management & Partial Purchase Flow

  async createLCAndCompletePartialPurchase() {
    await this.page.pause();
    await this.homeMenuButton.click();
    await this.lcManagementMenuItem.click();
    await this.newButton.click();

    const copiedLcScttNo = this.getNextLCSCTTNumber();
    await this.lcScttNoInput.click();
    await this.lcScttNoInput.fill(copiedLcScttNo);

    await this.openingDateInput.click();
    await this.openingDateInput.fill(this.getFiveDaysAgoFormattedDate());
    await this.openingDateInput.press('Enter');

    await this.bankNameInput.click();
    await this.bankNameInput.fill('City Bank');

    await this.saveManuallyButton.click();

    await this.homeMenuButton.click();
    await this.purchaseMenuItem.click();

    await this.partialReceiveItemCell.click();

    await this.lcScttNoInput.click();
    await this.lcScttNoInput.fill(copiedLcScttNo);

    const dynamicInvoiceNo = this.getNextInvoiceNumber();
    await this.invoiceNoInput.click();
    await this.invoiceNoInput.fill(dynamicInvoiceNo);

    await this.receiveProductsButton.click();
    await this.readyStatusText.click();
    await this.validateButton.click();

    await this.purchaseMenuItem.click();
  }
}