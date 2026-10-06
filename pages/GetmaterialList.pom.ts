// import { expect, Page, Locator } from '@playwright/test';
// import * as ExcelJS from 'exceljs';
// import * as path from 'path';

// export class GetMaterialListPage {
//     private readonly page: Page;

//     // Navigation Locators
//     private readonly homeMenuIcon: Locator;
//     private readonly salesMenuItem: Locator;
//     private readonly ordersButton: Locator;
//     private readonly salesOrderSheetMenuItem: Locator;

//     // Search & Selection Locators
//     private readonly searchBox: Locator;
//     private readonly searchProductionNoLink: Locator;
//     private readonly firstCell: Locator;
//     private readonly selectAllCheckbox: Locator;

//     // Production Sheet & Status Locators
//     private readonly productionSheetBtn: Locator;
//     private readonly draftBtn: Locator;

//     // Sample Material Locators
//     private readonly sampleMaterialBtn: Locator;
//     private readonly sampleMaterialDropdown: Locator;
//     private readonly searchMoreLink: Locator;
//     private readonly searchDropdown: Locator;
//     private readonly addCustomFilter: Locator;
//     private readonly idField: Locator;
//     private readonly articleNoButton: Locator;
//     private readonly articleNoInput: Locator;
//     private readonly addButton: Locator;
//     private readonly sampleCell: Locator;
//     private readonly loadButton: Locator;

//     // Bulk Operations & Final Actions Locators
//     private readonly bulkUpdateButton: Locator;
//     private readonly operationsDropdown: Locator;
//     private readonly sequenceField: Locator;
//     private readonly saveManuallyBtn: Locator;
//     private readonly markDoneButton: Locator;
//     private readonly OKButton: Locator;
//     private readonly uncheckAllButton: Locator;
//     private readonly createEmptyMOBtn: Locator;

//     // Modal & Alert Locators
//     private readonly updateButton: Locator;
//     private readonly modalCloseButton: Locator;
//     private readonly notificationCloseButton: Locator;
//     private readonly checkboxSelector: Locator;

//     // Packaging & Optional Columns Locators
//     private readonly optionalColumnsDropdown: Locator;
//     private readonly dividerCardboardCheckbox: Locator;
//     private readonly packingPaper1Checkbox: Locator;
//     private readonly packingPaper2Checkbox: Locator;
//     private readonly shoeLaceCells: Locator;
//     private readonly innerBoxCells: Locator;
//     private readonly outerCartonCells: Locator;

//     constructor(page: Page) {
//         this.page = page;

//         // Navigation Elements
//         this.homeMenuIcon = page.getByTitle('Home Menu');
//         this.salesMenuItem = page.getByRole('menuitem', { name: 'Sales' });
//         this.ordersButton = page.getByRole('button', { name: 'Orders' });
//         this.salesOrderSheetMenuItem = page.getByRole('menuitem', { name: 'Sales Order Sheet' });

//         // Search & Checkbox Elements
//         this.searchBox = page.getByRole('searchbox', { name: 'Search...' });
//         this.searchProductionNoLink = page.getByRole('link', { name: 'Search Production No for:' });
//         this.firstCell = page.getByRole('cell').first();
//         this.selectAllCheckbox = page.locator('th.o_list_record_selector input[type="checkbox"]');

//         // Production Sheet & Status Elements
//         this.productionSheetBtn = page.getByRole('button', { name: ' Production Sheet' });
//         this.draftBtn = page.getByText('Draft');

//         // Sample Material Elements
//         this.sampleMaterialBtn = page.getByRole('button', { name: 'Sample Material' });
//         this.sampleMaterialDropdown = page.getByRole('textbox', { name: 'Sample Material' });
//         this.searchMoreLink = page.getByRole('link', { name: 'Search More...' });
//         this.searchDropdown = page.locator('.dropdown-toggle.o_searchview_dropdown_toggler');
//         this.addCustomFilter = page.getByRole('menuitem', { name: 'Add Custom Filter' });
//         this.idField = page.getByText('ID', { exact: true });
//         this.articleNoButton = page.getByRole('button', { name: 'Article No' });
//         this.articleNoInput = page.locator('.o_tree_editor_editor.col.ps-0 > .o_input');
//         this.addButton = page.getByRole('button', { name: 'Add', exact: true });
//         this.sampleCell = page.getByRole('cell', { name: 'Sample' }).first();
//         this.loadButton = page.getByRole('button', { name: 'Load', exact: true });

