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
    this.homeMenuIcon = page.getByTitle('Home Menu');
    
    // Fixed strict mode violation by enforcing .first() selection
    this.manufacturingMenu = page.getByRole('menuitem', { name: 'Manufacturing' }).first();
    
    this.searchBox = page.getByRole('searchbox', { name: 'Search...' });
    this.searchProdNoLink = page.getByRole('link', { name: /Search\s+Prod\s+No\s+for/i });
    this.cuttingCell = page.getByRole('cell', { name: 'Cutting', exact: true });
    this.sewingCell = page.getByRole('cell', { name: 'Sewing', exact: true });
    this.lastingCell = page.getByRole('cell', { name: 'Lasting', exact: true });
    this.updateBomButton = page.getByRole('button', { name: 'Update BoM' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
    this.produceAllButton = page.getByRole('button', { name: 'Produce All' });
  }

  async clickHomeMenu() {
    await this.homeMenuIcon.click();
  } 

  async clickManufacturing() {
    await this.manufacturingMenu.click();
  }
 
  async searchByProductionNo(productionNo: string) {
    await this.searchBox.waitFor({ state: 'visible' });
    await this.searchBox.fill(productionNo);
    await this.searchProdNoLink.waitFor({ state: 'visible' });
    await this.searchProdNoLink.click();
    await this.page.waitForTimeout(1500); 
  }

  async executeProduceAllWorkflow() {
    await this.updateBomButton.waitFor({ state: 'visible' });
    await this.updateBomButton.click();
    await this.page.waitForTimeout(1000); 

    await this.confirmButton.waitFor({ state: 'visible' });
    await this.confirmButton.click();
    await this.page.waitForTimeout(1000);

    await this.produceAllButton.waitFor({ state: 'visible' });
    await this.produceAllButton.click();
    await this.page.waitForTimeout(1500); 
  }

  async processCutting(productionNo: string) {
    await this.clickHomeMenu();
    await this.clickManufacturing();
    await this.searchByProductionNo(productionNo);
    await this.page.pause(); // Optional: Pause for debugging
    await this.cuttingCell.click();
    await this.executeProduceAllWorkflow();
  } 

  async processSewing(productionNo: string) {
    await this.clickHomeMenu();
    await this.clickManufacturing();
    await this.searchByProductionNo(productionNo);
    await this.sewingCell.click();
    await this.executeProduceAllWorkflow();
  }

  async processLasting(productionNo: string) {
    await this.clickHomeMenu();
    await this.clickManufacturing();
    await this.searchByProductionNo(productionNo);
    await this.lastingCell.click();
    await this.executeProduceAllWorkflow();
  }
} 

