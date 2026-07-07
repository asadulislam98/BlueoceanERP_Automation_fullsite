import { Page, Locator } from '@playwright/test';
import { generateProductionNo } from '../utils/prodNoGenerator';

export class SalesOrderSheetPage {
  private productionNo: string = '';
  private readonly page: Page;

  // Centralized Locators Definition
  private readonly homeMenuIcon: Locator;
  private readonly salesMenuItem: Locator;
  private readonly ordersButton: Locator;
  private readonly salesOrderSheetMenuItem: Locator;
  private readonly newButton: Locator;
  private readonly orderReferenceField: Locator;  
  private readonly specificOrderLink: Locator;
  private readonly productField: Locator;
  private readonly searchMoreLink: Locator;
  private readonly modalSearchInput: Locator;
  private readonly pairsField: Locator;
  private readonly stockNoField: Locator;
  private readonly colorField: Locator;
  private readonly articleNoField: Locator;
  private readonly lastField: Locator;
  private readonly sizeTypeDropdown: Locator;
  private readonly productionField: Locator;
  private readonly orderField: Locator;
  private readonly packingField: Locator;
  private readonly brandInput: Locator;
  private readonly dateField: Locator;
  private readonly patternCustomerField: Locator;
  private readonly outsoleField: Locator;
  private readonly genderDropdown: Locator;
  private readonly internalRefField: Locator;
  private readonly trackingNoField: Locator;
  private readonly sizeSpan: Locator;
  private readonly salesOrderSheetLink: Locator;
  private readonly searchBox: Locator;
  private readonly recordCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation & Global Actions
    this.homeMenuIcon = page.getByTitle('Home Menu');
    this.salesMenuItem = page.getByRole('menuitem', { name: 'Sales' });
    this.ordersButton = page.getByRole('button', { name: 'Orders' });
    this.salesOrderSheetMenuItem = page.getByRole('menuitem', { name: 'Sales Order Sheet' });
    this.newButton = page.getByRole('button', { name: 'New' });

    // Grid Form Fields (Optimized from dynamic nth referencing)
    this.orderReferenceField = page.getByRole('textbox').nth(1);
    this.specificOrderLink = page.getByRole('link', { name: 'S00193' });
    this.productField = page.getByRole('textbox').nth(2);
    this.searchMoreLink = page.getByRole('link', { name: 'Search More...' });
    this.modalSearchInput = page.locator('.modal-dialog input, .o_dialog input').first();
    
    this.pairsField = page.getByRole('textbox').nth(5);
    this.stockNoField = page.getByRole('textbox').nth(6);
    
    // this.colorField = page.getByRole('textbox').nth(8);
    // this.articleNoField = page.getByRole('textbox').nth(10);
    // this.lastField = page.getByRole('textbox').nth(11);

    this.colorField = page.locator("div[name='color'] input, td[name='color'] input").first();
    this.articleNoField = page.locator("div[name='article_no'] input, td[name='article_no'] input").first();
    this.lastField = page.locator("div[name='last'] input, td[name='last'] input").first();


    
    this.sizeTypeDropdown = page.getByRole('cell').filter({ hasText: 'MWXWN' }).locator('select');
    this.productionField = page.locator("div[name='prod_no'] input");
    
    // Column-wise Grid Layout Mappings
    this.orderField = page.locator('td:nth-child(16) > .o_field_widget > .o_input');
    this.packingField = page.locator('td:nth-child(17)').locator('.o_input');
    this.brandInput = page.locator('td:nth-child(18)').locator('input.o-autocomplete--input.o_input');
    this.dateField = page.locator('td:nth-child(19) > .o_field_widget > .d-flex > .o_input');
    this.patternCustomerField = page.locator('td:nth-child(20) > .o_field_widget > .o_input');
    this.outsoleField = page.locator('td:nth-child(21) > .o_field_widget > .o_input');
    this.genderDropdown = page.locator('td[name="gender"]').locator('select');
    this.internalRefField = page.locator('td:nth-child(23) > .o_field_widget > .o_input');
    this.trackingNoField = page.locator('td:nth-child(24) > .o_field_widget > .o_input');
    
