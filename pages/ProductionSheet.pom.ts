import { expect, Page, Locator } from '@playwright/test';
import * as ExcelJS from 'exceljs';
import * as path from 'path';

export class ProductionSheetPage {
    private readonly page: Page;

    // Navigation Locators (Steps 2-5)
    private readonly homeMenuIcon: Locator;
    private readonly salesMenuItem: Locator;
    private readonly ordersButton: Locator;
    private readonly salesOrderSheetMenuItem: Locator;

    // Search & Production Sheet Locators
    private readonly searchBox: Locator;
    private readonly searchProductionNoLink: Locator;
    private readonly firstCell: Locator;
    private readonly productionSheetBtn: Locator;
    private readonly draftBtn: Locator; 

    // Sample Material Locators (Your Updated Exact Locators)
    private readonly sampleMaterialBtn: Locator;
    private readonly sampleMaterialDropdown: Locator;
    private readonly searchMoreLink: Locator;
    private readonly searchDropdown: Locator;
    private readonly addCustomFilter: Locator;
    private readonly idField: Locator;
    private readonly articleNoButton: Locator;
    private readonly articleNoInput: Locator;
    private readonly addButton: Locator;
    private readonly sampleCell: Locator;
    private readonly loadButton: Locator;

    // Bulk Operations & Finalizing Locators
    private readonly bulkUpdateButton: Locator;
    private readonly operationsDropdown: Locator;
    private readonly sequenceField: Locator;
    private readonly saveManuallyBtn: Locator;
    private readonly markDoneButton: Locator;
    private readonly OKButton: Locator;
    private readonly uncheckAllButton: Locator;
    private readonly createEmptyMOBtn: Locator; // Final Step Locator
    
    // Modal & Alert Controls
    private readonly updateButton: Locator;
    private readonly modalCloseButton: Locator;
    private readonly notificationCloseButton: Locator;
    private readonly checkboxSelector: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation Steps
        this.homeMenuIcon = page.getByTitle('Home Menu');
        this.salesMenuItem = page.getByRole('menuitem', { name: 'Sales' });
        this.ordersButton = page.getByRole('button', { name: 'Orders' });
        this.salesOrderSheetMenuItem = page.getByRole('menuitem', { name: 'Sales Order Sheet' });
        
        // Search Steps
        this.searchBox = page.getByRole('searchbox', { name: 'Search...' });
        this.searchProductionNoLink = page.getByRole('link', { name: 'Search Production No for:' });
        this.firstCell = page.getByRole('cell').first();
        this.productionSheetBtn = page.getByRole('button', { name: ' Production Sheet' });
        this.draftBtn = page.getByText('Draft');

        // Sample Material Locators
        this.sampleMaterialBtn = page.getByRole('button', { name: 'Sample Material' });
        this.sampleMaterialDropdown = page.getByRole('textbox', { name: 'Sample Material' });
        this.searchMoreLink = page.getByRole('link', { name: 'Search More...' });
        this.searchDropdown = page.locator('.dropdown-toggle.o_searchview_dropdown_toggler');
        this.addCustomFilter = page.getByRole('menuitem', { name: 'Add Custom Filter' });
        this.idField = page.getByText('ID', { exact: true });
        this.articleNoButton = page.getByRole('button', { name: 'Article No' });
        this.articleNoInput = page.locator('.o_tree_editor_editor.col.ps-0 > .o_input');
        this.addButton = page.getByRole('button', { name: 'Add', exact: true });
        this.sampleCell = page.getByRole('cell', { name: 'Sample' }).first();
        this.loadButton = page.getByRole('button', { name: 'Load', exact: true });

        // Bulk Operations & Finalizing Locators
        this.bulkUpdateButton = page.getByRole('button', { name: ' Bulk Update' });
        this.operationsDropdown = page.locator('#operations_0');
        this.sequenceField = page.getByRole('textbox', { name: 'Sequence' });
        this.saveManuallyBtn = page.getByRole('button', { name: 'Save manually' }); 
        this.markDoneButton = page.getByRole('button', { name: 'Mark Done' });
        this.OKButton = page.getByRole('button', { name: 'OK' });
        this.uncheckAllButton = page.getByRole('button', { name: ' Uncheck All' });
        this.createEmptyMOBtn = page.getByRole('button', { name: 'Create Empty Manufacture Order', exact: true });
        
        // Modal & Alert Controls
        this.updateButton = page.getByRole('button', { name: 'Update', exact: true });
        this.modalCloseButton = page.locator('[role="dialog"]').getByRole('button', { name: 'Close' });
        this.notificationCloseButton = page.getByRole('alert').getByRole('button', { name: 'Close' });

