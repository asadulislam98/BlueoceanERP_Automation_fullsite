import { expect, Page, Locator } from '@playwright/test';

export class ProductionSheetPage {
    private readonly page: Page; 

    // Centralized Locators Declarations
    private readonly productionSheetBtn: Locator;
    private readonly customerCell: Locator;
    private readonly sampleMaterialBtn: Locator;
    private readonly sampleMaterialDropdown: Locator;
    private readonly searchMoreLink: Locator;
    private readonly searchDropdown: Locator;
    private readonly addCustomFilter: Locator;
    private readonly idField: Locator;
    private readonly searchBox: Locator;
    private readonly articleNoButton: Locator;
    private readonly articleNoInput: Locator;
    private readonly addButton: Locator;
    private readonly sampleCell: Locator;
    private readonly loadButton: Locator;
    private readonly bulkUpdateButton: Locator;
    private readonly operationsDropdown: Locator;
    private readonly updateButton: Locator;
    private readonly modalCloseButton: Locator;
    private readonly notificationCloseButton: Locator;
    private readonly uncheckAllButton: Locator;
    private readonly sequenceField: Locator;
    private readonly saveManuallyBtn: Locator;
    private readonly markDoneButton: Locator;
    private readonly OKButton: Locator;
    private readonly createEmptyMOBtn: Locator;
    private readonly checkboxSelector: Locator;

    constructor(page: Page) {
        this.page = page;

        // Element Mappings
        this.productionSheetBtn = page.getByRole('button', { name: ' Production Sheet' });
        this.customerCell = page.getByRole('cell', { name: 'Apex Footwear Limited ( Unit' }).first();
        this.sampleMaterialBtn = page.getByRole('button', { name: 'Sample Material' });
        this.sampleMaterialDropdown = page.getByRole('textbox', { name: 'Sample Material' });
        this.searchMoreLink = page.getByRole('link', { name: 'Search More...' });
        this.searchDropdown = page.locator('.dropdown-toggle.o_searchview_dropdown_toggler');
        this.addCustomFilter = page.getByRole('menuitem', { name: 'Add Custom Filter' });
        this.idField = page.getByText('ID', { exact: true });
        this.searchBox = page.getByRole('textbox', { name: 'Search...' });
        this.articleNoButton = page.getByRole('button', { name: 'Article No' });
        this.articleNoInput = page.locator('.o_tree_editor_editor.col.ps-0 > .o_input');
        this.addButton = page.getByRole('button', { name: 'Add', exact: true });
        this.sampleCell = page.getByRole('cell', { name: 'Sample' }).first();
        this.loadButton = page.getByRole('button', { name: 'Load', exact: true });
        this.bulkUpdateButton = page.getByRole('button', { name: ' Bulk Update' });
        this.operationsDropdown = page.locator('#operations_0');
        this.sequenceField = page.getByRole('textbox', { name: 'Sequence' });
        this.saveManuallyBtn = page.getByRole('button', { name: 'Save manually' }); 
        this.markDoneButton = page.getByRole('button', { name: 'Mark Done' });
        this.OKButton = page.getByRole('button', { name: 'OK' });
        this.uncheckAllButton = page.getByRole('button', { name: ' Uncheck All' });
        
        // Modal & Alert Controls
        this.updateButton = page.getByRole('button', { name: 'Update', exact: true });
        this.modalCloseButton = page.locator('[role="dialog"]').getByRole('button', { name: 'Close' });
        this.notificationCloseButton = page.getByRole('alert').getByRole('button', { name: 'Close' });

        // Checkbox Base Matrix Selector
        this.checkboxSelector = page.locator('.o_data_cell.cursor-pointer.o_field_cell.o_button_switch_cell');
    }

    async clickProductionSheet() {
        await this.productionSheetBtn.waitFor({ state: 'visible' });
        await this.productionSheetBtn.click();
    }

    async selectCustomer() {
        await this.customerCell.waitFor({ state: 'visible' });
        await this.customerCell.click();
    }

