import { expect, Page, Locator } from '@playwright/test';

export class ManufacturingPage {
    private readonly page: Page;

    // Centralized Locators Declarations
    private readonly createEmptyMOBtn: Locator;
    private readonly searchBox: Locator;
    private readonly searchProdNoLink: Locator;
    private readonly createRequisitionBtn: Locator;

    // New Navigation Locators
    private readonly homeMenuIcon: Locator;
    private readonly manufacturingMenu: Locator;

    constructor(page: Page) {
        this.page = page;

        // Element Mappings
        this.createEmptyMOBtn = page.getByRole('button', { name: 'Create Empty Manufacture Order', exact: true });
        this.searchBox = page.getByRole('searchbox', { name: 'Search...' });

        // RegEx used to handle split/bold HTML text structure safely inside Odoo search dropdown
        this.searchProdNoLink = page.getByRole('link', { name: /Search\s+Prod\s+No\s+for/i });
        this.createRequisitionBtn = page.getByRole('button', { name: 'Create Requisition', exact: true });

        // Fixed Navigation Elements Mapping
        this.homeMenuIcon = page.getByTitle('Home Menu');

        // Refactored to use a unique CSS selector targeting only the main app dashboard grid item, preventing strict mode violations caused by Odoo's duplicate navigation elements.
        this.manufacturingMenu = page.locator('a.o_app[data-menu-xmlid="mrp.menu_mrp_root"]');
    }

    // Action method to trigger Create Empty Manufacture Order
    async clickCreateEmptyManufactureOrder() {

        await this.createEmptyMOBtn.click();
    }

    // Input Production No into Searchbox and trigger Odoo search filter link
    async searchByLatestProductionNo(productionNo: string) {

        await this.searchBox.fill(productionNo);


        await this.searchProdNoLink.click();
    }

    // Dynamic Method: Matches Production No and clicks the specified Operation cell (Cutting/Sewing/Lasting)
    async clickOperationCellForProduction(productionNo: string, operationLabel: string) {
        // Find the specific row (tr) that contains your dynamic production number
        const targetRow = this.page.locator('tr').filter({
            has: this.page.getByRole('cell', { name: productionNo, exact: true })
        });

        // Isolate the specific operation cell (Cutting, Sewing, or Lasting) within that row
        const operationCell = targetRow.getByRole('cell', { name: operationLabel, exact: true });


        await operationCell.click();
    }

    // Action method to trigger Create Requisition btn
    async clickCreateRequisition() {

        await this.createRequisitionBtn.click();
    }

    // Navigation Method: Go back to Manufacturing module from Home Menu
    async navigateToManufacturingModuleAndSearch(productionNo: string) {
        // 1. Click Home Menu Icon

        await this.homeMenuIcon.click();


        // 2. Click Manufacturing Menu Item (Using unique data attribute to bypass strict mode violation)

        await this.manufacturingMenu.click();


        // 3. Paste the latest production number in the searchbox and trigger search

        await this.searchBox.fill(productionNo);


        await this.searchProdNoLink.click();

    }

    // High Level Main Automated Flow Control for Manufacturing
    async finalizeWorkOrder(productionNo: string) {
        // Step 1: Create the Empty MO
        await this.clickCreateEmptyManufactureOrder();


        // --- 1. CUTTING FLOW ---
        // Step 2: Search using the production number
        await this.searchByLatestProductionNo(productionNo);


        // Step 3: Click the Cutting operation cell
        await this.clickOperationCellForProduction(productionNo, 'Cutting');


        // Step 4: Click the Create Requisition button
        await this.clickCreateRequisition();


        // Step 5: Navigate back to Home -> Manufacturing and search again
        await this.navigateToManufacturingModuleAndSearch(productionNo);

        //await this.page.pause(); // Debugging pause to verify correct flow before proceeding to Sewing

        // --- 2. SEWING FLOW ---
        // Step 6: Click the Sewing operation cell
        await this.clickOperationCellForProduction(productionNo, 'Sewing');


        // Step 7: Click the Create Requisition button
        await this.clickCreateRequisition();


        // Step 8: Navigate back to Home -> Manufacturing and search again
        await this.navigateToManufacturingModuleAndSearch(productionNo);
        //await this.page.pause(); // Debugging pause to verify correct flow before proceeding to Lasting
        // --- 3. LASTING FLOW ---
        // Step 9: Click the Lasting operation cell
        await this.clickOperationCellForProduction(productionNo, 'Lasting');


        // Step 10: Click the Create Requisition button to complete the final flow
        await this.clickCreateRequisition();

    }
} 
