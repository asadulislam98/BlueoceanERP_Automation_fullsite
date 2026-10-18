import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { ProductionSheetPage } from '../pages/ProductionSheet.pom';
import * as XLSX from 'xlsx';
import * as path from 'path';

function getExcelData() {
  const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

test.describe('E2E Production Workflow Tests', () => {
  test.setTimeout(120000);

  let loginPage: LoginPage;
  let productionSheet: ProductionSheetPage;
  let excelRows: any[];

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/login');

    loginPage = new LoginPage(page);
    productionSheet = new ProductionSheetPage(page);

    excelRows = getExcelData();
    const validCredentials = excelRows[0];
    const email = validCredentials.Email || validCredentials.email;
    const password = validCredentials.Password || validCredentials.password;

    // Step 1: Login into the system
    await loginPage.login(email, password);
    await expect(page).toHaveTitle('BOFL - My Dashboard');
  });

  test('Should navigate using Sales menu, search A3 production number, and process Production Sheet', async () => {
    // Step 2 to End: Complete full workflow
    await productionSheet.navigateToProductionSheet();
  });
}); 