//         // Bulk Operations & Final Action Elements
//         this.bulkUpdateButton = page.getByRole('button', { name: ' Bulk Update' });
//         this.operationsDropdown = page.locator('#operations_0');
//         this.sequenceField = page.getByRole('textbox', { name: 'Sequence' });
//         this.saveManuallyBtn = page.getByRole('button', { name: 'Save manually' });
//         this.markDoneButton = page.getByRole('button', { name: 'Mark Done' });
//         this.OKButton = page.getByRole('button', { name: 'OK' });
//         this.uncheckAllButton = page.getByRole('button', { name: ' Uncheck All' });
//         this.createEmptyMOBtn = page.getByRole('button', { name: 'Create Empty Manufacture Order', exact: true });

//         // Modal & Alert Controls
//         this.updateButton = page.getByRole('button', { name: 'Update', exact: true });
//         this.modalCloseButton = page.locator('[role="dialog"]').getByRole('button', { name: 'Close' });
//         this.notificationCloseButton = page.getByRole('alert').getByRole('button', { name: 'Close' });

//         // Checkbox Base Matrix Selector
//         this.checkboxSelector = page.locator('.o_data_cell.cursor-pointer.o_field_cell.o_button_switch_cell');

//         // Packaging & Optional Columns Locators
//         this.optionalColumnsDropdown = page.locator('.o-dropdown.dropdown.o_optional_columns_dropdown > .dropdown-toggle').first();
//         this.dividerCardboardCheckbox = page.locator('input[name="divider_cardboard"]');
//         this.packingPaper1Checkbox = page.locator('input[name="packing_paper_1"]');
//         this.packingPaper2Checkbox = page.locator('input[name="packing_paper_2"]');
//         this.shoeLaceCells = page.locator('td[name="shoe_lace"]');
//         this.innerBoxCells = page.locator('td[name="inner_box"]');
//         this.outerCartonCells = page.locator('td[name="outer_cartoon"]');
//     }

//     private async getProductionNoFromExcel(cellAddress: string): Promise<string> {
//         const filePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
//         const workbook = new ExcelJS.Workbook();
//         await workbook.xlsx.readFile(filePath);

//         const worksheet = workbook.worksheets[0];
//         const cellValue = worksheet.getCell(cellAddress).value;

//         const prodNo = cellValue ? String(cellValue).trim() : '';
//         console.log(`Fetched Production No from Cell ${cellAddress}: [${prodNo}]`);
//         return prodNo;
//     }

    
//     private async fillGridCell(cellLocator: Locator, index: number, value: string) {
//         const cell = cellLocator.nth(index);
//         await cell.waitFor({ state: 'visible' });
//         await cell.click();

//         const cellInput = cell.locator('input');
//         if (await cellInput.isVisible({ timeout: 1000 }).catch(() => false)) {
//             await cellInput.fill(value);
//         } else {
//             await this.page.keyboard.type(value);
//         }
//         await this.page.keyboard.press('Enter');
//     }

//     // Packaging & Material Configuration Actions
//     async configureMaterialDetails() {
//         await this.optionalColumnsDropdown.waitFor({ state: 'visible' });
//         await this.optionalColumnsDropdown.click();

//         await this.dividerCardboardCheckbox.check();
//         await this.packingPaper1Checkbox.check();
//         await this.packingPaper2Checkbox.check();

//         // Shoe Lace values
//         await this.fillGridCell(this.shoeLaceCells, 0, '50');
//         await this.fillGridCell(this.shoeLaceCells, 1, '40');
//         await this.fillGridCell(this.shoeLaceCells, 2, '30');

//         // Inner Box values
//         await this.fillGridCell(this.innerBoxCells, 0, '20');
//         await this.fillGridCell(this.innerBoxCells, 1, '10');
//         await this.fillGridCell(this.innerBoxCells, 2, '5');

//         // Outer Carton values
//         await this.fillGridCell(this.outerCartonCells, 0, '10');
//         await this.fillGridCell(this.outerCartonCells, 1, '15');
//         await this.fillGridCell(this.outerCartonCells, 2, '30');
//     }

