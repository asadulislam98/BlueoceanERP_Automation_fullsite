import { expect, Page, Locator } from '@playwright/test';

export class ManufacturingPage {
    private readonly page: Page;

    // Centralized Locators
    private readonly homeMenuIcon: Locator;
    private readonly manufacturingMenu: Locator;
    private readonly searchBox: Locator;
    private readonly searchProdNoLink: Locator;
    private readonly createRequisitionBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        // Locators Mapping
        this.homeMenuIcon = page.getByTitle('Home Menu');
        
        // Strict mode violation এড়াতে .first() অথবা unique data selector ব্যবহার করা হয়েছে
        this.manufacturingMenu = page.getByRole('menuitem', { name: 'Manufacturing' }).first();
        
        this.searchBox = page.getByRole('searchbox', { name: 'Search...' });
        this.searchProdNoLink = page.getByRole('link', { name: /Search\s+Prod\s+No\s+for/i });
        this.createRequisitionBtn = page.getByRole('button', { name: 'Create Requisition', exact: true });
    }

    // Navigation Step: Home Menu -> Manufacturing Menu
    async navigateToManufacturing() {
        await this.homeMenuIcon.waitFor({ state: 'visible' });
        await this.homeMenuIcon.click();

        await this.manufacturingMenu.waitFor({ state: 'visible' });
        await this.manufacturingMenu.click();
    }

    // Search Step: Enter updated production number and filter
    async searchByLatestProductionNo(productionNo: string) {
        await this.searchBox.waitFor({ state: 'visible' });
        await this.searchBox.fill(productionNo);

        await this.searchProdNoLink.waitFor({ state: 'visible' });
        await this.searchProdNoLink.click();
    }

    // Dynamic Method: Matches Production No and clicks specified Operation cell
    async clickOperationCellForProduction(productionNo: string, operationLabel: string) {
        const targetRow = this.page.locator('tr').filter({
            has: this.page.getByRole('cell', { name: productionNo, exact: true })
        });

        const operationCell = targetRow.getByRole('cell', { name: operationLabel, exact: true });
        await operationCell.waitFor({ state: 'visible' });
        await operationCell.click();
    }

    // Action Step: Click Create Requisition button
    async clickCreateRequisition() {
        await this.createRequisitionBtn.waitFor({ state: 'visible' });
        await this.createRequisitionBtn.click();
    }

    // High Level Execution Flow for Manufacturing
    async finalizeWorkOrder(productionNo: string) {
        // Step 2 to 5: Home Menu -> Manufacturing -> Search
        await this.navigateToManufacturing();
        await this.searchByLatestProductionNo(productionNo);

        // --- 1. CUTTING FLOW ---
        await this.clickOperationCellForProduction(productionNo, 'Cutting');
        await this.clickCreateRequisition();

        // Navigate back and search for next operation
        await this.navigateToManufacturing();
        await this.searchByLatestProductionNo(productionNo);

        // --- 2. SEWING FLOW ---
        await this.clickOperationCellForProduction(productionNo, 'Sewing');
        await this.clickCreateRequisition();

        // Navigate back and search for final operation
        await this.navigateToManufacturing();
        await this.searchByLatestProductionNo(productionNo);

        // --- 3. LASTING FLOW ---
        await this.clickOperationCellForProduction(productionNo, 'Lasting');
        await this.clickCreateRequisition();
    }
}