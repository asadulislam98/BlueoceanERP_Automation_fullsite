import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { FinishGoodsStockPage } from '../pages/finishgoodsstock.pom';
import * as XLSX from 'xlsx';
import * as path from 'path';

// Helper function to read login credentials from Excel file
function getExcelData() {
    const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
}

test.describe('Inventory Finished Goods Stock Check Tests', () => {
    test.setTimeout(120000); // 2 minutes execution timeout structure

    let loginPage: LoginPage;
    let stockPage: FinishGoodsStockPage;
    let excelRows: any[];

    test.beforeEach(async ({ page }) => {
        await page.goto('/web/login');

        loginPage = new LoginPage(page);
        stockPage = new FinishGoodsStockPage(page);

        // Fetch login credentials matching project standard data grid structure
        excelRows = getExcelData();
        const validCredentials = excelRows[0];
        const email = validCredentials.Email || validCredentials.email;
        const password = validCredentials.Password || validCredentials.password;

        // Perform Authentication using Excel Data
        await loginPage.login(email, password);
        await expect(page).toHaveTitle('BOFL - My Dashboard');
    });

    test('Should successfully navigate to Inventory and check Finished Goods stock', async ({ page }) => {
        // STEP 1: Navigate to Inventory Dashboard
        console.log('Navigating to Inventory -> Products...');
        await stockPage.navigateToInventoryProducts();

        // STEP 2: Group rows by Product Category
        console.log('Applying Group By Product Category filter...');
        await stockPage.groupByProductCategory();

        // STEP 3: Expand Finished Goods rows
        console.log('Expanding Finished Goods inventory section...');
        await stockPage.clickFinishedGoodsCategory();

        console.log('Finished Goods Stock Check Flow Completed Successfully!');
    });
}); 