//     // Helper Action Methods
//     async clickSampleMaterialDropdown() {
//         await this.sampleMaterialDropdown.waitFor({ state: 'visible' });
//         await this.sampleMaterialDropdown.click();
//     }

//     async clickSearchMore() {
//         await this.searchMoreLink.waitFor({ state: 'visible' });
//         await this.searchMoreLink.click();
//     }

//     async clickSearchDropdown() {
//         await this.searchDropdown.waitFor({ state: 'visible' });
//         await this.searchDropdown.click();
//     }

//     async clickAddCustomFilter() {
//         await this.addCustomFilter.waitFor({ state: 'visible' });
//         await this.addCustomFilter.click();
//     }

//     async clickIDField() {
//         await this.idField.waitFor({ state: 'visible' });
//         await this.idField.click();
//     }

//     async searchAndSelectArticleNo() {
//         await this.articleNoButton.waitFor({ state: 'visible' });
//         await this.articleNoButton.click();
//     }

//     async enterArticleNoValue() {
//         await this.articleNoInput.waitFor({ state: 'visible' });
//         await this.articleNoInput.fill('CAT784-1A22S');
//     }

//     async clickAddButton() {
//         await this.addButton.waitFor({ state: 'visible' });
//         await this.addButton.click();
//     }

//     async clickSample() {
//         await this.sampleCell.waitFor({ state: 'visible' });
//         await this.sampleCell.click();
//     }

//     async clickLoadButton() {
//         await this.loadButton.waitFor({ state: 'visible' });
//         await this.loadButton.click();
//     }

//     // Bulk Operation Helper Method
//     async processBulkOperation(firstIndex: number, secondIndex: number, operationLabel: string) {
//         await this.checkboxSelector.nth(firstIndex).click();
//         await this.checkboxSelector.nth(firstIndex).click();

//         await this.checkboxSelector.nth(secondIndex).waitFor({ state: 'visible' });
//         await this.checkboxSelector.nth(secondIndex).click();
//         await this.checkboxSelector.nth(secondIndex).click();

//         await this.bulkUpdateButton.waitFor({ state: 'visible' });
//         await this.bulkUpdateButton.click();

//         await this.operationsDropdown.waitFor({ state: 'visible' });
//         await this.operationsDropdown.click();
//         await this.operationsDropdown.selectOption({ label: operationLabel });

//         await this.updateButton.waitFor({ state: 'visible' });
//         await this.updateButton.click();

//         await this.modalCloseButton.waitFor({ state: 'visible' });
//         await this.modalCloseButton.click();

//         await expect(this.page.getByText('2 records updated successfully.')).toBeVisible();

//         await this.notificationCloseButton.waitFor({ state: 'visible' });
//         await this.notificationCloseButton.click();

//         await this.uncheckAllButton.waitFor({ state: 'visible' });
//         await this.uncheckAllButton.click();
//     }

//     // Sequence Handling Method
//     async clickSequenceField() {
//         const operations = ['Cutting', 'Sewing', 'Lasting'];

//         for (const operation of operations) {
//             await this.sequenceField.waitFor({ state: 'visible' });
//             await this.sequenceField.click();
//             await this.sequenceField.fill(operation);

//             const suggestionLink = this.page.getByRole('link', { name: operation, exact: true });
//             await suggestionLink.waitFor({ state: 'visible' });
//             await suggestionLink.click();
//         }
//     }

//     async clickSaveManually() {
//         await this.saveManuallyBtn.waitFor({ state: 'visible' });
//         await this.saveManuallyBtn.click();
//     }

//     async clickMarkDone() {
//         await this.markDoneButton.waitFor({ state: 'visible' });
//         await this.markDoneButton.click();
//     }

//     async clickOKButton() {
//         await this.OKButton.waitFor({ state: 'visible' });
//         await this.OKButton.click();
//     }

//     async clickCreateEmptyManufactureOrder() {
//         await this.createEmptyMOBtn.waitFor({ state: 'visible' });
//         await this.createEmptyMOBtn.click();
//     }

//     // Main Execution Flow
//     async executeGetMaterialListFlow() {
//         // Step 1: Initial Navigation
        
//         await this.homeMenuIcon.click();
        
