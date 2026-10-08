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


 
    // VALIDATIONS for issue date (Strict Validation & UI Alert)
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

        // Dismiss technical modal if displayed
        const technicalModalClose = this.page.locator('.o_technical_modal button:has-text("Close"), .o_technical_modal .btn-primary').first();
        if (await technicalModalClose.isVisible()) {
            await technicalModalClose.click();
            await this.page.waitForTimeout(500);
        }

        // Open date picker popover and select 15th of next month
        await this.issueDateField.click({ force: true });
        await this.page.waitForSelector('.o_date_picker', { state: 'visible', timeout: 5000 });
        await this.page.locator('.o_next').click();
        await this.page.waitForTimeout(400);
        await this.page.getByRole('button', { name: '15', exact: true }).click();

        // -----------------------------------------------------------------
        // 1. CHECK IF POPUP IS DISPLAYED (IF NOT -> SHOW UI ALERT)
        // -----------------------------------------------------------------
        const expectedMessage = 'Issue date cannot be in the future.';
        const errorDialog = this.page.locator('.o_notification_content, .modal-body, .o_dialog_warning, [role="alert"]').first();

        try {
            await errorDialog.waitFor({ state: 'visible', timeout: 7000 });
        } catch (error) {
            const errorMessage = 'Validation Popup is not Displayed here for verify Issue date cannot be in the future.';

            // Display red alert message directly on browser UI
            await this.page.evaluate((msg) => {
                const alertDiv = document.createElement('div');
                alertDiv.id = 'playwright-custom-alert';
                alertDiv.innerText = msg;
                alertDiv.style.cssText = `
                    position: fixed;
                    top: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #d32f2f;
                    color: #ffffff;
                    padding: 20px 30px;
                    border-radius: 8px;
                    font-size: 18px;
                    font-weight: bold;
                    z-index: 999999;
                    box-shadow: 0px 8px 20px rgba(0,0,0,0.4);
                    border: 3px solid #ffffff;
                    text-align: center;
                `;
                document.body.appendChild(alertDiv);
            }, errorMessage);

            await this.page.waitForTimeout(3000);
            throw new Error(`\n${errorMessage}\n`);
        }

        // -----------------------------------------------------------------
        // 2. STRICT CHARACTER MATCHING (EVEN A DOT/SPACE MISMATCH WILL FAIL)
        // -----------------------------------------------------------------
        const actualMessage = (await errorDialog.textContent() || '').trim();

        console.log(`[UI Validation Check] Expected: "${expectedMessage}"`);
        console.log(`[UI Validation Check] Actual:   "${actualMessage}"`);

        expect(
            actualMessage, 
            `\n STRICT CHARACTER MISMATCH DETECTED!\nExpected: "${expectedMessage}"\nActual:   "${actualMessage}"\n`
        ).toBe(expectedMessage);

        console.log(`[Validation Check] Future date validation error message verified successfully with exact match.`);

        // Close the popup dialog
        const closeButton = this.page.getByText('Close', { exact: true });
        if (await closeButton.isVisible()) {
            await closeButton.click();
            await this.page.waitForTimeout(1000);
        }
    }
    // Validation for QuantityExceeded (With Custom UI Alert & Strict Character Matching)
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
        await this.asPerRequisitionCell.dblclick({ force: true, delay: 2 });

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

        // -----------------------------------------------------------------
        // 6. POPUP CHECK & STRICT CHARACTER MATCHING
        // -----------------------------------------------------------------
        const expectedHeading = 'Quantity Exceeded!';
        const modalHeading = this.page.locator('.modal-title, .o_dialog_warning h4, [role="dialog"] h4, .o_notification_title').first();

        // 6.1 Check if popup appears (If not -> Show Red UI Alert)
        try {
            await modalHeading.waitFor({ state: 'visible', timeout: 7000 });
        } catch (error) {
            const errorMessage = 'Validation Pop up Is not displayed for verify Quantity Exceeded! message.';

            // Inject Custom UI Banner directly onto the browser screen
            await this.page.evaluate((msg) => {
                const alertDiv = document.createElement('div');
                alertDiv.id = 'playwright-custom-alert';
                alertDiv.innerText = msg;
                alertDiv.style.cssText = `
                    position: fixed;
                    top: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #d32f2f;
                    color: #ffffff;
                    padding: 20px 30px;
                    border-radius: 8px;
                    font-size: 18px;
                    font-weight: bold;
                    z-index: 999999;
                    box-shadow: 0px 8px 20px rgba(0,0,0,0.4);
                    border: 3px solid #ffffff;
                    text-align: center;
                `;
                document.body.appendChild(alertDiv);
            }, errorMessage);

            // Wait 3 seconds to ensure visibility in video/screenshots
            await this.page.waitForTimeout(3000);

            throw new Error(`\n❌ ${errorMessage}\n`);
        }

        // 6.2 Strict Character Matching (100% Exact Match Check)
        const actualHeading = (await modalHeading.textContent() || '').trim();

        console.log(`[UI Validation Check] Expected: "${expectedHeading}"`);
        console.log(`[UI Validation Check] Actual:   "${actualHeading}"`);

        expect(
            actualHeading, 
            `\n STRICT CHARACTER MISMATCH DETECTED!\nExpected: "${expectedHeading}"\nActual:   "${actualHeading}"\n`
        ).toBe(expectedHeading);

        console.log(`[Validation Check] Quantity Exceeded error message verified successfully with exact match.`);

        // 7. Click the 'Close' button to dismiss the validation alert dialog safely
        const closeButton = this.page.getByText('Close', { exact: true });
        if (await closeButton.isVisible()) {
            await closeButton.click();
            await this.page.waitForTimeout(1000); 
        }
    }


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

        // Specified exact text input and option selection for Row 2
        const rowTwoProductText = '42"4MM HY-5473 咖啡豆色COFFEE BEAN 19-0915TPG+胡桃木色 WALNUT 18-1112TPG双色圆形鞋带';
        await this.page.keyboard.type(rowTwoProductText);
        await this.page.waitForTimeout(800);

        const targetOption = this.page.getByRole('link', { name: rowTwoProductText }).first();
        try {
            await targetOption.waitFor({ state: 'visible', timeout: 5000 });
            await targetOption.click();
        } catch (error) {
            await this.activeDropdownSecondOption.click();
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