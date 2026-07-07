// import { expect, Page, Locator } from '@playwright/test';

// export class RequisitionPage {
//     private readonly page: Page;

//     // ==========================================
//     // CENTRALIZED LOCATORS DECLARATIONS
//     // ==========================================
//     private readonly homeMenuIcon: Locator;
//     private readonly boflCustomMenu: Locator;
//     private readonly requisitionSubMenu: Locator;
//     private readonly productionMaterialsLink: Locator; 
//     private readonly searchBox: Locator;
//     private readonly searchProdNoLink: Locator;
//     private readonly cuttingCell: Locator;
//     private readonly sewingCell: Locator; 
//     private readonly lastingCell: Locator; // ADDED: Lasting Cell Locator Declaration
//     private readonly approveButton: Locator; 
//     private readonly confirmButton: Locator; 

//     // Form Steps Locators
//     private readonly sourceLocationField: Locator;
//     private readonly sourceLocationOption: Locator;
//     private readonly issueDateField: Locator;
//     private readonly asPerRequisitionCell: Locator;
    
//     // Quantity/Issue Cell Locators
//     private readonly rowOneIssueCell: Locator;
//     private readonly rowTwoIssueCell: Locator; 

//     // Calendar Popover Today's Date Locator
//     private readonly odooTodayCell: Locator;

//     // Dropdown Option Locators
//     private readonly activeDropdownFirstOption: Locator;
//     private readonly activeDropdownSecondOption: Locator; 

//     // Row 2 Dynamic Locator
//     private readonly rowTwoTargetCell: Locator;

//     constructor(page: Page) {
//         this.page = page; 

//         // ==========================================
//         // ELEMENT MAPPINGS
//         // ==========================================
//         this.homeMenuIcon = page.getByTitle('Home Menu');
        
//         // FIXED: Added .first() to resolve strict mode violation with Odoo's top navbar brand element
//         this.boflCustomMenu = page.getByRole('menuitem', { name: 'BOFL Custom Module' }).first();
        
//         this.requisitionSubMenu = page.getByRole('button', { name: 'Requisition' });
//         this.productionMaterialsLink = page.getByRole('menuitem', { name: 'Production Materials' });
//         this.searchBox = page.getByRole('searchbox', { name: 'Search...' });
//         this.searchProdNoLink = page.getByRole('link', { name: /Search\s+Production\s+No\s+for/i });
        
//         // Department Selection Cells
//         this.cuttingCell = page.getByRole('cell', { name: 'Cutting', exact: true });
//         this.sewingCell = page.getByRole('cell', { name: 'Sewing', exact: true }); 
//         this.lastingCell = page.getByRole('cell', { name: 'Lasting', exact: true }); // FIXED/ADDED: Target Lasting Cell exactly
        
//         // Form Action Buttons
//         this.approveButton = page.getByRole('button', { name: 'Approve' }); 
//         this.confirmButton = page.getByRole('button', { name: 'Confirm' }); 

//         // Form Header Fields
//         this.sourceLocationField = page.getByRole('textbox', { name: 'Source Location' });
//         this.sourceLocationOption = page.getByRole('link', { name: 'WH/Accessories & Others' });
//         this.issueDateField = page.getByRole('textbox', { name: 'Issue Date' });
        
//         // Target the row's first structural cell (As Per Requisition) to trigger grid edit mode safely
//         this.asPerRequisitionCell = page.getByRole('cell').nth(1);
        
//         // UPDATED: ১ম রো-এর ভেতরে প্রথম '0.0000' সেলটিকে (Issue Column) সুনির্দিষ্টভাবে টার্গেট করা হয়েছে
//         this.rowOneIssueCell = page.locator('tr.o_data_row').nth(0).getByRole('cell', { name: '0.0000' }).first();

//         // FIXED: ২য় রো-এর ভেতরে প্রথম '0.0000' সেলটিকে (Issue Column) টার্গেট করা হয়েছে, যাতে On Hand বা Remarks-এ ক্লিক না পড়ে
//         this.rowTwoIssueCell = page.locator('tr.o_data_row').nth(1).getByRole('cell', { name: '0.0000' }).first();

//         // Target the cell highlighted as today inside Odoo's dynamic date picker container
//         this.odooTodayCell = page.locator('.o_date_picker td.today, .o_date_picker .o_today, .o_date_picker [data-action="selectToday"]');

