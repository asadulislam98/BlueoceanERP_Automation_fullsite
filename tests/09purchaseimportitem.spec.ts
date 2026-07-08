// import { test, expect } from '@playwright/test';
// import { LoginPage } from '../pages/Login.pom';
// import { PurchaseImportItemPage } from '../pages/purchaseimportitem.pom';
// import * as XLSX from 'xlsx';
// import * as path from 'path';

// function getExcelData() {
//   const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
//   const workbook = XLSX.readFile(filePath);
//   const sheetName = workbook.SheetNames[0];
//   const worksheet = workbook.Sheets[sheetName];
//   return XLSX.utils.sheet_to_json(worksheet);
// }

// test.describe('Purchase Import Item Automation Suite', () => {
//   let loginPage: LoginPage;
//   let purchasePage: PurchaseImportItemPage;
//   let excelRows: any[];

//   test.beforeEach(async ({ page }) => {
//     await page.goto('/web/login');
//     loginPage = new LoginPage(page);
//     purchasePage = new PurchaseImportItemPage(page);
//     excelRows = getExcelData();
//   });

//   test('Should navigate, fill data fields, attach file, and click final upload button', async ({ page }) => {
//     const validCredentials = excelRows[0];
//     const email = validCredentials.Email || validCredentials.email;
//     const password = validCredentials.Password || validCredentials.password;
    
//     console.log(`Logging in with: ${email}`);
//     await loginPage.login(email, password);

//     await expect(page).toHaveTitle('BOFL - My Dashboard');
//     console.log('Login successful. Executing form data configuration sequence...');

//     // Executes initial workflows and proceeds to the additional fields automatically
//     await purchasePage.navigateAndUploadExcelSaleOrder();
    
//     console.log('Workflow completely finished and the final cell interaction is processed!');
//   });
// });

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { PurchaseImportItemPage } from '../pages/purchaseimportitem.pom';
import * as XLSX from 'xlsx';
import * as path from 'path';

function getExcelData() {
  const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

test.describe('Purchase Import Item Automation Suite', () => {
  let loginPage: LoginPage;
  let purchasePage: PurchaseImportItemPage;
  let excelRows: any[];

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/login');
    loginPage = new LoginPage(page);
    purchasePage = new PurchaseImportItemPage(page);
    excelRows = getExcelData();
  });

  test('Should navigate, fill data fields, attach file, and click final upload button', async ({ page }) => {
    const validCredentials = excelRows[0];
    const email = validCredentials.Email || validCredentials.email;
    const password = validCredentials.Password || validCredentials.password;
    
    console.log(`Logging in with: ${email}`);
    await loginPage.login(email, password);

    await expect(page).toHaveTitle('BOFL - My Dashboard');
    console.log('Login successful. Executing form data configuration sequence...');

    // Executes the master sequence pipeline setup smoothly
    await purchasePage.navigateAndUploadExcelSaleOrder();
    
    console.log('Workflow completely finished and the final cell interaction is processed!');
  });
}); 