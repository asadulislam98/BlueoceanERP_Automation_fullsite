import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { OrderSizePage } from '../pages/Ordersize.pom';
import * as XLSX from 'xlsx';
import * as path from 'path';

function getExcelData() {
  const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

test.describe('Order Size Upload Test Suite', () => {
  let loginPage: LoginPage;
  let excelRows: any[];

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/login');
    loginPage = new LoginPage(page);
    excelRows = getExcelData();

    const validCredentials = excelRows[0];
    const email = validCredentials.Email || validCredentials.email;
    const password = validCredentials.Password || validCredentials.password;

    await loginPage.login(email, password);
    await expect(page).toHaveTitle('BOFL - My Dashboard');
  });

  test('Should upload Sale Order Size Excel file successfully', async ({ page }) => {
    const orderSizePage = new OrderSizePage(page);

    // End Position Input: 11
    const fixedEndPos = '11';

    console.log('Executing Sale Order Size upload process...');
    await orderSizePage.uploadExcelSaleOrderSize(fixedEndPos);
  });
});