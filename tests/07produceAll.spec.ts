import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { SalesOrderSheetPage } from '../pages/Salesordersheet.pom';
import { ProductionSheetPage } from '../pages/ProductionSheet.pom';
import { ManufacturingPage } from '../pages/Manufacturing.pom';
import { RequisitionPage } from '../pages/Requisition.pom'; 
import { ProduceAllPage } from '../pages/produceAll.pom';
import * as XLSX from 'xlsx';
import * as path from 'path';

function getExcelData() {
  const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

test.describe('Manufacturing Requisition to Produce All Sequence Flow', () => {
  test.setTimeout(300000);

  let loginPage: LoginPage;
  let salesOrderSheet: SalesOrderSheetPage;
  let productionSheet: ProductionSheetPage;
  let manufacturingPage: ManufacturingPage;
  let requisitionPage: RequisitionPage; 
  let produceAllPage: ProduceAllPage;
  let excelRows: any[];

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/login');

    loginPage = new LoginPage(page);
    salesOrderSheet = new SalesOrderSheetPage(page);
    productionSheet = new ProductionSheetPage(page);
    manufacturingPage = new ManufacturingPage(page);
    requisitionPage = new RequisitionPage(page); 
    produceAllPage = new ProduceAllPage(page);

    excelRows = getExcelData();
    const validCredentials = excelRows[0];
    
    const email = validCredentials.Email || validCredentials.email;
    const password = validCredentials.Password || validCredentials.password;
    await loginPage.login(email, password);

    await expect(page).toHaveTitle('BOFL - My Dashboard');
  }); 
  
  test('Should execute Requisition workflow first and then trigger Produce All workflow seamlessly', async () => {
    // =========================================================================
    // PART 1: Dynamic Production Number Generation and Requisition Process
    // =========================================================================
    await salesOrderSheet.navigateToSalesOrderSheetWithDynamicProdNo();

    const currentProductionNo = (salesOrderSheet as any).productionNo;
    console.log(`Successfully Generated Dynamic Production No: ${currentProductionNo}`);

    await productionSheet.navigateToProductionSheet();

    await manufacturingPage.finalizeWorkOrder(currentProductionNo);

    console.log(`Starting Production Materials Requisition for Cutting Department...`);
    await requisitionPage.processCuttingRequisition(currentProductionNo);

    console.log(`Starting Production Materials Requisition for Sewing Department...`);
    await requisitionPage.processSewingRequisition(currentProductionNo);
    
    console.log(`Starting Production Materials Requisition for Lasting Department...`);
    await requisitionPage.processLastingRequisition(currentProductionNo);

    console.log(`Requisition Workflow Completed Successfully!`);
    
    // =========================================================================
    // PART 2: Produce All Action Flow
    // =========================================================================
    console.log(`Initiating ProduceAll Workflow using Production No: ${currentProductionNo}`);

    console.log(`Executing Produce All Workflow for Cutting Department...`);
    await produceAllPage.processCutting(currentProductionNo);

    console.log(`Executing Produce All Workflow for Sewing Department...`);
    await produceAllPage.processSewing(currentProductionNo);

    console.log(`Executing Produce All Workflow for Lasting Department...`);
    await produceAllPage.processLasting(currentProductionNo);

    console.log(`Entire End-to-End Dependency Chain Executed Successfully in 07produceAll.spec.ts!`);
  });
});   