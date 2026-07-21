import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { RequisitionPage } from '../pages/Requisition.pom'; 
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import * as path from 'path';

// Helper function to read login credentials from LoginInfo.xlsx
function getExcelCredentials() {
    const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
}

// Helper function to read Production No directly from Sale_Order_Size (2).xlsx (Cell A3)
async function getProductionNoFromExcel(): Promise<string> {
    const filePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.worksheets[0];
    const cellA3Value = worksheet.getCell('A3').value;
    return cellA3Value ? String(cellA3Value).trim() : '';
}

test.describe('E2E Production Materials Requisition Workflow Tests', () => {
    test.setTimeout(180000);

    let loginPage: LoginPage;
    let requisitionPage: RequisitionPage; 

    test.beforeEach(async ({ page }) => {
        await page.goto('/web/login');

        loginPage = new LoginPage(page);
        requisitionPage = new RequisitionPage(page); 

        // STEP 1: Perform Login using credentials
        const excelRows = getExcelCredentials();
        const validCredentials: any = excelRows[0];
        
        const email = validCredentials.Email || validCredentials.email;
        const password = validCredentials.Password || validCredentials.password;
        
        await loginPage.login(email, password);
        await expect(page).toHaveTitle('BOFL - My Dashboard');
    });
    
    test('Should successfully complete Requisitions and Validations using Excel Production No', async () => {
        // Read Updated Production No from Cell A3
        const currentProductionNo = await getProductionNoFromExcel();
        console.log(`Executing Requisition Workflow for Production No: [${currentProductionNo}]`);

        // STEP 2 to 7 and Validation Steps
        console.log(`Starting Issue Date Validation Check...`);
        await requisitionPage.verifyIssueDateSelection(currentProductionNo);

        console.log(`Starting Quantity Exceeded Negative Check...`);
        await requisitionPage.verifyQuantityExceededValidation(currentProductionNo);

        console.log(`Processing Cutting Department Requisition...`);
        await requisitionPage.processCuttingRequisition(currentProductionNo);

        console.log(`Processing Sewing Department Requisition...`);
        await requisitionPage.processSewingRequisition(currentProductionNo);
        
        console.log(`Processing Lasting Department Requisition...`);
        await requisitionPage.processLastingRequisition(currentProductionNo);

        console.log(`Production Materials Requisition Workflow Completed Successfully!`);
    });
});