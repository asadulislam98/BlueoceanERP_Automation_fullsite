import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { SalesOrderSheetPage } from '../pages/Salesordersheet.pom';
import * as XLSX from 'xlsx';
import * as path from 'path';

// Helper function to read all rows of login credentials from Excel file
function getExcelData() {
  // Locate the Excel file at the project root directory
  const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
  
  // Read the workbook and access the first sheet
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert sheet data into an array of JSON objects
  return XLSX.utils.sheet_to_json(worksheet);
}

test.describe('Sales Order Sheet Test Suite', () => {
  let loginPage: LoginPage;
  let excelRows: any[];
  
  test.beforeEach(async ({ page }) => {
    // Open Base Login Route
    await page.goto('/web/login');
    
    loginPage = new LoginPage(page);
    
    // Load the excel data grid once before execution
    excelRows = getExcelData();
    
    // excelRows[0] fetches the first data row (admin credentials)
    const validCredentials = excelRows[0];
    
    // Fallback logic in case Excel keys are lowercase or failing
    const email = validCredentials.Email || validCredentials.email;
    const password = validCredentials.Password || validCredentials.password;

    // Execute standard authenticated session setup using Excel Data
    await loginPage.login(email, password);

    // Assert authentication layer validation state
    await expect(page).toHaveTitle('BOFL - My Dashboard');
  });

  test('Should complete Sales Order Sheet processing flow successfully', async ({ page }) => {
    const salesOrderSheet = new SalesOrderSheetPage(page);

    // Trigger optimized modular action flow chain
    await salesOrderSheet.navigateToSalesOrderSheet();
  });
});