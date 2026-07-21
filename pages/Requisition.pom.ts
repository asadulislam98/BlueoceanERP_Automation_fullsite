import { expect, Page, Locator } from '@playwright/test';

export class RequisitionPage {
    private readonly page: Page;

    // Centralized Locators
    private readonly homeMenuIcon: Locator;
    private readonly boflCustomMenu: Locator;
    private readonly requisitionSubMenu: Locator;
    private readonly productionMaterialsLink: Locator; 
    private readonly searchBox: Locator;
    private readonly searchProdNoLink: Locator;

    // Department Cells
    private readonly cuttingCell: Locator;
    private readonly sewingCell: Locator; 
    private readonly lastingCell: Locator; 

    // Form Action Buttons & Fields
    private readonly approveButton: Locator; 
    private readonly confirmButton: Locator; 
    private readonly sourceLocationField: Locator;
    private readonly sourceLocationOption: Locator;
    private readonly issueDateField: Locator;
    private readonly asPerRequisitionCell: Locator;
    
    // Grid Cells
    private readonly rowOneIssueCell: Locator;
    private readonly rowTwoIssueCell: Locator; 
    private readonly odooTodayCell: Locator;
    private readonly activeDropdownFirstOption: Locator;
    private readonly activeDropdownSecondOption: Locator; 
    private readonly rowTwoTargetCell: Locator;
    private readonly onHandHeader: Locator;

    constructor(page: Page) {
        this.page = page; 

        // Base Navigation Locators
        this.homeMenuIcon = page.getByTitle('Home Menu');
        this.boflCustomMenu = page.getByRole('menuitem', { name: 'BOFL Custom Module' }).first();
        this.requisitionSubMenu = page.getByRole('button', { name: 'Requisition' });
        this.productionMaterialsLink = page.getByRole('menuitem', { name: 'Production Materials' });
        this.searchBox = page.getByRole('searchbox', { name: 'Search...' });
        this.searchProdNoLink = page.getByRole('link', { name: /Search\s+Production\s+No\s+for/i });

        // Department Selection Cells
        this.cuttingCell = page.getByRole('cell', { name: 'Cutting', exact: true });
        this.sewingCell = page.getByRole('cell', { name: 'Sewing', exact: true }); 
        this.lastingCell = page.getByRole('cell', { name: 'Lasting', exact: true }); 
        
        // Form Action Buttons & Fields
        this.approveButton = page.getByRole('button', { name: 'Approve' }); 
        this.confirmButton = page.getByRole('button', { name: 'Confirm' }); 
        this.sourceLocationField = page.getByRole('textbox', { name: 'Source Location' });
        this.sourceLocationOption = page.getByRole('link', { name: 'WH/Accessories & Others' });
        this.issueDateField = page.getByRole('textbox', { name: 'Issue Date' });
        
        this.asPerRequisitionCell = page.getByRole('cell').nth(1);
        this.rowOneIssueCell = page.locator('tr.o_data_row').nth(0).locator('td[name="quantity_issue"], td[name="issue_qty"]').first();
        this.rowTwoIssueCell = page.locator('tr.o_data_row').nth(1).locator('td[name="quantity_issue"], td[name="issue_qty"]').first();
        this.odooTodayCell = page.locator('.o_date_picker td.today, .o_date_picker .o_today, .o_date_picker [data-action="selectToday"]');
        this.activeDropdownFirstOption = page.locator('a.dropdown-item.ui-menu-item-wrapper, ul.ui-autocomplete li a').first();
        this.activeDropdownSecondOption = page.locator('a.dropdown-item.ui-menu-item-wrapper, ul.ui-autocomplete li a').nth(1);
        this.rowTwoTargetCell = page.locator('tr.o_data_row').nth(1).locator('td[name="product"]');
        this.onHandHeader = page.getByRole('columnheader', { name: 'On Hand' });
    }

    // Helper Methods
    async clickHomeMenu() {
        await this.page.pause();
        await this.homeMenuIcon.waitFor({ state: 'visible' });
        await this.homeMenuIcon.click();
    }

    async clickBoflCustomModule() {
        await this.boflCustomMenu.waitFor({ state: 'visible' });
        await this.boflCustomMenu.click();
    }

    async clickRequisitionSubMenu() {
        await this.requisitionSubMenu.waitFor({ state: 'visible' });
        await this.requisitionSubMenu.click();
    }

    async clickProductionMaterials() {
        await this.productionMaterialsLink.waitFor({ state: 'visible' });
        await this.productionMaterialsLink.click();
    }

