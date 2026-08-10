// import { Page, Locator, expect } from '@playwright/test';
// import { LoginPage } from './Login.pom';
// import * as fs from 'fs';
// import * as path from 'path';

// export class ExportItemPage {
//     private readonly page: Page;
//     private readonly loginPage: LoginPage;

//     // Navigation Locators
//     private readonly homeMenuButton: Locator;
//     private readonly salesMenuItem: Locator;
//     private readonly ordersButton: Locator;
//     private readonly salesOrderSheetMenuItem: Locator;
//     private readonly searchBox: Locator;
//     private readonly searchProductionNoLink: Locator;
//     private readonly referenceCheckbox: Locator;

//     // Proforma Invoice (PI) Locators
//     private readonly createPIButton: Locator;
//     private readonly draftText: Locator;
//     private readonly piNoInput: Locator;
//     private readonly dateInput: Locator;
//     private readonly buyerInput: Locator;
//     private readonly notifyInput: Locator;
//     private readonly mensLeatherShoeLink: Locator;
//     private readonly floatWidgetInput: Locator;
//     private readonly paymentInput: Locator;
//     private readonly consigneeBankInput: Locator;
//     private readonly cityBankLink: Locator;
//     private readonly shipmentInput: Locator;
//     private readonly deliveryInput: Locator;
//     private readonly partialShipmentInput: Locator;
//     private readonly saveButton: Locator;

//     // Packing List & Production Sheet Locators
//     private readonly salesOrderSheetNavButton: Locator;
//     private readonly packingListButton: Locator;
//     private readonly productionNoInput: Locator;
//     private readonly productionSheetIdInput: Locator;
//     private readonly searchMoreLink: Locator;
//     private readonly catCell: Locator;
//     private readonly referenceButton: Locator;
//     private readonly generateWeightDetailsButton: Locator;
//     private readonly proformaInvoiceButton: Locator;
//     private readonly proformaInvoiceMenuItem: Locator;
//     private readonly createSaleOrderButton: Locator;

//     constructor(page: Page) {
//         this.page = page;
//         this.loginPage = new LoginPage(page);

//         // Navigation
//         this.homeMenuButton = page.getByTitle('Home Menu');
//         this.salesMenuItem = page.getByRole('menuitem', { name: 'Sales' });
//         this.ordersButton = page.getByRole('button', { name: 'Orders' });
//         this.salesOrderSheetMenuItem = page.getByRole('menuitem', { name: 'Sales Order Sheet' });
//         this.searchBox = page.getByRole('searchbox', { name: 'Search...' });
//         this.searchProductionNoLink = page.getByRole('link', { name: 'Search Production No for:' });
//         this.referenceCheckbox = page.getByRole('row', { name: 'Reference  Order Reference' }).getByLabel('', { exact: true });

//         // PI Form
//         this.createPIButton = page.getByRole('button', { name: 'Create PI' });
//         this.draftText = page.getByText('Draft');
//         this.piNoInput = page.getByRole('textbox', { name: 'PI No.' });
//         this.dateInput = page.getByRole('textbox', { name: 'Date' });
//         this.buyerInput = page.getByRole('textbox', { name: 'Buyer' });
//         this.notifyInput = page.getByRole('textbox', { name: 'Notify' });
//         this.mensLeatherShoeLink = page.getByRole('link', { name: "Men's Leather Shoe" });
//         this.floatWidgetInput = page.locator('.o_field_widget.o_field_float > .o_input').first();
//         this.paymentInput = page.getByRole('textbox', { name: 'Payment' });
//         this.consigneeBankInput = page.getByRole('textbox', { name: 'Consignee & Advising Bank' });
//         this.cityBankLink = page.getByRole('link', { name: 'THE CITY BANK LIMITED', exact: true });
//         this.shipmentInput = page.getByRole('textbox', { name: 'Shipment', exact: true });
//         this.deliveryInput = page.getByRole('textbox', { name: 'Delivery' });
//         this.partialShipmentInput = page.getByRole('textbox', { name: 'Partial Shipment &' });
//         this.saveButton = page.getByRole('button', { name: 'Save', exact: true }).or(page.locator('.o_form_button_save'));

