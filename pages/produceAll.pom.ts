import { Page, Locator } from '@playwright/test';

export class ProduceAllPage {
  private readonly page: Page;
  private readonly homeMenuIcon: Locator;
  private readonly manufacturingMenu: Locator;
  private readonly searchBox: Locator;
  private readonly searchProdNoLink: Locator;
  private readonly cuttingCell: Locator;
  private readonly sewingCell: Locator;
  private readonly lastingCell: Locator;
  private readonly updateBomButton: Locator;
  private readonly confirmButton: Locator;
  private readonly produceAllButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Navigation elements
    this.homeMenuIcon = page.getByTitle('Home Menu');
    this.manufacturingMenu = page.getByRole('menuitem', { name: 'Manufacturing' }).first();
    this.searchBox = page.getByRole('searchbox', { name: 'Search...' });
    this.searchProdNoLink = page.getByRole('link', { name: /Search\s+Prod\s+No\s+for/i });
    
    // Department Selection Cells
    this.cuttingCell = page.getByRole('cell', { name: 'Cutting', exact: true });
    this.sewingCell = page.getByRole('cell', { name: 'Sewing', exact: true });
    this.lastingCell = page.getByRole('cell', { name: 'Lasting', exact: true });
    
    // Workflow Action Buttons
    this.updateBomButton = page.getByRole('button', { name: 'Update BoM' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
    this.produceAllButton = page.getByRole('button', { name: 'Produce All' });
  }

  // Click Home Menu
  async clickHomeMenu() {
    await this.homeMenuIcon.waitFor({ state: 'visible', timeout: 10000 });
    await this.homeMenuIcon.click();
  } 

  // Click Manufacturing Menu Item
  async clickManufacturing() {
    await this.manufacturingMenu.waitFor({ state: 'visible', timeout: 10000 });
    await this.manufacturingMenu.click();
  }
 
  // Fill production number into search box and search
  async searchByProductionNo(productionNo: string) {
    await this.searchBox.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchBox.fill(productionNo);
    
    await this.searchProdNoLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchProdNoLink.click();
    await this.page.waitForTimeout(1500);
  }

 // Action Sequence: Update BoM -> Confirm -> Quantity Adjustment & Save -> Produce All
  async executeProduceAllWorkflow() {
    await this.page.pause(); // Pause for debugging if needed
    await this.updateBomButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.updateBomButton.click();
    await this.page.waitForTimeout(1000); 

    await this.confirmButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.confirmButton.click();
    await this.page.waitForTimeout(1000);
    
    // Validation Check & Quantity Adjustment
    const qtyDisplayButton = this.page.getByRole('button', { name: '100.00' });
    await qtyDisplayButton.waitFor({ state: 'visible', timeout: 10000 });
    const buttonText = await qtyDisplayButton.textContent();
    const currentVal = buttonText ? parseFloat(buttonText.trim()) : 100.00;
    const newQty = (currentVal + 1).toString();

    // Type the incremented value into #qty_producing_0
    const qtyInput = this.page.locator('#qty_producing_0');
    await qtyInput.waitFor({ state: 'visible', timeout: 10000 });
    await qtyInput.fill(newQty);

    // Click Save manually button
    const saveManualButton = this.page.getByRole('button', { name: 'Save manually' });
    await saveManualButton.waitFor({ state: 'visible', timeout: 10000 });
    await saveManualButton.click();
    await this.page.waitForTimeout(1000);

    // Click Close button
    const closeButton = this.page.getByText('Close');
    await closeButton.waitFor({ state: 'visible', timeout: 10000 });
    await closeButton.click();
    await this.page.waitForTimeout(1000);

    await this.produceAllButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.produceAllButton.click();
    await this.page.waitForTimeout(1500); 
  }

  // Department Workflows
  async processCutting(productionNo: string) {
    await this.clickHomeMenu();
    await this.clickManufacturing();
    await this.searchByProductionNo(productionNo);
    await this.cuttingCell.waitFor({ state: 'visible', timeout: 10000 });
    await this.cuttingCell.click();
    await this.executeProduceAllWorkflow();
  } 

  async processSewing(productionNo: string) {
    await this.clickHomeMenu();
    await this.clickManufacturing();
    await this.searchByProductionNo(productionNo);
    await this.sewingCell.waitFor({ state: 'visible', timeout: 10000 });
    await this.sewingCell.click();
    await this.executeProduceAllWorkflow();
  }

  async processLasting(productionNo: string) {
    await this.clickHomeMenu();
    await this.clickManufacturing();
    await this.searchByProductionNo(productionNo);
    await this.lastingCell.waitFor({ state: 'visible', timeout: 10000 });
    await this.lastingCell.click();
    await this.executeProduceAllWorkflow();
  }
}

// Default export added for maximum compatibility
export default ProduceAllPage;