    async searchByProductionNo(productionNo: string) {
        await this.searchBox.waitFor({ state: 'visible' });
        await this.searchBox.fill(productionNo);
        await this.searchProdNoLink.waitFor({ state: 'visible' });
        await this.searchProdNoLink.click();
    }

    async clickCuttingCell() {
        await this.cuttingCell.waitFor({ state: 'visible' });
        await this.cuttingCell.click();
    }

    // ==========================================
    // VALIDATIONS
    // ==========================================
    async verifyIssueDateSelection(productionNo: string) {
        await this.clickHomeMenu();
        await this.clickBoflCustomModule();
        await this.clickRequisitionSubMenu();
        await this.clickProductionMaterials();
        await this.searchByProductionNo(productionNo);
        await this.clickCuttingCell();

        await this.sourceLocationField.click();
        await this.sourceLocationOption.click();
        await this.page.waitForTimeout(1000);

        const technicalModalClose = this.page.locator('.o_technical_modal button:has-text("Close"), .o_technical_modal .btn-primary').first();
        if (await technicalModalClose.isVisible()) {
            await technicalModalClose.click();
            await this.page.waitForTimeout(500);
        }

        await this.issueDateField.click({ force: true });
        await this.page.waitForSelector('.o_date_picker', { state: 'visible', timeout: 5000 });

        await this.page.locator('.o_next').click();
        await this.page.waitForTimeout(400);

        await this.page.getByRole('button', { name: '15', exact: true }).click();
        await this.page.waitForTimeout(500);
        
        await this.issueDateField.click({ force: true });
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(300);
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(800);

        const futureDateError = this.page.getByText('Issue date cannot be in the future.', { exact: true });
        await futureDateError.waitFor({ state: 'visible', timeout: 7000 });
        await expect(futureDateError).toBeVisible();

        console.log(`[Validation Check] Future date validation error message verified successfully.`);
        await this.page.getByText('Close', { exact: true }).click();
        await this.page.waitForTimeout(1500);
    }

    async verifyQuantityExceededValidation(productionNo: string) {
        await this.clickHomeMenu();
        await this.clickBoflCustomModule();
        await this.clickRequisitionSubMenu();
        await this.clickProductionMaterials();
        await this.searchByProductionNo(productionNo);
        await this.clickCuttingCell();

        await this.sourceLocationField.click();
        await this.sourceLocationOption.click();

        // 1. Click 'As Per Requisition' and select from dropdown to activate edit mode
        await this.asPerRequisitionCell.scrollIntoViewIfNeeded();
        await this.asPerRequisitionCell.click({ force: true });
        await this.page.waitForTimeout(300);
        await this.asPerRequisitionCell.dblclick({ force: true, delay: 10 });

        // Dropdown wait with fallback to prevent Timeout error
        try {
            await this.activeDropdownFirstOption.waitFor({ state: 'visible', timeout: 5000 });
            await this.activeDropdownFirstOption.click();
        } catch (error) {
            await this.page.keyboard.press('ArrowDown');
            await this.page.keyboard.press('Enter');
        }
        await this.page.waitForTimeout(800); 

        // 2. Dynamically discover the index of the 'On Hand' column header
        await this.onHandHeader.waitFor({ state: 'visible', timeout: 5000 });
        
        const thElements = await this.page.locator('thead tr th').all();
        let onHandIndex = -1;
        for (let i = 0; i < thElements.length; i++) {
            const text = await thElements[i].innerText();
            if (text.includes('On Hand')) {
                onHandIndex = i;
                break;
            }
        }

        // Fallback to standard Odoo column index if dynamic search fails
        if (onHandIndex === -1) {
            onHandIndex = 5; 
        }

        // Extract value text from the first data row's On Hand cell
        const targetOnHandCell = this.page.locator('tr.o_data_row').nth(0).locator('td').nth(onHandIndex);
        const onHandText = await targetOnHandCell.innerText();
        
        // Log the extracted On Hand value to the console
        console.log(`[Validation Check] getByRole('columnheader', { name: 'On Hand' }) 1st value is: ${onHandText}`);

        // Strip commas and convert the string into a floating-point number
        const onHandValue = parseFloat(onHandText.replace(/,/g, ''));

        // Calculate a value that exceeds the available stock by exactly 1 unit
        const exceededValue = Math.floor(onHandValue) + 1;
        console.log(`[Validation Check] Entering Calculated Exceeded Value into Issue Field: ${exceededValue}`);

        // 3. Click inside the specified target input element within the grid structure
        const targetIssueInput = this.page.locator('td:nth-child(7) > .o_field_widget > .o_input');
        await targetIssueInput.click({ force: true });
        await this.page.waitForTimeout(200);

        // Fully clear out the existing default cell value
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Meta+A');
        await this.page.keyboard.press('Backspace');
        await this.page.waitForTimeout(100);

        // 4. Type the computed exceeded numeric value into the field
        await this.page.keyboard.type(exceededValue.toString());
        await this.page.waitForTimeout(200);

        // 5. Press Enter to trigger Odoo's frontend validation constraint popup
        await this.page.keyboard.press('Enter');

        // 6. Assert the visibility of the "Quantity Exceeded!" validation modal title
        const modalHeading = this.page.getByRole('heading', { name: 'Quantity Exceeded!' });
        await modalHeading.waitFor({ state: 'visible', timeout: 7000 });
        await expect(modalHeading).toBeVisible();

        // 7. Click the 'Close' button to dismiss the validation alert dialog safely
        await this.page.getByText('Close').click();
        await this.page.waitForTimeout(2000); 
    }