//         // Packing List & Details
//         this.salesOrderSheetNavButton = page.getByRole('button', { name: ' Sales Order Sheet' });
//         this.packingListButton = page.getByRole('button', { name: ' Packing List' });
//         this.productionNoInput = page.getByRole('textbox', { name: 'Production No' });
//         this.productionSheetIdInput = page.getByRole('textbox', { name: 'Production Sheet ID' });
//         this.searchMoreLink = page.getByRole('link', { name: 'Search More...' });
//         this.catCell = page.getByRole('cell', { name: 'CAT', exact: true });
//         this.referenceButton = page.getByRole('button', { name: 'Reference' });
//         this.generateWeightDetailsButton = page.getByRole('button', { name: 'Generate Weight Details' });
//         this.proformaInvoiceButton = page.getByRole('button', { name: 'Proforma Invoice' });
//         this.proformaInvoiceMenuItem = page.getByRole('menuitem', { name: 'Proforma Invoice' });
//         this.createSaleOrderButton = page.getByRole('button', { name: 'Create Sale Order' });
//     }

//     // 1. Login
//     async performLogin(email: string, password: string) {
//         await this.loginPage.login(email, password);
//     }

//     // Helper: Dynamic PI Number Generator
//     private getNextPINumber(): string {
//         const counterFilePath = path.resolve(__dirname, '../pi_counter.json');
//         let counter = 1;

//         if (fs.existsSync(counterFilePath)) {
//             const data = fs.readFileSync(counterFilePath, 'utf-8');
//             const parsed = JSON.parse(data);
//             counter = parsed.counter || 1;
//         }

//         const formattedCounter = String(counter).padStart(3, '0');
//         const piNumber = `PI/CAT/SPAIN${formattedCounter}`;

//         fs.writeFileSync(counterFilePath, JSON.stringify({ counter: counter + 1 }), 'utf-8');
//         return piNumber;
//     }

//     // Helper: Date Formatter (MM/DD/YYYY)
//     private getTodayDateFormatted(): string {
//         const today = new Date();
//         const mm = String(today.getMonth() + 1).padStart(2, '0');
//         const dd = String(today.getDate()).padStart(2, '0');
//         const yyyy = today.getFullYear();
//         return `${mm}/${dd}/${yyyy}`;
//     }

//     // Helper: Future Date for Shipment (X/F Aug.20,2026 format)
//     private getFutureShipmentDateFormatted(daysToAdd: number = 10): string {
//         const date = new Date();
//         date.setDate(date.getDate() + daysToAdd);
//         const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//         const monthStr = months[date.getMonth()];
//         const dayStr = String(date.getDate()).padStart(2, '0');
//         const yearStr = date.getFullYear();
//         return `X/F ${monthStr}.${dayStr},${yearStr}`;
//     }

//     // Steps 1 to 44 Workflow Execution
//     async executeExportItemFlow(searchValueFromExcel: string) {

//         // Steps 1-3: Navigation
//         await this.homeMenuButton.click();
//         await this.salesMenuItem.click();
//         await this.ordersButton.click();
//         await this.salesOrderSheetMenuItem.click();

//         // Step 4-6: Search and Select Reference
//         await this.searchBox.click();
//         await this.searchBox.fill(searchValueFromExcel);
//         await this.searchProductionNoLink.click();
//         await this.referenceCheckbox.click();

//         // Steps 7-12: Create PI and Fill Details
//         await this.createPIButton.click();
//         await this.draftText.click();

//         const dynamicPINo = this.getNextPINumber();
//         console.log(`Generated PI Number: ${dynamicPINo}`);
//         await this.piNoInput.click();
//         await this.piNoInput.fill(dynamicPINo);

//         await this.dateInput.click();
//         await this.dateInput.fill(this.getTodayDateFormatted());

//         const buyerText = `GREEN LAND INTERNATIONAL LIMITED\nC/O NO.41-8 AN-HO ROAD,\nSHI-TUN DISTRICT,\nTAICHUNG TAIWAN, R.O.C.\nTEL: +886-4-23506088, FAX: +886-4-23506099.`;
//         await this.buyerInput.click();
//         await this.buyerInput.fill(buyerText);

