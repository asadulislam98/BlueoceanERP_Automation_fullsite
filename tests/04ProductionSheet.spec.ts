import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { SalesOrderSheetPage } from '../pages/Salesordersheet.pom';
import { ProductionSheetPage } from '../pages/ProductionSheet.pom';
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

test.describe('E2E Production Workflow Tests', () => {
  // Increase timeout for the entire block because E2E flows in Odoo take time
  test.setTimeout(120000);

  let loginPage: LoginPage;
  let salesOrderSheet: SalesOrderSheetPage;
  let productionSheet: ProductionSheetPage;
  let excelRows: any[];

  // Pre-test setup: Login and initialize POM classes
  test.beforeEach(async ({ page }) => {
    // Navigate to Login Route
    await page.goto('/web/login');

    // Initialize Page Objects
    loginPage = new LoginPage(page);
    salesOrderSheet = new SalesOrderSheetPage(page);
    productionSheet = new ProductionSheetPage(page);

    // Load the excel data grid once before execution
    excelRows = getExcelData();
    
    // excelRows[0] fetches the first data row (admin credentials)
    const validCredentials = excelRows[0];
    
    // Fallback logic in case Excel keys are lowercase or failing
    const email = validCredentials.Email || validCredentials.email;
    const password = validCredentials.Password || validCredentials.password;

    // Perform Authentication using Excel Data
    await loginPage.login(email, password);

    // Assert successful dashboard access
    await expect(page).toHaveTitle('BOFL - My Dashboard');
  });

  // Main E2E Test Case - From Sales Order Sheet creation to Production Sheet processing
  test('Should successfully complete full E2E workflow from Sales Order to Production Sheet processing', async () => {
    // Step 1: Create Sales Order Sheet with dynamic production number
    await salesOrderSheet.navigateToSalesOrderSheetWithDynamicProdNo();

    // Step 2: Navigate to Production Sheet and complete updates (Cutting, Sewing, Lasting)
    await productionSheet.navigateToProductionSheet();
  });
});