    // ==========================================
    // REQUISITION FILL & PROCESS LOGIC
    // ==========================================
    async fillRequisitionDetails() {
        await this.sourceLocationField.click();
        await this.sourceLocationOption.click();

        await this.issueDateField.click();
        await this.page.waitForSelector('.o_date_picker', { state: 'visible', timeout: 5000 });

        if (await this.odooTodayCell.count() > 0) {
            await this.odooTodayCell.first().click();
        } else {
            await this.page.locator('.o_date_picker .o_datepicker_current, .o_date_picker [data-day="today"]').click();
        }
        await this.page.waitForTimeout(600);

        // Row 1
        await this.asPerRequisitionCell.scrollIntoViewIfNeeded();
        await this.asPerRequisitionCell.click({ force: true });
        await this.page.waitForTimeout(300);
        await this.asPerRequisitionCell.dblclick({ force: true, delay: 20 });

        try {
            await this.activeDropdownFirstOption.waitFor({ state: 'visible', timeout: 5000 });
            await this.activeDropdownFirstOption.click();
        } catch (error) {
            await this.page.keyboard.press('ArrowDown');
            await this.page.keyboard.press('Enter');
        }
        await this.page.waitForTimeout(600); 

        await this.rowOneIssueCell.click();
        await this.page.waitForTimeout(200);
        await this.page.keyboard.type('1');
        await this.page.keyboard.press('Enter'); 
        await this.page.waitForTimeout(1500); 

        // Row 2
        await this.rowTwoTargetCell.scrollIntoViewIfNeeded();
        await this.rowTwoTargetCell.click({ force: true });
        await this.page.waitForTimeout(300);
        await this.rowTwoTargetCell.dblclick({ force: true, delay: 20 });

        try {
            await this.activeDropdownSecondOption.waitFor({ state: 'visible', timeout: 5000 });
            await this.activeDropdownSecondOption.click();
        } catch (error) {
            await this.page.keyboard.press('ArrowDown');
            await this.page.keyboard.press('ArrowDown');
            await this.page.keyboard.press('Enter');
        }
        await this.page.waitForTimeout(1500);

        await this.rowTwoIssueCell.scrollIntoViewIfNeeded();
        await this.rowTwoIssueCell.click({ force: true });
        await this.page.waitForTimeout(300);
        await this.page.keyboard.type('1');
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(1500);

        // Confirm Actions
        await this.approveButton.click();
        await this.page.waitForTimeout(2000);
        await this.confirmButton.click();
        await this.page.waitForTimeout(1500);
    }

    async processCuttingRequisition(productionNo: string) {
        await this.clickHomeMenu();
        await this.clickBoflCustomModule();
        await this.clickRequisitionSubMenu();
        await this.clickProductionMaterials();
        await this.searchByProductionNo(productionNo);
        await this.clickCuttingCell(); 
        await this.fillRequisitionDetails();
    }

    async processSewingRequisition(productionNo: string) {
        await this.clickHomeMenu();
        await this.clickBoflCustomModule();
        await this.clickRequisitionSubMenu();
        await this.clickProductionMaterials();
        await this.searchByProductionNo(productionNo);
        await this.sewingCell.click(); 
        await this.fillRequisitionDetails();
    }

    async processLastingRequisition(productionNo: string) {
        await this.clickHomeMenu();
        await this.clickBoflCustomModule();
        await this.clickRequisitionSubMenu();
        await this.clickProductionMaterials();
        await this.searchByProductionNo(productionNo);
        await this.lastingCell.click(); 
        await this.fillRequisitionDetails();
    }
}