    async clickSampleMaterial() {
        await this.sampleMaterialBtn.waitFor({ state: 'visible' });
        await this.sampleMaterialBtn.click();
    }

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
        await this.searchBox.waitFor({ state: 'visible' });
        await this.searchBox.fill('Article No');
        await this.articleNoButton.waitFor({ state: 'visible' });
        await this.articleNoButton.click();
    }

    async enterArticleNoValue() {
        await this.articleNoInput.waitFor({ state: 'visible' });
        await this.articleNoInput.fill('CAT960-1A24S');
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

    async clickBulkUpdateButton() {
        await this.bulkUpdateButton.waitFor({ state: 'visible' });
        await this.bulkUpdateButton.click();
    }

    async clickUncheckAllButton() {
        await this.uncheckAllButton.waitFor({ state: 'visible' });
        await this.uncheckAllButton.click();
    }

    // Dynamic Centralized Method for Checkbox Multi-clicks & Operation Submission
    async processBulkOperation(firstIndex: number, secondIndex: number, operationLabel: string) {
        // Click first specified index twice
        await this.checkboxSelector.nth(firstIndex).click();
        await this.checkboxSelector.nth(firstIndex).click();

        // Click second specified index twice
        await this.checkboxSelector.nth(secondIndex).waitFor({ state: 'visible' });
        await this.checkboxSelector.nth(secondIndex).click();
        await this.checkboxSelector.nth(secondIndex).click();

        // Trigger bulk modification
        await this.clickBulkUpdateButton();

        // Select specific workflow operation dropdown item
        await this.operationsDropdown.waitFor({ state: 'visible' });
        await this.operationsDropdown.click();
        await this.operationsDropdown.selectOption({ label: operationLabel });

        // Save & Assert Notifications
        await this.updateButton.waitFor({ state: 'visible' });
        await this.updateButton.click();

        await this.modalCloseButton.waitFor({ state: 'visible' });
        await this.modalCloseButton.click();

        await expect(this.page.getByText('2 records updated successfully.')).toBeVisible();

        await this.notificationCloseButton.waitFor({ state: 'visible' });
        await this.notificationCloseButton.click();

        // Standard post-process cleanup reset
        await this.clickUncheckAllButton();
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

    // Action method to trigger manual save
    async clickSaveManually() {
        await this.saveManuallyBtn.waitFor({ state: 'visible' });
        await this.saveManuallyBtn.click();
    }


    //click Mark Done button 
    async clickMarkDone() {
        await this.markDoneButton.waitFor({ state: 'visible' });
        await this.markDoneButton.click();
    }
    //click ok button on alert      
    async clickOKButton() {
        await this.OKButton.waitFor({ state: 'visible' });
        await this.OKButton.click();
    }
    // // Action method to trigger Create Empty Manufacture Order
    // async clickCreateEmptyManufactureOrder() {
    //     await this.createEmptyMOBtn.waitFor({ state: 'visible' });
    //     await this.createEmptyMOBtn.click();
    // }

    // High Level Main Automated Flow Control
    async navigateToProductionSheet() {
        await this.clickProductionSheet();
        await this.selectCustomer();
        await this.clickSampleMaterial();
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

        // Executing Clean & Reusable Segmented Matrix Logic instead of copy-paste blocks
        await this.processBulkOperation(3, 4, 'Cutting');   // Process Cutting
        await this.processBulkOperation(11, 12, 'Sewing'); // Process Sewing
        await this.processBulkOperation(31, 33, 'Lasting'); // Process Lasting

        // Sequence Selection
        await this.clickSequenceField();
        
        // Triggering manual save operation
       
        await this.clickSaveManually();
        //await this.page.pause(); // Debug pause to review state before marking done
        await this.clickMarkDone();
        await this.clickOKButton();

        // //Work Order finalization (Uncomment if needed later)
        // await this.clickCreateEmptyManufactureOrder();
    }
}