//         await this.salesMenuItem.click();
//         await this.ordersButton.click();
//         await this.salesOrderSheetMenuItem.click();

//         // Step 2: Search using Excel Cell A11
//         const prodNoA11 = await this.getProductionNoFromExcel('A11');
//         await this.searchBox.waitFor({ state: 'visible' });
//         await this.searchBox.fill(prodNoA11);
//         await this.searchProductionNoLink.click();

//         // Step 3: Check checkbox & Click Production Sheet
//         await this.selectAllCheckbox.waitFor({ state: 'visible' });
//         await this.selectAllCheckbox.check();

//         await this.productionSheetBtn.waitFor({ state: 'visible' });
//         await this.productionSheetBtn.click();

//         // Step 4: Re-navigate to Sales Order Sheet
//         await this.ordersButton.click();
//         await this.salesOrderSheetMenuItem.click();

//         // Step 5: Search using Excel Cell A10
//         const prodNoA10 = await this.getProductionNoFromExcel('A10');
//         await this.searchBox.waitFor({ state: 'visible' });
//         await this.searchBox.fill(prodNoA10);
//         await this.searchProductionNoLink.click();

//         // Select first record
//         await this.firstCell.waitFor({ state: 'visible' });
//         await this.firstCell.click();

//         // Step 6: Go to Production Sheet again & Draft state
//         await this.productionSheetBtn.waitFor({ state: 'visible' });
//         await this.productionSheetBtn.click();

//         await this.draftBtn.waitFor({ state: 'visible' });
//         await this.draftBtn.click();

//         // Step 7: Sample Material Process
//         await this.sampleMaterialBtn.waitFor({ state: 'visible' });
//         await this.sampleMaterialBtn.click();

//         await this.clickSampleMaterialDropdown();
//         await this.clickSearchMore();
//         await this.clickSearchDropdown();
//         await this.clickAddCustomFilter();
//         await this.clickIDField();
//         await this.searchAndSelectArticleNo();
//         await this.enterArticleNoValue();
//         await this.clickAddButton();
//         await this.clickSample();
//         await this.clickLoadButton();

//         // Step 8: Bulk Operations
//         await this.processBulkOperation(2, 3, 'Cutting'); 
//         await this.processBulkOperation(7, 8, 'Sewing'); 
//         await this.processBulkOperation(34, 35, 'Lasting'); 

//         // Step 9: Sequence Handling
//         await this.clickSequenceField();

//         // Step 10: Configure Material & Packaging Details
//         await this.configureMaterialDetails();

//         // Step 11: Save and Complete
//         await this.clickSaveManually();
//         await this.clickMarkDone();
//         await this.clickOKButton();
//         //step12 

        

//     }
// } 

import { expect, Page, Locator } from '@playwright/test';
import * as ExcelJS from 'exceljs';
import * as path from 'path';

export class GetMaterialListPage {
    private readonly page: Page;

    // Navigation Locators
    private readonly homeMenuIcon: Locator;
    private readonly salesMenuItem: Locator;
    private readonly ordersButton: Locator;
    private readonly salesOrderSheetMenuItem: Locator;

    // Search & Selection Locators
    private readonly searchBox: Locator;
    private readonly searchProductionNoLink: Locator;
    private readonly firstCell: Locator;
    private readonly selectAllCheckbox: Locator;

    // Production Sheet & Status Locators
    private readonly productionSheetBtn: Locator;
    private readonly draftBtn: Locator;

    // Sample Material Locators
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

    // Bulk Operations & Final Actions Locators
    private readonly bulkUpdateButton: Locator;
    private readonly operationsDropdown: Locator;
    private readonly sequenceField: Locator;
    private readonly saveManuallyBtn: Locator;
    private readonly markDoneButton: Locator;
    private readonly OKButton: Locator;
    private readonly uncheckAllButton: Locator;
    private readonly createEmptyMOBtn: Locator;

    // Modal & Alert Locators
    private readonly updateButton: Locator;
    private readonly modalCloseButton: Locator;
    private readonly notificationCloseButton: Locator;
    private readonly checkboxSelector: Locator;

