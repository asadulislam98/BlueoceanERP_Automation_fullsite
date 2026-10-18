import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { ManufacturingPage } from '../pages/Manufacturing.pom';
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import * as path from 'path';

// Helper function to read login credentials from Excel
function getExcelCredentials() {
    const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
}

// Helper function to read Production No from Sale_Order_Size (2).xlsx (Cell A3)
async function getProductionNoFromExcel(): Promise<string> {
    const filePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.worksheets[0];
    const cellA3Value = worksheet.getCell('A3').value;
    return cellA3Value ? String(cellA3Value).trim() : '';
}

test.describe('E2E Manufacturing Workflow Tests', () => {
    test.setTimeout(180000);

    let loginPage: LoginPage;
    let manufacturingPage: ManufacturingPage;

    test.beforeEach(async ({ page }) => {
        await page.goto('/web/login');

        loginPage = new LoginPage(page);
        manufacturingPage = new ManufacturingPage(page);

        // Fetch credentials from LoginInfo.xlsx
        const excelRows = getExcelCredentials();
        const validCredentials: any = excelRows[0];
        
        const email = validCredentials.Email || validCredentials.email;
        const password = validCredentials.Password || validCredentials.password;

        // Step 1: Perform Login
        await loginPage.login(email, password);
        await expect(page).toHaveTitle('BOFL - My Dashboard');
    });

    test('Should navigate to Manufacturing and process requisitions for updated production no', async () => {
        // Read updated Production No directly from Sale_Order_Size (2).xlsx (Cell A3)
        const updatedProdNo = await getProductionNoFromExcel();
        console.log(`Executing Manufacturing Flow for Production No: [${updatedProdNo}]`);

        // Steps 2-5 & Operations: Home Menu -> Manufacturing -> Search -> Cutting/Sewing/Lasting Requisitions
        await manufacturingPage.finalizeWorkOrder(updatedProdNo);
    });
});   