//         // Target option list items inside open active dropdown menus
//         this.activeDropdownFirstOption = page.locator('a.dropdown-item.ui-menu-item-wrapper').first();
//         this.activeDropdownSecondOption = page.locator('a.dropdown-item.ui-menu-item-wrapper').nth(1);

//         // Strictly targeting only the product cell by its specific name attribute inside Row 2
//         this.rowTwoTargetCell = page.locator('tr.o_data_row').nth(1).locator('td[name="product"]');
//     }

//     // ==========================================
//     // BASIC ATOMIC ACTION METHODS
//     // ==========================================
//     async clickHomeMenu() {
//         await this.homeMenuIcon.click();
//     }

//     async clickBoflCustomModule() {
//         await this.boflCustomMenu.click();
//     }

//     async clickRequisitionSubMenu() {
//         await this.requisitionSubMenu.click();
//     }

//     async clickProductionMaterials() {
//         await this.productionMaterialsLink.click();
//     }

//     async searchByProductionNo(productionNo: string) {
//         await this.searchBox.fill(productionNo);
//         await this.searchProdNoLink.click();
//     }

//     async clickCuttingCell() {
//         await this.cuttingCell.click();
//     }

//     async clickSewingCell() {
//         await this.sewingCell.click();
//     }

//     async clickLastingCell() {
//         await this.lastingCell.click(); // ADDED: Method to click Lasting cell
//     }

//     // ==========================================
//     // CORE REQUISITION FORM FILLING LOGIC
//     // ==========================================
//     async fillRequisitionDetails() {
//         // Step 1: Click on Source Location field and select specified warehouse option
//         await this.sourceLocationField.click();
//         await this.sourceLocationOption.click();

//         // Step 2: Click Issue Date field to trigger and display the Odoo calendar popover overlay
//         await this.issueDateField.click();
//         await this.page.waitForSelector('.o_date_picker', { state: 'visible', timeout: 5000 });

//         if (await this.odooTodayCell.count() > 0) {
//             await this.odooTodayCell.first().click();
//         } else {
//             await this.page.locator('.o_date_picker .o_datepicker_current, .o_date_picker [data-day="today"]').click();
//         }
//         await this.page.waitForTimeout(600);

//         // ==========================================
//         // STEP A: ROW 1 PRODUCT SELECTION
//         // ==========================================
//         await this.asPerRequisitionCell.scrollIntoViewIfNeeded();
//         await this.asPerRequisitionCell.dblclick({ force: true, delay: 10 });
        
//         // Wait for active dropdown to render and select the first item
//         await this.activeDropdownFirstOption.waitFor({ state: 'visible', timeout: 5000 });
//         await this.activeDropdownFirstOption.click();
//         await this.page.waitForTimeout(600); 

//         // ==========================================
//         // STEP B: INPUT 1 IN ROW 1 ISSUE FIELD
//         // ==========================================
//         await this.rowOneIssueCell.click();
//         await this.page.waitForTimeout(200);
        
//         await this.page.keyboard.type('1');
//         await this.page.keyboard.press('Enter'); 
        
//         // CRITICAL TIME BUFFER: Give Odoo background workers enough time to complete row calculations
//         await this.page.waitForTimeout(1500); 

//         // ==========================================
//         // STEP C: ROW 2 PRODUCT SELECTION
//         // ==========================================
//         await this.rowTwoTargetCell.scrollIntoViewIfNeeded();
        
//         // First SINGLE CLICK to forcefully pull Odoo's focus to the second row explicitly
//         await this.rowTwoTargetCell.click({ force: true });
//         await this.page.waitForTimeout(300);
        
//         // Now trigger the DOUBLE CLICK to open the dropdown list safely
//         await this.rowTwoTargetCell.dblclick({ force: true, delay: 10 });

//         // Wait for Row 2's dropdown options to become fully visible
//         await this.activeDropdownSecondOption.waitFor({ state: 'visible', timeout: 5000 });
//         await this.activeDropdownSecondOption.click();
        
//         // Wait for Odoo to update the UI after row selection
//         await this.page.waitForTimeout(1500);

//         // ==========================================
//         // STEP D: INPUT 1 IN ROW 2 ISSUE FIELD (PREVENT ROW 3)
//         // ==========================================
//         await this.rowTwoIssueCell.scrollIntoViewIfNeeded();
//         await this.rowTwoIssueCell.click({ force: true });
//         await this.page.waitForTimeout(300);