    // Packaging & Optional Columns Locators
    private readonly optionalColumnsDropdown: Locator;
    private readonly dividerCardboardCheckbox: Locator;
    private readonly packingPaper1Checkbox: Locator;
    private readonly packingPaper2Checkbox: Locator;
    private readonly shoeLaceCells: Locator;
    private readonly innerBoxCells: Locator;
    private readonly outerCartonCells: Locator;

    // Step 12 Locators
    private readonly boflCustomModuleMenuItem: Locator;
    private readonly productionSheetTopButton: Locator;
    private readonly productionSheetMenuItem: Locator;
    private readonly getMaterialListButton: Locator;
    private readonly modalProdNoInput: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation Elements
        this.homeMenuIcon = page.getByTitle('Home Menu');
        this.salesMenuItem = page.getByRole('menuitem', { name: 'Sales' });
        this.ordersButton = page.getByRole('button', { name: 'Orders' });
        this.salesOrderSheetMenuItem = page.getByRole('menuitem', { name: 'Sales Order Sheet' });

        // Search & Checkbox Elements
        this.searchBox = page.getByRole('searchbox', { name: 'Search...' });
        this.searchProductionNoLink = page.getByRole('link', { name: 'Search Production No for:' });
        this.firstCell = page.getByRole('cell').first();
        this.selectAllCheckbox = page.locator('th.o_list_record_selector input[type="checkbox"]');

        // Production Sheet & Status Elements
        this.productionSheetBtn = page.getByRole('button', { name: ' Production Sheet' });
        this.draftBtn = page.getByText('Draft');

        // Sample Material Elements
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

        // Bulk Operations & Final Action Elements
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

        // Packaging & Optional Columns Locators
        this.optionalColumnsDropdown = page.locator('.o-dropdown.dropdown.o_optional_columns_dropdown > .dropdown-toggle').first();
        this.dividerCardboardCheckbox = page.locator('input[name="divider_cardboard"]');
        this.packingPaper1Checkbox = page.locator('input[name="packing_paper_1"]');
        this.packingPaper2Checkbox = page.locator('input[name="packing_paper_2"]');
        this.shoeLaceCells = page.locator('td[name="shoe_lace"]');
        this.innerBoxCells = page.locator('td[name="inner_box"]');
        this.outerCartonCells = page.locator('td[name="outer_cartoon"]');

