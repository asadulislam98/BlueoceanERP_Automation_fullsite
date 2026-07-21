import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { FinishGoodsStockCheckPage } from '../pages/finishgoodsstockcheck.pom';
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import * as path from 'path';

// Helper: Extract credentials from LoginInfo.xlsx
function getExcelCredentials() {
  const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

// Helper: Extract Production No from Sale_Order_Size (2).xlsx (Cell A3)
async function getProductionNoFromExcel(): Promise<string> {
  const filePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];
  const cellA3Value = worksheet.getCell('A3').value;
  return cellA3Value ? String(cellA3Value).trim() : '';
}

test.describe('Finish Goods Stock Check Search Sequence', () => {
  test.setTimeout(300000); // 5 minutes timeout

  let loginPage: LoginPage;
  let stockCheckPage: FinishGoodsStockCheckPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/login');
    await page.waitForLoadState('domcontentloaded');

    loginPage = new LoginPage(page);
    stockCheckPage = new FinishGoodsStockCheckPage(page);

    // STEP: Login Execution
    const excelRows = getExcelCredentials();
    const validCredentials: any = excelRows[0];

    const email = validCredentials.Email || validCredentials.email;
    const password = validCredentials.Password || validCredentials.password;

    await loginPage.login(email, password);
    await expect(page).toHaveTitle('BOFL - My Dashboard');
  });

  test('Should navigate to Manufacturing, remove default filter and search by Production No from Cell A3', async () => {
    // STEP 1: Read A3 Value & Log
    const currentProductionNo = await getProductionNoFromExcel();

    if (!currentProductionNo) {
      throw new Error('Production Number extracted from Excel Cell A3 is empty!');
    }

    console.log(`Will be logged: ${currentProductionNo}`);

    // STEP 2 to 6: Home Menu -> Manufacturing -> Remove -> Fill Searchbox -> Click Link
    console.log(`Navigating to Manufacturing and applying search filter for: ${currentProductionNo}`);
    await stockCheckPage.executeStockCheckSearch(currentProductionNo);

    console.log(`Finish Goods Stock Check search executed successfully!`);
  });
});