        // Checkbox Base Matrix Selector
        this.checkboxSelector = page.locator('.o_data_cell.cursor-pointer.o_field_cell.o_button_switch_cell');
    }

    // Helper: Reads Production No from cell A3 of Sale_Order_Size (2).xlsx
    private async getProductionNoFromExcel(): Promise<string> {
        const filePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        
        const worksheet = workbook.worksheets[0];
        const cellA3Value = worksheet.getCell('A3').value;
        
        const prodNo = cellA3Value ? String(cellA3Value).trim() : '';
        console.log(`Read Production No from Excel Cell A3: [${prodNo}]`);
        return prodNo;
    }

    // Sample Material Specific Steps (Using Updated Locators)
    async clickSampleMaterialDropdown() {
        await this.sampleMaterialDropdown.waitFor({ state: 'visible' });
        await this.sampleMaterialDropdown.click();
    }

    async clickSearchMore() {
        await this.searchMoreLink.waitFor({ state: 'visible' });
        await this.searchMoreLink.click();
    }

    async clickSearchDropdown() {
        await this.searchDropdown.waitFor({ state: 'visible' });
        await this.searchDropdown.click();
    }

    async clickAddCustomFilter() {
        await this.addCustomFilter.waitFor({ state: 'visible' });
        await this.addCustomFilter.click();
    }

    async clickIDField() {
        await this.idField.waitFor({ state: 'visible' });
        await this.idField.click();
    }

    async searchAndSelectArticleNo() {
        await this.articleNoButton.waitFor({ state: 'visible' });
        await this.articleNoButton.click();
    }

    async enterArticleNoValue() {
        await this.articleNoInput.waitFor({ state: 'visible' });
        await this.articleNoInput.fill('CAT784-1A22S'); // 
    }

    async clickAddButton() {
        await this.addButton.waitFor({ state: 'visible' });
        await this.addButton.click();
    }

    async clickSample() {
        await this.sampleCell.waitFor({ state: 'visible' });
        await this.sampleCell.click();
    }

    async clickLoadButton() {
        await this.loadButton.waitFor({ state: 'visible' });
        await this.loadButton.click();
    }

    // Bulk Operations Engine
    async processBulkOperation(firstIndex: number, secondIndex: number, operationLabel: string) {
        await this.checkboxSelector.nth(firstIndex).click();
        await this.checkboxSelector.nth(firstIndex).click();

        await this.checkboxSelector.nth(secondIndex).waitFor({ state: 'visible' });
        await this.checkboxSelector.nth(secondIndex).click();
        await this.checkboxSelector.nth(secondIndex).click();

        await this.bulkUpdateButton.waitFor({ state: 'visible' });
        await this.bulkUpdateButton.click();

        await this.operationsDropdown.waitFor({ state: 'visible' });
        await this.operationsDropdown.click();
        await this.operationsDropdown.selectOption({ label: operationLabel });

        await this.updateButton.waitFor({ state: 'visible' });
        await this.updateButton.click();

        await this.modalCloseButton.waitFor({ state: 'visible' });
        await this.modalCloseButton.click();

        await expect(this.page.getByText('2 records updated successfully.')).toBeVisible();

        await this.notificationCloseButton.waitFor({ state: 'visible' });
        await this.notificationCloseButton.click();

        await this.uncheckAllButton.waitFor({ state: 'visible' });
        await this.uncheckAllButton.click();
    }

    // Dynamic Looping Sequence Addition Engine
    async clickSequenceField() {
        const operations = ['Cutting', 'Sewing', 'Lasting'];

        for (const operation of operations) {
            await this.sequenceField.waitFor({ state: 'visible' });
            await this.sequenceField.click();
            await this.sequenceField.fill(operation);

            const suggestionLink = this.page.getByRole('link', { name: operation, exact: true });
            await suggestionLink.waitFor({ state: 'visible' });
            await suggestionLink.click();
        }
    }

    async clickSaveManually() {
        await this.saveManuallyBtn.waitFor({ state: 'visible' });
        await this.saveManuallyBtn.click();
    }

    async clickMarkDone() {
        await this.markDoneButton.waitFor({ state: 'visible' });
        await this.markDoneButton.click();
    }

    async clickOKButton() {
        await this.OKButton.waitFor({ state: 'visible' });
        await this.OKButton.click();
    }

    async clickCreateEmptyManufactureOrder() {
        await this.createEmptyMOBtn.waitFor({ state: 'visible' });
        await this.createEmptyMOBtn.click();
    }

    // Main Execution Flow
    async navigateToProductionSheet() {
        // Step 1 to Step 9 (Kept unchanged)
        
        await this.homeMenuIcon.click();
        await this.salesMenuItem.click();
        await this.ordersButton.click();
        await this.salesOrderSheetMenuItem.click();

        const prodNo = await this.getProductionNoFromExcel();
        await this.searchBox.waitFor({ state: 'visible' });
        await this.searchBox.fill(prodNo);

        await this.searchProductionNoLink.click();
        await this.firstCell.click();
        
        await this.productionSheetBtn.waitFor({ state: 'visible' });
        await this.productionSheetBtn.click();

        await this.draftBtn.waitFor({ state: 'visible' });
        await this.draftBtn.click();

        // Step 10: Click Sample Material Button (Kept unchanged)
        await this.sampleMaterialBtn.waitFor({ state: 'visible' });
        await this.sampleMaterialBtn.click();

        // Execution of steps structured using updated locators
        await this.clickSampleMaterialDropdown();
        await this.clickSearchMore();
        await this.clickSearchDropdown();
        await this.clickAddCustomFilter();
        await this.clickIDField();
        await this.searchAndSelectArticleNo();
        await this.enterArticleNoValue();
        await this.clickAddButton();
        await this.clickSample();
        await this.clickLoadButton();

        // Bulk Operations & Final Steps
        await this.processBulkOperation(2, 3, 'Cutting');   // Process Cutting
        await this.processBulkOperation(7, 8, 'Sewing'); // Process Sewing
        await this.processBulkOperation(34, 35, 'Lasting'); // Process Lasting

        await this.clickSequenceField();
        
        await this.clickSaveManually();
        await this.clickMarkDone();
        await this.clickOKButton();

        // Final Step: Click Create Empty Manufacture Order Button
        await this.clickCreateEmptyManufactureOrder();
    }
} 