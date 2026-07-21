import { Page, Locator } from '@playwright/test';

export class FinishGoodsStockCheckPage {
  private readonly page: Page;
  private readonly homeMenuIcon: Locator;
  private readonly manufacturingMenu: Locator;
  private readonly removeFilterButton: Locator;
  private readonly searchBox: Locator;
  private readonly searchProdNoLink: Locator;
  private readonly lastingCell: Locator;
  private readonly catProductLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Locators defined based on provided sequence
    this.homeMenuIcon = page.getByTitle('Home Menu');
    this.manufacturingMenu = page.getByRole('menuitem', { name: 'Manufacturing' }).first();
    this.removeFilterButton = page.getByRole('button', { name: 'Remove' });
    this.searchBox = page.getByRole('searchbox', { name: 'Search...' });
    this.searchProdNoLink = page.getByRole('link', { name: /Search Prod No for:/i });
    this.lastingCell = page.getByRole('cell', { name: 'Lasting' });
    this.catProductLink = page.getByRole('link', { name: 'CAT_CAT784-' }).first();
  }

  // Step 2: Click Home Menu
  async clickHomeMenu() {
    await this.page.pause();
    await this.homeMenuIcon.waitFor({ state: 'visible', timeout: 10000 });
    await this.homeMenuIcon.click();
  }

  // Step 3: Click Manufacturing
  async clickManufacturing() {
    await this.manufacturingMenu.waitFor({ state: 'visible', timeout: 10000 });
    await this.manufacturingMenu.click();
  }

  // Step 4: Click Remove Button
  async clearExistingFilter() {
    await this.removeFilterButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.removeFilterButton.click();
  }

  // Step 5 & 6: Search using Production No from A3
  async searchByProductionNo(productionNo: string) {
    await this.searchBox.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchBox.fill(productionNo);
    await this.searchProdNoLink.click();
    await this.page.waitForTimeout(1500); // UI load-er jonno thama
  }

  // Step 7: Click Lasting Cell
  async clickLastingCell() {
    await this.lastingCell.waitFor({ state: 'visible', timeout: 10000 });
    await this.lastingCell.click();
  }

  // Step 8: Click CAT Product Link
  async clickCatProductLink() {
    await this.catProductLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.catProductLink.click();
  }

  // Combined execution flow for Finish Goods Stock Check
  async executeStockCheckSearch(productionNo: string) {
    await this.clickHomeMenu();
    await this.clickManufacturing();
    await this.clearExistingFilter();
    await this.searchByProductionNo(productionNo);
    await this.clickLastingCell();
    await this.clickCatProductLink();
  }
}

export default FinishGoodsStockCheckPage;