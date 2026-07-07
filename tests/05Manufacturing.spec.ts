import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { SalesOrderSheetPage } from '../pages/Salesordersheet.pom';
import { ProductionSheetPage } from '../pages/ProductionSheet.pom';
import { ManufacturingPage } from '../pages/Manufacturing.pom';
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

test.describe('E2E Manufacturing Workflow Tests', () => {
  test.setTimeout(150000);

  let loginPage: LoginPage;
  let salesOrderSheet: SalesOrderSheetPage;
  let productionSheet: ProductionSheetPage;
  let manufacturingPage: ManufacturingPage;
  let excelRows: any[];

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/login');

    loginPage = new LoginPage(page);
    salesOrderSheet = new SalesOrderSheetPage(page);
    productionSheet = new ProductionSheetPage(page);
    manufacturingPage = new ManufacturingPage(page);

    // Load the excel data grid once before execution
    excelRows = getExcelData();
    
    // excelRows[0] fetches the first data row (admin credentials)
    const validCredentials = excelRows[0];
    
    // Fallback logic in case Excel keys are lowercase or failing
    const email = validCredentials.Email || validCredentials.email;
    const password = validCredentials.Password || validCredentials.password;

    // Perform Authentication using Excel Data
    await loginPage.login(email, password);

    await expect(page).toHaveTitle('BOFL - My Dashboard');
  });

  test('Should successfully complete full E2E workflow and click cutting cell based on dynamic production no', async () => {
    // Step 1: Create Sales Order Sheet with dynamic production number
    await salesOrderSheet.navigateToSalesOrderSheetWithDynamicProdNo();

    // Extract the dynamic production number that was just generated and used
    // Note: ensure salesOrderSheet.productionNo is accessible
    const currentProductionNo = (salesOrderSheet as any).productionNo;
    console.log(`Passing Production No to Manufacturing Flow: ${currentProductionNo}`);

    // Step 2: Navigate to Production Sheet and complete updates (Cutting, Sewing, Lasting, and Mark Done)
    await productionSheet.navigateToProductionSheet();

    // Step 3: Finalize Work Order and click the specific 'Cutting' row based on the dynamic number
    await manufacturingPage.finalizeWorkOrder(currentProductionNo);
  });
});