//         const notifyText = `NOTIFY 1.:\t\n\tMEGA CHANCE (HONG KONG) LTD,\t\n\t6/F, THE EDGE, NOS. 30-34 KWAI WING ROAD, \t\n\tKWAI CHUNG, NEW TERRITORIES, HONG KONG. \t\n\tTEL :  852 39290616.`;
//         await this.notifyInput.click();
//         await this.notifyInput.fill(notifyText);

//         // Steps 13-15: Line items & Float Input
//         // Steps 13-15: Line items & Float Input
//         const descriptionCell = this.page.locator('td.o_data_cell[name="description"]').first();

//         // Click to activate edit mode inside the cell
//         await descriptionCell.click();

//         // Type into the active input field
//         const cellInput = descriptionCell.locator('input');
//         await cellInput.fill("Men's Leather Shoe");

//         // Select the item from the dropdown list
//         await this.page.getByText("Men's Leather Shoe", { exact: true }).first().click();

//         // Set the float input value
//         await this.floatWidgetInput.click();
//         await this.floatWidgetInput.fill('19');

//         // Steps 16-20: Payment, Bank & Shipment Info
//         await this.paymentInput.click();
//         await this.paymentInput.fill('T.T At 30 Days sight Payment');

//         await this.consigneeBankInput.click();
//         await this.cityBankLink.click();

//         const shipmentDate = this.getFutureShipmentDateFormatted(10);
//         await this.shipmentInput.click();
//         await this.shipmentInput.fill(shipmentDate);

//         await this.deliveryInput.click();
//         await this.deliveryInput.fill('SPAIN');

//         await this.partialShipmentInput.click();
//         await this.partialShipmentInput.fill('Allowed');

//         // Step 21: Save
//         if (await this.saveButton.isVisible()) {
//             await this.saveButton.click();
//         }

//         // Steps 22-24: Sales Order Sheet & Packing List
//         await this.salesOrderSheetNavButton.click();
//         await this.referenceCheckbox.click();
//         await this.packingListButton.click();

//         // Steps 25-27: Packing List Entry & Copy Production No
//         await this.page.getByRole('cell').nth(2).click();
//         await this.dateInput.click();
//         await this.dateInput.fill(this.getTodayDateFormatted());
//         await this.dateInput.press('Enter');

//         const productionNoValue = await this.productionNoInput.inputValue();
//         console.log(`Copied Production No: ${productionNoValue}`);

//         // Steps 28-32: Search Production Sheet ID
//         await this.productionSheetIdInput.click();
//         await this.searchMoreLink.click();
//         await this.searchBox.click();
//         await this.searchBox.fill(productionNoValue);
//         await this.searchProductionNoLink.click();
//         await this.catCell.click();


//         // Steps 33 Reference 
//         await this.referenceButton.click();
//         // Steps 34-36: Fill '6' in all 'prs_ctn' cells
//         const prsCtn = this.page.locator('td[name="prs_ctn"]');
//         const count = await prsCtn.count();

//         for (let i = 0; i < count; i++) {
//             const cell = prsCtn.nth(i);
//             await cell.click();

//             const cellInput = cell.locator('input');
//             if (await cellInput.isVisible({ timeout: 1000 }).catch(() => false)) {
//                 await cellInput.fill('6');
//                 await cellInput.press('Enter');
//             } else {
//                 // Fallback if the cell itself accepts input without an inner input tag
//                 await cell.type('6');
//             }
//         }

//         // Steps 37-40: Weight Details & Proforma Invoice
//         await this.generateWeightDetailsButton.click();
//         await this.proformaInvoiceButton.click();
//         await this.proformaInvoiceMenuItem.click();
//         await this.draftText.first().click();

//         // Steps 41-44: Final SO Creation
//         await this.salesOrderSheetNavButton.click();
//         await this.page.getByRole('cell').first().click();
//         await this.createSaleOrderButton.click();
//         await this.page.getByRole('cell', { name: 'CAT' }).click();
//         await this.page.pause(); // 
//     }
// } 



import { Page, Locator, expect } from '@playwright/test';
import { LoginPage } from './Login.pom';
import * as fs from 'fs';
import * as path from 'path';