//         // Type '1' into Row 2 Issue field
//         await this.page.keyboard.type('1');
        
//         // FIX: Press 'Tab' instead of 'Enter' to prevent Odoo from auto-generating an unwanted 3rd row
//         await this.page.keyboard.press('Tab');
        
//         // CRITICAL TIME BUFFER: Wait for the row save to complete entirely before clicking Approve
//         await this.page.waitForTimeout(1500);

//         // ==========================================
//         // STEP E: CLICK APPROVE BUTTON
//         // ==========================================
//         await this.approveButton.click();
//         await this.page.waitForTimeout(2000);

//         // ==========================================
//         // STEP F: CLICK CONFIRM BUTTON
//         // ==========================================
//         await this.confirmButton.click();
//         await this.page.waitForTimeout(1500);
//     }

//     // ==========================================
//     // ORCHESTRATOR METHODS FOR SPECIFIC SCENARIOS
//     // ==========================================
    
//     /**
//      * Scenario 1: Processes the materials requisition for the Cutting Department
//      */
//     async processCuttingRequisition(productionNo: string) {
//         await this.clickHomeMenu();
//         await this.clickBoflCustomModule();
//         await this.clickRequisitionSubMenu();
//         await this.clickProductionMaterials();
//         await this.searchByProductionNo(productionNo);
        
//         await this.clickCuttingCell(); 
//         await this.fillRequisitionDetails();
//     }

//     /**
//      * Scenario 2: Processes the materials requisition for the Sewing Department
//      */ 
//     async processSewingRequisition(productionNo: string) {
//         await this.clickHomeMenu();
//         await this.clickBoflCustomModule();
//         await this.clickRequisitionSubMenu();
//         await this.clickProductionMaterials();
//         await this.searchByProductionNo(productionNo);
        
//         await this.clickSewingCell(); 
//         await this.fillRequisitionDetails();
//     }

//     /**
//      * Scenario 3: Processes the materials requisition for the Lasting Department
//      */
//     async processLastingRequisition(productionNo: string) {
//         await this.clickHomeMenu();
//         await this.clickBoflCustomModule();
//         await this.clickRequisitionSubMenu();
//         await this.clickProductionMaterials();
//         await this.searchByProductionNo(productionNo);
//         //await this.page.pause();
//         await this.clickLastingCell(); // FIXED: Will click Lasting Department row
//         await this.fillRequisitionDetails();
//     }
// } 





import { expect, Page, Locator } from '@playwright/test';

export class RequisitionPage {
    private readonly page: Page;

    // ==========================================
    // CENTRALIZED LOCATORS DECLARATIONS
    // ==========================================
    private readonly homeMenuIcon: Locator;
    private readonly boflCustomMenu: Locator;
    private readonly requisitionSubMenu: Locator;
    private readonly productionMaterialsLink: Locator; 
    private readonly searchBox: Locator;
    private readonly searchProdNoLink: Locator;
    private readonly cuttingCell: Locator;
    private readonly sewingCell: Locator; 
    private readonly lastingCell: Locator; 
    private readonly approveButton: Locator; 
    private readonly confirmButton: Locator; 

    // Form Steps Locators
    private readonly sourceLocationField: Locator;
    private readonly sourceLocationOption: Locator;
    private readonly issueDateField: Locator;
    private readonly asPerRequisitionCell: Locator;
    
    // Quantity/Issue Cell Locators
    private readonly rowOneIssueCell: Locator;
    private readonly rowTwoIssueCell: Locator; 

    // Calendar Popover Today's Date Locator
    private readonly odooTodayCell: Locator;

    // Dropdown Option Locators
    private readonly activeDropdownFirstOption: Locator;
    private readonly activeDropdownSecondOption: Locator; 

    // Row 2 Dynamic Locator
    private readonly rowTwoTargetCell: Locator;