        // Step 12 Elements
        this.boflCustomModuleMenuItem = page.getByRole('menuitem', { name: 'BOFL Custom Module' });
        this.productionSheetTopButton = page.getByRole('button', { name: 'Production Sheet' });
        this.productionSheetMenuItem = page.getByRole('menuitem', { name: 'Production Sheet' });
        this.getMaterialListButton = page.getByRole('button', { name: ' Get Material List' });
        
        
        this.modalProdNoInput = page.locator('#prod_no_0').nth(1);
    }

    private async getProductionNoFromExcel(cellAddress: string): Promise<string> {
        const filePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.worksheets[0];
        const cellValue = worksheet.getCell(cellAddress).value;

        const prodNo = cellValue ? String(cellValue).trim() : '';
        console.log(`Fetched Production No from Cell ${cellAddress}: [${prodNo}]`);
        return prodNo;
    }

    private async fillGridCell(cellLocator: Locator, index: number, value: string) {
        const cell = cellLocator.nth(index);
        await cell.waitFor({ state: 'visible' });
        await cell.click();

        const cellInput = cell.locator('input');
        if (await cellInput.isVisible({ timeout: 1000 }).catch(() => false)) {
            await cellInput.fill(value);
        } else {
            await this.page.keyboard.type(value);
        }
        await this.page.keyboard.press('Enter');
    }

    // Packaging & Material Configuration Actions
    async configureMaterialDetails() {
        await this.optionalColumnsDropdown.waitFor({ state: 'visible' });
        await this.optionalColumnsDropdown.click();

        await this.dividerCardboardCheckbox.check();
        await this.packingPaper1Checkbox.check();
        await this.packingPaper2Checkbox.check();

        // Shoe Lace values
        await this.fillGridCell(this.shoeLaceCells, 0, '50');
        await this.fillGridCell(this.shoeLaceCells, 1, '40');
        await this.fillGridCell(this.shoeLaceCells, 2, '30');

        // Inner Box values
        await this.fillGridCell(this.innerBoxCells, 0, '20');
        await this.fillGridCell(this.innerBoxCells, 1, '10');
        await this.fillGridCell(this.innerBoxCells, 2, '5');

        // Outer Carton values
        await this.fillGridCell(this.outerCartonCells, 0, '10');
        await this.fillGridCell(this.outerCartonCells, 1, '15');
        await this.fillGridCell(this.outerCartonCells, 2, '30');
    }

    // Helper Action Methods
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
        await this.articleNoInput.fill('CAT784-1A22S');
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

    // Bulk Operation Helper Method
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

    // Sequence Handling Method
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
    async executeGetMaterialListFlow() {
        
        // Step 1: Initial Navigation
        await this.homeMenuIcon.click();
        await this.salesMenuItem.click();
        await this.ordersButton.click();
        await this.salesOrderSheetMenuItem.click();

        // Step 2: Search using Excel Cell A11
        const prodNoA11 = await this.getProductionNoFromExcel('A11');
        await this.searchBox.waitFor({ state: 'visible' });
        await this.searchBox.fill(prodNoA11);
        await this.searchProductionNoLink.click();

        // Step 3: Check checkbox & Click Production Sheet
        await this.selectAllCheckbox.waitFor({ state: 'visible' });
        await this.selectAllCheckbox.check();

        await this.productionSheetBtn.waitFor({ state: 'visible' });
        await this.productionSheetBtn.click();

        // Step 4: Re-navigate to Sales Order Sheet
        await this.ordersButton.click();
        await this.salesOrderSheetMenuItem.click();

        // Step 5: Search using Excel Cell A10
        const prodNoA10 = await this.getProductionNoFromExcel('A10');
        await this.searchBox.waitFor({ state: 'visible' });
        await this.searchBox.fill(prodNoA10);
        await this.searchProductionNoLink.click();

        // Select first record
        await this.firstCell.waitFor({ state: 'visible' });
        await this.firstCell.click();

        // Step 6: Go to Production Sheet again & Draft state
        await this.productionSheetBtn.waitFor({ state: 'visible' });
        await this.productionSheetBtn.click();

        await this.draftBtn.waitFor({ state: 'visible' });
        await this.draftBtn.click();

        // Step 7: Sample Material Process
        await this.sampleMaterialBtn.waitFor({ state: 'visible' });
        await this.sampleMaterialBtn.click();

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

        // Step 8: Bulk Operations
        await this.processBulkOperation(2, 3, 'Cutting'); 
        await this.processBulkOperation(7, 8, 'Sewing'); 
        await this.processBulkOperation(34, 35, 'Lasting'); 

        // Step 9: Sequence Handling
        await this.clickSequenceField();

        // Step 10: Configure Material & Packaging Details
        await this.configureMaterialDetails();

        // Step 11: Save and Complete
        await this.clickSaveManually();
        await this.clickMarkDone();
        await this.clickOKButton();

        // Step 12: BOFL Custom Module Navigation & Get Material List
        await this.homeMenuIcon.waitFor({ state: 'visible' });
        await this.homeMenuIcon.click();

        await this.boflCustomModuleMenuItem.waitFor({ state: 'visible' });
        await this.boflCustomModuleMenuItem.click();

        await this.productionSheetTopButton.waitFor({ state: 'visible' });
        await this.productionSheetTopButton.click();

        await this.productionSheetMenuItem.waitFor({ state: 'visible' });
        await this.productionSheetMenuItem.click();

        // Search with Production No from A11
        await this.searchBox.waitFor({ state: 'visible' });
        await this.searchBox.fill(prodNoA11);
        await this.searchProductionNoLink.click();

        // Click on the filtered record cell
        await this.firstCell.waitFor({ state: 'visible' });
        await this.firstCell.click();

        // Click Draft Status
        await this.draftBtn.waitFor({ state: 'visible' });
        await this.draftBtn.click();
        
        // Click Get Material List
        await this.getMaterialListButton.waitFor({ state: 'visible' });
        await this.getMaterialListButton.click();

        // Fill modal with Production No from A10 and Load
        await this.modalProdNoInput.waitFor({ state: 'visible' });
        await this.modalProdNoInput.fill(prodNoA10);

        await this.loadButton.waitFor({ state: 'visible' });
        await this.loadButton.click();
    }
}