    this.sizeSpan = page.locator('span:text-is("Size")').nth(0);
    this.salesOrderSheetLink = page.getByRole('link', { name: 'Sales Order Sheet' });
    this.searchBox = page.getByRole('searchbox', { name: 'Search...' });
    this.recordCheckbox = page.locator('.o_list_record_selector.user-select-none > .o-checkbox').first();
  }

  async openHomeMenu() { await this.homeMenuIcon.click(); }
  async openSalesMenu() { await this.salesMenuItem.click(); }
  async openOrders() { await this.ordersButton.click(); }
  async openSalesOrderSheet() { await this.salesOrderSheetMenuItem.click(); }
  async clickNewButton() { await this.newButton.click(); }

  async selectOrderReference() {
    await this.orderReferenceField.waitFor({ state: 'visible' });
    await this.orderReferenceField.click();
    await this.specificOrderLink.click();
  }

  async selectProduct() {
    await this.productField.click();
    await this.searchMoreLink.click();
    
    // Target and fill inside the active Odoo modal context safely
    await this.modalSearchInput.waitFor({ state: 'visible' });
    await this.modalSearchInput.fill('(S)-10*6MM HD-118 SEMI-MATTE ANTIQUE BLACK  EYELET');

    const productSearchLink = this.page.getByRole('link', { name: 'Search Product for: (S)-10*' });
    await productSearchLink.waitFor({ state: 'visible' });
    await productSearchLink.click();

    await this.page.getByRole('cell', {
      name: '(S)-10*6MM HD-118 SEMI-MATTE ANTIQUE BLACK EYELET',
      exact: true
    }).click();
  }

  async selectFobDateNextMonth15() {
    await this.page.getByRole('textbox').nth(4).click();
    await this.page.locator('.o_next').click();
    await this.page.getByRole('button', { name: '15', exact: true }).click();
  }

  async enterPairsValue() { await this.pairsField.fill('312'); }
  async enterStockNo() { await this.stockNoField.fill('P726179'); }
  async enterColor() { await this.colorField.fill('Black'); }
  async enterArticleNo() { await this.articleNoField.fill('CAT960-1A24S'); }
  async enterLast() { await this.lastField.fill('CAT960GH'); }
  async selectSizeType() { await this.sizeTypeDropdown.selectOption({ label: 'M' }); }

  async enterProductionNo() {
    await this.productionField.fill('14E09B011');
  }

  async enterDynamicProductionNo() {
    this.productionNo = generateProductionNo();
    await this.productionField.fill(this.productionNo);
    console.log(`Production No Used: ${this.productionNo}`);
  }

  async enterOrderNo() { await this.orderField.fill('FW26'); }
  async enterPacking() { await this.packingField.fill('Indonesia (PT TRANSMARCO)'); }

  async selectBrand() {
    await this.brandInput.click();
    await this.brandInput.press('ArrowDown');
    const brandItem = this.page.locator('.dropdown-item.ui-menu-item-wrapper', { hasText: 'Apex Footwear Limited ( Unit - 2 )' });
    await brandItem.waitFor({ state: 'visible' });
    await brandItem.click();
  }

  async selectReceiveDateNextMonth20() {
    await this.dateField.click();
    await this.page.locator('.o_next').click();
    await this.page.getByRole('button', { name: '20', exact: true }).click();
  }

  async enterPatternCustomer() { await this.patternCustomerField.fill('COLORADO 2.0 CHELSEA'); }
  async enterOutsole() { await this.outsoleField.fill('T1464'); }
  async selectGender() { await this.genderDropdown.selectOption({ label: "Men's" }); }
  async enterInternalReferenceNo() { await this.internalRefField.fill('4700621286.10'); }
  async enterTrackingNo() { await this.trackingNoField.fill('3109375'); }

  async clickOnSize() {
    await this.sizeSpan.waitFor({ state: 'visible' });
    await this.sizeSpan.click();
  }

  async fillQuantities() {
    // Process Cell 1
    const firstCell = this.page.getByRole('cell', { name: '0' }).first();
    await firstCell.click();
    await firstCell.locator('input, textbox').fill('100');
    await this.page.keyboard.press('Enter');
    await this.page.getByText('Close').click();

    // Process Cell 2
    const secondCell = this.page.getByRole('cell', { name: '0' }).nth(1);
    await secondCell.click();
    await secondCell.locator('input, textbox').fill('100');
    await this.page.keyboard.press('Enter');
    await this.page.getByText('Close').click();

    // Process Cell 3
    const thirdCell = this.page.getByRole('cell', { name: '0' }).nth(2);
    await thirdCell.click();
    await thirdCell.locator('input, textbox').fill('112');
    await this.page.keyboard.press('Enter');
  }

  async clickSalesOrderSheet() { await this.salesOrderSheetLink.click(); }

  async searchByProductionNo() {
    await this.searchBox.waitFor({ state: 'visible' });
    await this.searchBox.fill('14E09B011');
    await this.page.getByRole('link', { name: 'Search Production No for:' }).click();
  }

  async searchByDynamicProductionNo() {
    await this.searchBox.waitFor({ state: 'visible' });
    await this.searchBox.fill(this.productionNo);
    await this.page.getByRole('link', { name: 'Search Production No for:' }).click();
  }

  async selectCheckbox() {
    await this.recordCheckbox.click({ force: true });
  }

  // Common baseline workflow steps configuration
  private async fillCommonFormSteps() {
    await this.openHomeMenu();
    await this.openSalesMenu();
    await this.openOrders();
    await this.openSalesOrderSheet();
    await this.clickNewButton();
    await this.selectOrderReference();
    await this.selectProduct();
    await this.selectFobDateNextMonth15();
    await this.enterPairsValue();
    await this.enterStockNo();
    await this.enterColor();
    await this.enterArticleNo();
    await this.enterLast();
    await this.selectSizeType();
  }

  private async fillRemainingFormSteps() {
    await this.enterOrderNo();
    await this.enterPacking();
    await this.selectBrand();
    await this.selectReceiveDateNextMonth20();
    await this.enterPatternCustomer();
    await this.enterOutsole();
    await this.selectGender();
    await this.enterInternalReferenceNo();
    await this.enterTrackingNo();
    await this.clickOnSize();
    await this.fillQuantities();
    await this.clickSalesOrderSheet();
  }

  // Full Flow: Static Execution
  async navigateToSalesOrderSheet() {
    await this.fillCommonFormSteps();
    await this.enterProductionNo();
    await this.fillRemainingFormSteps();
    await this.searchByProductionNo();
    await this.selectCheckbox();
  }

  // Full Flow: Dynamic Production Code Execution
  async navigateToSalesOrderSheetWithDynamicProdNo() {
    await this.fillCommonFormSteps();
    await this.enterDynamicProductionNo();
    await this.fillRemainingFormSteps();
    await this.searchByDynamicProductionNo();
    await this.selectCheckbox();
  }
}