export class ExportItemPage {
    private readonly page: Page;
    private readonly loginPage: LoginPage;

    // Navigation Locators
    private readonly homeMenuButton: Locator;
    private readonly salesMenuItem: Locator;
    private readonly ordersButton: Locator;
    private readonly salesOrderSheetMenuItem: Locator;
    private readonly searchBox: Locator;
    private readonly searchProductionNoLink: Locator;
    private readonly referenceCheckbox: Locator;

    // Proforma Invoice (PI) Locators
    private readonly createPIButton: Locator;
    private readonly draftText: Locator;
    private readonly piNoInput: Locator;
    private readonly dateInput: Locator;
    private readonly buyerInput: Locator;
    private readonly notifyInput: Locator;
    private readonly mensLeatherShoeLink: Locator;
    private readonly floatWidgetInput: Locator;
    private readonly paymentInput: Locator;
    private readonly consigneeBankInput: Locator;
    private readonly cityBankLink: Locator;
    private readonly shipmentInput: Locator;
    private readonly deliveryInput: Locator;
    private readonly partialShipmentInput: Locator;
    private readonly saveButton: Locator;

    // Packing List & Production Sheet Locators
    private readonly salesOrderSheetNavButton: Locator;
    private readonly packingListButton: Locator;
    private readonly productionNoInput: Locator;
    private readonly productionSheetIdInput: Locator;
    private readonly searchMoreLink: Locator;
    private readonly catCell: Locator;
    private readonly referenceButton: Locator;
    private readonly generateWeightDetailsButton: Locator;
    private readonly proformaInvoiceButton: Locator;
    private readonly proformaInvoiceMenuItem: Locator;
    private readonly createSaleOrderButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);

        // Navigation
        this.homeMenuButton = page.getByTitle('Home Menu');
        this.salesMenuItem = page.getByRole('menuitem', { name: 'Sales' });
        this.ordersButton = page.getByRole('button', { name: 'Orders' });
        this.salesOrderSheetMenuItem = page.getByRole('menuitem', { name: 'Sales Order Sheet' });
        this.searchBox = page.getByRole('searchbox', { name: 'Search...' });
        this.searchProductionNoLink = page.getByRole('link', { name: 'Search Production No for:' });
        this.referenceCheckbox = page.getByRole('row', { name: 'Reference  Order Reference' }).getByLabel('', { exact: true });

        // PI Form
        this.createPIButton = page.getByRole('button', { name: 'Create PI' });
        this.draftText = page.getByText('Draft');
        this.piNoInput = page.getByRole('textbox', { name: 'PI No.' });
        this.dateInput = page.getByRole('textbox', { name: 'Date' });
        this.buyerInput = page.getByRole('textbox', { name: 'Buyer' });
        this.notifyInput = page.getByRole('textbox', { name: 'Notify' });
        this.mensLeatherShoeLink = page.getByRole('link', { name: "Men's Leather Shoe" });
        this.floatWidgetInput = page.locator('.o_field_widget.o_field_float > .o_input').first();
        this.paymentInput = page.getByRole('textbox', { name: 'Payment' });
        this.consigneeBankInput = page.getByRole('textbox', { name: 'Consignee & Advising Bank' });
        this.cityBankLink = page.getByRole('link', { name: 'THE CITY BANK LIMITED', exact: true });
        this.shipmentInput = page.getByRole('textbox', { name: 'Shipment', exact: true });
        this.deliveryInput = page.getByRole('textbox', { name: 'Delivery' });
        this.partialShipmentInput = page.getByRole('textbox', { name: 'Partial Shipment &' });
        this.saveButton = page.getByRole('button', { name: 'Save', exact: true }).or(page.locator('.o_form_button_save'));

        // Packing List & Details
        this.salesOrderSheetNavButton = page.getByRole('button', { name: ' Sales Order Sheet' });
        this.packingListButton = page.getByRole('button', { name: ' Packing List' });
        this.productionNoInput = page.getByRole('textbox', { name: 'Production No' });
        this.productionSheetIdInput = page.getByRole('textbox', { name: 'Production Sheet ID' });
        this.searchMoreLink = page.getByRole('link', { name: 'Search More...' });
        this.catCell = page.getByRole('cell', { name: 'CAT', exact: true });
        this.referenceButton = page.getByRole('button', { name: 'Reference' });
        this.generateWeightDetailsButton = page.getByRole('button', { name: 'Generate Weight Details' });
        this.proformaInvoiceButton = page.getByRole('button', { name: 'Proforma Invoice' });
        this.proformaInvoiceMenuItem = page.getByRole('menuitem', { name: 'Proforma Invoice' });
        this.createSaleOrderButton = page.getByRole('button', { name: 'Create Sale Order' });
    }

    // 1. Login
    async performLogin(email: string, password: string) {
        await this.loginPage.login(email, password);
    }

    // Helper: Dynamic PI Number Generator
    private getNextPINumber(): string {
        const counterFilePath = path.resolve(__dirname, '../pi_counter.json');
        let counter = 1;

        if (fs.existsSync(counterFilePath)) {
            const data = fs.readFileSync(counterFilePath, 'utf-8');
            const parsed = JSON.parse(data);
            counter = parsed.counter || 1;
        }

        const formattedCounter = String(counter).padStart(3, '0');
        const piNumber = `PI/CAT/SPAIN${formattedCounter}`;

        fs.writeFileSync(counterFilePath, JSON.stringify({ counter: counter + 1 }), 'utf-8');
        return piNumber;
    }

    // Helper: Dynamic Commercial Invoice Number Generator (Starts from 45654601)
    private getNextCommercialInvoiceNo(): string {
        const counterFilePath = path.resolve(__dirname, '../ci_counter.json');
        let counter = 45654601;

        if (fs.existsSync(counterFilePath)) {
            const data = fs.readFileSync(counterFilePath, 'utf-8');
            const parsed = JSON.parse(data);
            counter = parsed.counter || 45654601;
        }

        fs.writeFileSync(counterFilePath, JSON.stringify({ counter: counter + 1 }), 'utf-8');
        return String(counter);
    }

    // Helper: Dynamic EXP Number Generator (Starts from 3544301)
    private getNextExpNo(): string {
        const counterFilePath = path.resolve(__dirname, '../exp_counter.json');
        let counter = 3544301;

        if (fs.existsSync(counterFilePath)) {
            const data = fs.readFileSync(counterFilePath, 'utf-8');
            const parsed = JSON.parse(data);
            counter = parsed.counter || 3544301;
        }

        fs.writeFileSync(counterFilePath, JSON.stringify({ counter: counter + 1 }), 'utf-8');
        return String(counter);
    }

    // Helper: Date Formatter (MM/DD/YYYY)
    private getTodayDateFormatted(): string {
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const yyyy = today.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    // Helper: Future Date Formatter (MM/DD/YYYY)
    private getFutureDateFormatted(daysToAdd: number = 10): string {
        const date = new Date();
        date.setDate(date.getDate() + daysToAdd);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    // Helper: Future Date for Shipment (X/F Aug.20,2026 format)
    private getFutureShipmentDateFormatted(daysToAdd: number = 10): string {
        const date = new Date();
        date.setDate(date.getDate() + daysToAdd);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthStr = months[date.getMonth()];
        const dayStr = String(date.getDate()).padStart(2, '0');
        const yearStr = date.getFullYear();
        return `X/F ${monthStr}.${dayStr},${yearStr}`;
    }

    // Steps 1 to 73 Workflow Execution
    async executeExportItemFlow(searchValueFromExcel: string) {

        // Steps 1-3: Navigation
        await this.homeMenuButton.click();
        await this.salesMenuItem.click();
        await this.ordersButton.click();
        await this.salesOrderSheetMenuItem.click();

        // Step 4-6: Search and Select Reference
        await this.searchBox.click();
        await this.searchBox.fill(searchValueFromExcel);
        await this.searchProductionNoLink.click();
        await this.referenceCheckbox.click();

        // Steps 7-12: Create PI and Fill Details
        await this.createPIButton.click();
        await this.draftText.click();

        const dynamicPINo = this.getNextPINumber();
        console.log(`Generated PI Number: ${dynamicPINo}`);
        await this.piNoInput.click();
        await this.piNoInput.fill(dynamicPINo);

        await this.dateInput.click();
        await this.dateInput.fill(this.getTodayDateFormatted());

        const buyerText = `GREEN LAND INTERNATIONAL LIMITED\nC/O NO.41-8 AN-HO ROAD,\nSHI-TUN DISTRICT,\nTAICHUNG TAIWAN, R.O.C.\nTEL: +886-4-23506088, FAX: +886-4-23506099.`;
        await this.buyerInput.click();
        await this.buyerInput.fill(buyerText);

        const notifyText = `NOTIFY 1.:\t\n\tMEGA CHANCE (HONG KONG) LTD,\t\n\t6/F, THE EDGE, NOS. 30-34 KWAI WING ROAD, \t\n\tKWAI CHUNG, NEW TERRITORIES, HONG KONG. \t\n\tTEL :  852 39290616.`;
        await this.notifyInput.click();
        await this.notifyInput.fill(notifyText);

        // Steps 13-15: Line items & Float Input
        const descriptionCell = this.page.locator('td.o_data_cell[name="description"]').first();

        // Click to activate edit mode inside the cell
        await descriptionCell.click();

        // Type into the active input field
        const cellInput = descriptionCell.locator('input');
        await cellInput.fill("Men's Leather Shoe");

        // Select the item from the dropdown list
        await this.page.getByText("Men's Leather Shoe", { exact: true }).first().click();

        // Set the float input value
        await this.floatWidgetInput.click();
        await this.floatWidgetInput.fill('19');

        // Steps 16-20: Payment, Bank & Shipment Info
        await this.paymentInput.click();
        await this.paymentInput.fill('T.T At 30 Days sight Payment');

        await this.consigneeBankInput.click();
        await this.cityBankLink.click();

        const shipmentDate = this.getFutureShipmentDateFormatted(10);
        await this.shipmentInput.click();
        await this.shipmentInput.fill(shipmentDate);

        await this.deliveryInput.click();
        await this.deliveryInput.fill('SPAIN');

        await this.partialShipmentInput.click();
        await this.partialShipmentInput.fill('Allowed');

        // Step 21: Save
        if (await this.saveButton.isVisible()) {
            await this.saveButton.click();
        }

        // Steps 22-24: Sales Order Sheet & Packing List
        await this.salesOrderSheetNavButton.click();
        await this.referenceCheckbox.click();
        await this.packingListButton.click();

        // Steps 25-27: Packing List Entry & Copy Production No
        await this.page.getByRole('cell').nth(2).click();
        await this.dateInput.click();
        await this.dateInput.fill(this.getTodayDateFormatted());
        await this.dateInput.press('Enter');

        const productionNoValue = await this.productionNoInput.inputValue();
        console.log(`Copied Production No: ${productionNoValue}`);

        // Steps 28-32: Search Production Sheet ID
        await this.productionSheetIdInput.click();
        await this.searchMoreLink.click();
        await this.searchBox.click();
        await this.searchBox.fill(productionNoValue);
        await this.searchProductionNoLink.click();
        await this.catCell.click();

        // Steps 33 Reference 
        await this.referenceButton.click();

        // Steps 34-36: Fill '6' in all 'prs_ctn' cells
        const prsCtn = this.page.locator('td[name="prs_ctn"]');
        const count = await prsCtn.count();

        for (let i = 0; i < count; i++) {
            const cell = prsCtn.nth(i);
            await cell.click();

            const cellInput = cell.locator('input');
            if (await cellInput.isVisible({ timeout: 1000 }).catch(() => false)) {
                await cellInput.fill('6');
                await cellInput.press('Enter');
            } else {
                // Fallback if the cell itself accepts input without an inner input tag
                await cell.type('6');
            }
        }

        // Steps 37-40: Weight Details & Proforma Invoice
        await this.generateWeightDetailsButton.click();
        await this.proformaInvoiceButton.click();
        await this.proformaInvoiceMenuItem.click();
        await this.draftText.first().click();

        // Steps 41-44: Final SO Creation
        await this.salesOrderSheetNavButton.click();
        await this.page.getByRole('cell').first().click();
        await this.createSaleOrderButton.click();
        await this.page.getByRole('cell', { name: 'CAT' }).click();
        await this.page.pause();

        // Steps 45-48: Sales Order Sheet Navigation & Commercial Invoice Setup
        await this.page.getByRole('link', { name: 'Sales Order Sheet' }).click();
        await this.page.getByRole('cell', { name: /^S\d+/ }).first().click(); // Dynamic S00205, S00206, etc.
        await this.page.getByRole('button', { name: 'Internal link' }).first().click();
        //click on the checkbox  
        const switchCell = this.page.locator('td[name="is_checked"]').first();
        await switchCell.click();
        const checkboxInput = switchCell.locator('input.form-check-input');
        await checkboxInput.check({ force: true });

        // Steps 49-50: Create Commercial Invoice
        await this.page.getByRole('button', { name: 'Create Commercial Invoice' }).click();
        await this.page.getByText('Draft').click();

        // Steps 51-52: Dynamic CI No & EXP No
        const dynamicCINo = this.getNextCommercialInvoiceNo();
        console.log(`Generated Commercial Invoice No: ${dynamicCINo}`);
        await this.page.getByRole('textbox', { name: 'Commercial Invoice No' }).fill(dynamicCINo);

        const dynamicExpNo = this.getNextExpNo();
        console.log(`Generated EXP No: ${dynamicExpNo}`);
        await this.page.getByRole('textbox', { name: 'EXP No' }).fill(dynamicExpNo);

        // Steps 53-54: Dates (10 days from today)
        const futureDate10Days = this.getFutureDateFormatted(10);
        await this.page.getByRole('textbox', { name: 'Commercial Invoice Date' }).fill(futureDate10Days);
        await this.page.getByRole('textbox', { name: 'EXP Date' }).fill(futureDate10Days);

        // Steps 55-60: Shipping & Weight Details
        await this.page.getByRole('textbox', { name: 'Shipped From' }).fill('chatrogram');
        await this.page.getByRole('textbox', { name: 'Shipped To' }).fill('SPAIN');
        await this.page.getByRole('textbox', { name: 'On Account and Risk of' }).fill('GREENLAND');
        await this.page.getByRole('textbox', { name: 'Total N.W.' }).fill('100');
        await this.page.getByRole('textbox', { name: 'Total G.W.' }).fill('150');
        await this.page.getByRole('textbox', { name: 'Total Vol.' }).fill('150');

        // Steps 61-63: Save & Mark Done
        await this.page.getByRole('button', { name: 'Save manually' }).click();
        await this.page.getByRole('button', { name: 'Mark Done' }).click();
        await this.page.getByRole('button', { name: 'Ok' }).click();

        // Step 64: Dynamic Sales Order Link (S00206, S00207, etc.)
        await this.page.getByRole('link', { name: /^S\d+/ }).first().click();

        // Steps 65-66: Confirm & Delivery
        await this.page.getByRole('button', { name: 'Confirm' }).click();
        await this.page.getByRole('button', { name: /Delivery/ }).click();

        // Steps 67-69: Fill Dates & Re-use Dynamic EXP No for Invoice No
        await this.page.getByRole('textbox', { name: 'Scheduled Date?' }).fill(this.getTodayDateFormatted());
        await this.page.getByRole('textbox', { name: 'Shipment Date' }).fill(this.getTodayDateFormatted());
        await this.page.getByRole('textbox', { name: 'Invoice No' }).fill(dynamicExpNo);

        // Step 70: Update 0.00 cell to 300
        const zeroCell = this.page.getByRole('cell', { name: '0.00', exact: true }).first();
        await zeroCell.click();
        const zeroCellInput = zeroCell.locator('input');
        if (await zeroCellInput.isVisible({ timeout: 1000 }).catch(() => false)) {
            await zeroCellInput.fill('300');
        } else {
            await zeroCell.type('300');
        }

        // Steps 71-73: Save, Validate & Complete Posting
        await this.page.getByRole('button', { name: 'Save manually' }).click();
        await this.page.getByRole('button', { name: 'Validate' }).click();
        await this.page.getByRole('button', { name: 'Backdated Posting' }).click();
        await this.page.getByRole('button', { name: 'Ok' }).click();


    }
}