// import { test, expect } from '@playwright/test';
// import { LoginPage } from '../pages/Login.pom';
// import { SalesOrderSheetPage } from '../pages/Salesordersheet.pom';
// import { ProductionSheetPage } from '../pages/ProductionSheet.pom';
// import { ManufacturingPage } from '../pages/Manufacturing.pom';
// import { RequisitionPage } from '../pages/Requisition.pom'; 
// import * as XLSX from 'xlsx';
// import * as path from 'path';

// // Helper function to read all rows of login credentials from Excel file
// function getExcelData() {
//   // Locate the Excel file at the project root directory
//   const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
  
//   // Read the workbook and access the first sheet
//   const workbook = XLSX.readFile(filePath);
//   const sheetName = workbook.SheetNames[0];
//   const worksheet = workbook.Sheets[sheetName];
  
//   // Convert sheet data into an array of JSON objects
//   return XLSX.utils.sheet_to_json(worksheet);
// }

// test.describe('E2E Manufacturing and Requisition Workflow Tests', () => {
//   test.setTimeout(180000); // Expanded timeout structure for broader E2E steps

//   let loginPage: LoginPage;
//   let salesOrderSheet: SalesOrderSheetPage;
//   let productionSheet: ProductionSheetPage;
//   let manufacturingPage: ManufacturingPage;
//   let requisitionPage: RequisitionPage; 
//   let excelRows: any[];

//   test.beforeEach(async ({ page }) => {
//     await page.goto('/web/login');

//     loginPage = new LoginPage(page);
//     salesOrderSheet = new SalesOrderSheetPage(page);
//     productionSheet = new ProductionSheetPage(page);
//     manufacturingPage = new ManufacturingPage(page);
//     requisitionPage = new RequisitionPage(page); 

//     // Load the excel data grid once before execution
//     excelRows = getExcelData();
    
//     // excelRows[0] fetches the first data row (admin credentials)
//     const validCredentials = excelRows[0];
    
//     // Fallback logic in case Excel keys are lowercase or failing
//     const email = validCredentials.Email || validCredentials.email;
//     const password = validCredentials.Password || validCredentials.password;

//     // Perform Authentication using Excel Data
//     await loginPage.login(email, password);

//     await expect(page).toHaveTitle('BOFL - My Dashboard');
//   });

//   test('Should successfully complete E2E work orders and verify production materials requisition dashboard', async () => {
//     // =========================================================================
//     // STEP 1: CREATE SALES ORDER
//     // =========================================================================
//     await salesOrderSheet.navigateToSalesOrderSheetWithDynamicProdNo();

//     // Extract the dynamic production number that was just generated and used
//     const currentProductionNo = (salesOrderSheet as any).productionNo;
//     console.log(`Passing Production No to Workflow Loops: ${currentProductionNo}`);

//     // =========================================================================
//     // STEP 2: UPDATE PRODUCTION SHEET
//     // =========================================================================
//     // Navigate to Production Sheet and complete updates (Cutting, Sewing, Lasting, and Mark Done)
//     await productionSheet.navigateToProductionSheet();

//     // =========================================================================
//     // STEP 3: FINALIZE WORK ORDERS
//     // =========================================================================
//     // Finalize Work Orders across Cutting, Sewing, and Lasting operations
//     await manufacturingPage.finalizeWorkOrder(currentProductionNo);

//     // =========================================================================
//     // STEP 4: PROCESS CUTTING REQUISITION
//     // =========================================================================
//     console.log(`Starting Production Materials Requisition for Cutting Department...`);
//     await requisitionPage.processCuttingRequisition(currentProductionNo);

//     // =========================================================================
//     // STEP 5: PROCESS SEWING REQUISITION
//     // =========================================================================
//     console.log(`Starting Production Materials Requisition for Sewing Department...`);
//     await requisitionPage.processSewingRequisition(currentProductionNo);
    
//     console.log(`E2E Manufacturing and Requisition Workflow Completed Successfully!`);
//   });
// }); 

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { SalesOrderSheetPage } from '../pages/Salesordersheet.pom';
import { ProductionSheetPage } from '../pages/ProductionSheet.pom';
import { ManufacturingPage } from '../pages/Manufacturing.pom';
import { RequisitionPage } from '../pages/Requisition.pom'; 
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


test.describe('E2E Manufacturing and Requisition Workflow Tests', () => {
  test.setTimeout(180000); // Expanded timeout structure for broader E2E steps

  let loginPage: LoginPage;
  let salesOrderSheet: SalesOrderSheetPage;
  let productionSheet: ProductionSheetPage;
  let manufacturingPage: ManufacturingPage;
  let requisitionPage: RequisitionPage; 
  let excelRows: any[];

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/login');

    loginPage = new LoginPage(page);
    salesOrderSheet = new SalesOrderSheetPage(page);
    productionSheet = new ProductionSheetPage(page);
    manufacturingPage = new ManufacturingPage(page);
    requisitionPage = new RequisitionPage(page); 

    // Load the excel data grid once before execution
    excelRows = getExcelData();
    
    // excelRows[0] fetches the first data row (admin credentials)
    const validCredentials = excelRows[0];
    
    // Fallback logic in case Excel keys are lowercase or failing
    const email = validCredentials.Email || validCredentials.email;
    const password = validCredentials.Password || validCredentials.password;
    // await page.pause(); // Optional: Pause for 1 second to ensure page stability
    // Perform Authentication using Excel Data
    await loginPage.login(email, password);

    await expect(page).toHaveTitle('BOFL - My Dashboard');
  });
  
  test('Should successfully complete E2E work orders and verify production materials requisition dashboard', async () => {
    // =========================================================================
    // STEP 1: CREATE SALES ORDER
    
    await salesOrderSheet.navigateToSalesOrderSheetWithDynamicProdNo();

    // Extract the dynamic production number that was just generated and used
    const currentProductionNo = (salesOrderSheet as any).productionNo;
    console.log(`Passing Production No to Workflow Loops: ${currentProductionNo}`);

    // =========================================================================
    // STEP 2: UPDATE PRODUCTION SHEET
    
    // Navigate to Production Sheet and complete updates (Cutting, Sewing, Lasting, and Mark Done)
    await productionSheet.navigateToProductionSheet();

    // =========================================================================
    // STEP 3: FINALIZE WORK ORDERS
    
    // Finalize Work Orders across Cutting, Sewing, and Lasting operations
    await manufacturingPage.finalizeWorkOrder(currentProductionNo);

    // =========================================================================
    // STEP 4: PROCESS CUTTING REQUISITION
    
    console.log(`Starting Production Materials Requisition for Cutting Department...`);
    await requisitionPage.processCuttingRequisition(currentProductionNo);

    // =========================================================================
    // STEP 5: PROCESS SEWING REQUISITION
    
    console.log(`Starting Production Materials Requisition for Sewing Department...`);
    await requisitionPage.processSewingRequisition(currentProductionNo);
    
    // =========================================================================
    // STEP 6: PROCESS LASTING REQUISITION
    
    console.log(`Starting Production Materials Requisition for Lasting Department...`);
    await requisitionPage.processLastingRequisition(currentProductionNo);

    console.log(`E2E Manufacturing and Requisition Workflow Completed Successfully!`);
  });
});  


    