    constructor(page: Page) {
        this.page = page; 

        // ==========================================
        // ELEMENT MAPPINGS
        // ==========================================
        this.homeMenuIcon = page.getByTitle('Home Menu');
        
        // FIXED: Added .first() to resolve strict mode violation with Odoo's top navbar brand element
        this.boflCustomMenu = page.getByRole('menuitem', { name: 'BOFL Custom Module' }).first();
        
        this.requisitionSubMenu = page.getByRole('button', { name: 'Requisition' });
        this.productionMaterialsLink = page.getByRole('menuitem', { name: 'Production Materials' });
        this.searchBox = page.getByRole('searchbox', { name: 'Search...' });
        this.searchProdNoLink = page.getByRole('link', { name: /Search\s+Production\s+No\s+for/i });
        
        // Department Selection Cells
        this.cuttingCell = page.getByRole('cell', { name: 'Cutting', exact: true });
        this.sewingCell = page.getByRole('cell', { name: 'Sewing', exact: true }); 
        this.lastingCell = page.getByRole('cell', { name: 'Lasting', exact: true }); 
        
        // Form Action Buttons
        this.approveButton = page.getByRole('button', { name: 'Approve' }); 
        this.confirmButton = page.getByRole('button', { name: 'Confirm' }); 

        // Form Header Fields
        this.sourceLocationField = page.getByRole('textbox', { name: 'Source Location' });
        this.sourceLocationOption = page.getByRole('link', { name: 'WH/Accessories & Others' });
        this.issueDateField = page.getByRole('textbox', { name: 'Issue Date' });
        
        // Target the row's first structural cell (As Per Requisition) to trigger grid edit mode safely
        this.asPerRequisitionCell = page.getByRole('cell').nth(1);
        
        // UPDATED: ওডু গ্রিড রিফ্রেশ হলেও যেন নির্দিষ্ট কলামে ক্লিক পড়ে, তাই টেক্সটের বদলে নাম (quantity_issue/issue_qty) ধরে টার্গেট করা হয়েছে
        this.rowOneIssueCell = page.locator('tr.o_data_row').nth(0).locator('td[name="quantity_issue"], td[name="issue_qty"]').first();

        // FIXED: ২য় রো-এর ওডু ফিল্ডের নাম সরাসরি টার্গেট করা হয়েছে, যাতে অন্য কোনো কলামের 0.0000 এ ভুল করে ক্লিক না পড়ে
        this.rowTwoIssueCell = page.locator('tr.o_data_row').nth(1).locator('td[name="quantity_issue"], td[name="issue_qty"]').first();

        // Target the cell highlighted as today inside Odoo's dynamic date picker container
        this.odooTodayCell = page.locator('.o_date_picker td.today, .o_date_picker .o_today, .o_date_picker [data-action="selectToday"]');

        // Target option list items inside open active dropdown menus
        this.activeDropdownFirstOption = page.locator('a.dropdown-item.ui-menu-item-wrapper').first();
        this.activeDropdownSecondOption = page.locator('a.dropdown-item.ui-menu-item-wrapper').nth(1);

        // Strictly targeting only the product cell by its specific name attribute inside Row 2
        this.rowTwoTargetCell = page.locator('tr.o_data_row').nth(1).locator('td[name="product"]');
    }

    // ==========================================
    // BASIC ATOMIC ACTION METHODS
    // ==========================================
    async clickHomeMenu() {
        await this.homeMenuIcon.click();
    }

    async clickBoflCustomModule() {
        await this.boflCustomMenu.click();
    }

    async clickRequisitionSubMenu() {
        await this.requisitionSubMenu.click();
    }

    async clickProductionMaterials() {
        await this.productionMaterialsLink.click();
    }

    async searchByProductionNo(productionNo: string) {
        await this.searchBox.fill(productionNo);
        await this.searchProdNoLink.click();
    }

    async clickCuttingCell() {
        await this.cuttingCell.click();
    }

    async clickSewingCell() {
        await this.sewingCell.click();
    }

    async clickLastingCell() {
        await this.lastingCell.click(); 
    }

