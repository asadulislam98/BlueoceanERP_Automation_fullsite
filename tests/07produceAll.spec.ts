import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { ProduceAllPage } from '../pages/produceAll.pom';
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import * as path from 'path';

// Login Credentials Extractor
function getExcelCredentials() {
  const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

// Read Production No from Excel (Cell A3)
async function getProductionNoFromExcel(): Promise<string> {
  const filePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  
  const worksheet = workbook.worksheets[0];
  const cellA3Value = worksheet.getCell('A3').value;
  return cellA3Value ? String(cellA3Value).trim() : '';
}

test.describe('Produce All Sequence Flow', () => {
  test.setTimeout(300000); // 5 minutes timeout

  let loginPage: LoginPage;
  let produceAllPage: ProduceAllPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/login');
    await page.waitForLoadState('domcontentloaded');

    loginPage = new LoginPage(page);
    produceAllPage = new ProduceAllPage(page);

    // STEP 1: Login
    const excelRows = getExcelCredentials();
    const validCredentials: any = excelRows[0];
    
    const email = validCredentials.Email || validCredentials.email;
    const password = validCredentials.Password || validCredentials.password;
    
    await loginPage.login(email, password);
    await expect(page).toHaveTitle('BOFL - My Dashboard');
  }); 
  
  test('Should search Production No and execute Produce All for Cutting, Sewing, and Lasting', async () => {
    // STEP 2: Read Production Number from Excel (Cell A3)
    const currentProductionNo = await getProductionNoFromExcel();
    
    if (!currentProductionNo) {
      throw new Error('Production Number extracted from Excel Cell A3 is empty!');
    }

    console.log(`Will be logged: ${currentProductionNo}`);

    // STEP 3: Produce All Workflow Execution (Manufacturing -> Search A3 -> Produce All)
    console.log(`Executing Produce All Workflow for Cutting Department...`);
    await produceAllPage.processCutting(currentProductionNo);

    console.log(`Executing Produce All Workflow for Sewing Department...`);
    await produceAllPage.processSewing(currentProductionNo);

    console.log(`Executing Produce All Workflow for Lasting Department...`);
    await produceAllPage.processLasting(currentProductionNo);

    console.log(`Produce All Workflow Completed Successfully for All Departments!`);
  });
});