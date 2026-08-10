import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { OrderSizePage } from '../pages/Ordersize.pom';
import * as XLSX from 'xlsx';
import * as path from 'path';

// Login Info Read Function
function getLoginCredentials() {
  const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(worksheet);
  return rows[0];
}

// Function to read Production No directly from A3 cell of Sale_Order_Size (2).xlsx
function getProductionNoFromA3(): string {
  const filePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Reading cell A3 value
  const cellA3 = worksheet['A3'];
  return cellA3 ? String(cellA3.v).trim() : '';
}

test.describe('Order Size Upload and Validation Test Suite', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/login');
    loginPage = new LoginPage(page);
    
    const validCredentials = getLoginCredentials();
    const email = validCredentials.Email || validCredentials.email;
    const password = validCredentials.Password || validCredentials.password;

    await loginPage.login(email, password);
    await expect(page).toHaveTitle('BOFL - My Dashboard');
  });

  test('Should upload Sale Order Size Excel file and execute orderspairsexceedednegativetestcase', async ({ page }) => {
    const orderSizePage = new OrderSizePage(page);

    // 1. Upload Process Execution
    const fixedEndPos = '11';
    console.log('Executing Sale Order Size upload process...');
    await orderSizePage.uploadExcelSaleOrderSize(fixedEndPos);

    // 2. Reading Production No dynamically from A3 cell
    const productionNo = getProductionNoFromA3();
    console.log(`Executing orderspairsexceedednegativetestcase for Production No: ${productionNo}`);
    
    // 3. Negative Test Case Execution
    await orderSizePage.ordersPairsExceededNegativeTestCase(productionNo);
  });
});