    // ==========================================
    // CORE REQUISITION FORM FILLING LOGIC
    // ==========================================
    async fillRequisitionDetails() {
        // Step 1: Click on Source Location field and select specified warehouse option
        await this.sourceLocationField.click();
        await this.sourceLocationOption.click();

        // Step 2: Click Issue Date field to trigger and display the Odoo calendar popover overlay
        await this.issueDateField.click();
        await this.page.waitForSelector('.o_date_picker', { state: 'visible', timeout: 5000 });

        if (await this.odooTodayCell.count() > 0) {
            await this.odooTodayCell.first().click();
        } else {
            await this.page.locator('.o_date_picker .o_datepicker_current, .o_date_picker [data-day="today"]').click();
        }
        await this.page.waitForTimeout(600);

        // ==========================================
        // STEP A: ROW 1 PRODUCT SELECTION
        // ==========================================
        await this.asPerRequisitionCell.scrollIntoViewIfNeeded();
        await this.asPerRequisitionCell.dblclick({ force: true, delay: 10 });
        
        // Wait for active dropdown to render and select the first item
        await this.activeDropdownFirstOption.waitFor({ state: 'visible', timeout: 5000 });
        await this.activeDropdownFirstOption.click();
        await this.page.waitForTimeout(600); 

        // ==========================================
        // STEP B: INPUT 1 IN ROW 1 ISSUE FIELD
        // ==========================================
        await this.rowOneIssueCell.click();
        await this.page.waitForTimeout(200);
        
        await this.page.keyboard.type('1');
        await this.page.keyboard.press('Enter'); 
        
        // CRITICAL TIME BUFFER: Give Odoo background workers enough time to complete row calculations
        await this.page.waitForTimeout(1500); 

        // ==========================================
        // STEP C: ROW 2 PRODUCT SELECTION
        // ==========================================
        await this.rowTwoTargetCell.scrollIntoViewIfNeeded();
        
        // First SINGLE CLICK to forcefully pull Odoo's focus to the second row explicitly
        await this.rowTwoTargetCell.click({ force: true });
        await this.page.waitForTimeout(300);
        
        // Now trigger the DOUBLE CLICK to open the dropdown list safely
        await this.rowTwoTargetCell.dblclick({ force: true, delay: 10 });

        // Wait for Row 2's dropdown options to become fully visible
        await this.activeDropdownSecondOption.waitFor({ state: 'visible', timeout: 5000 });
        await this.activeDropdownSecondOption.click();
        
        // Wait for Odoo to update the UI after row selection
        await this.page.waitForTimeout(1500);

        // ==========================================
        // STEP D: INPUT 1 IN ROW 2 ISSUE FIELD (PREVENT ROW 3)
        // ==========================================
        await this.rowTwoIssueCell.scrollIntoViewIfNeeded();
        await this.rowTwoIssueCell.click({ force: true });
        await this.page.waitForTimeout(300);

        // Type '1' into Row 2 Issue field
        await this.page.keyboard.type('1');
        
        // FIX: Press 'Tab' instead of 'Enter' to prevent Odoo from auto-generating an unwanted 3rd row
        await this.page.keyboard.press('Tab');
        
        // CRITICAL TIME BUFFER: Wait for the row save to complete entirely before clicking Approve
        await this.page.waitForTimeout(1500);

        // ==========================================
        // STEP E: CLICK APPROVE BUTTON
        // ==========================================
        await this.approveButton.click();
        await this.page.waitForTimeout(2000);

        // ==========================================
        // STEP F: CLICK CONFIRM BUTTON
        // ==========================================
        await this.confirmButton.click();
        await this.page.waitForTimeout(1500);
    }

    // ==========================================
    // ORCHESTRATOR METHODS FOR SPECIFIC SCENARIOS
    // ==========================================
    
    /**
     * Scenario 1: Processes the materials requisition for the Cutting Department
     */
    async processCuttingRequisition(productionNo: string) {
        await this.clickHomeMenu();
        await this.clickBoflCustomModule();
        await this.clickRequisitionSubMenu();
        await this.clickProductionMaterials();
        await this.searchByProductionNo(productionNo);
        
        await this.clickCuttingCell(); 
        await this.fillRequisitionDetails();
    }

    /**
     * Scenario 2: Processes the materials requisition for the Sewing Department
     */ 
    async processSewingRequisition(productionNo: string) {
        await this.clickHomeMenu();
        await this.clickBoflCustomModule();
        await this.clickRequisitionSubMenu();
        await this.clickProductionMaterials();
        await this.searchByProductionNo(productionNo);
        
        await this.clickSewingCell(); 
        await this.fillRequisitionDetails();
    }

    /**
     * Scenario 3: Processes the materials requisition for the Lasting Department
     */
    async processLastingRequisition(productionNo: string) {
        await this.clickHomeMenu();
        await this.clickBoflCustomModule();
        await this.clickRequisitionSubMenu();
        await this.clickProductionMaterials();
        await this.searchByProductionNo(productionNo);
        
        await this.clickLastingCell(); 
        await this.fillRequisitionDetails();
    }
}