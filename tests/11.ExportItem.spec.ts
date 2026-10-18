// import { test, expect } from '@playwright/test';
// import { ExportItemPage } from '../pages/Exportitem.pom';
// import * as XLSX from 'xlsx';
// import * as path from 'path';

// // Helper: Read login credentials from LoginInfo.xlsx
// function getLoginCredentials() {
//   const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
//   const workbook = XLSX.readFile(filePath);
//   const sheetName = workbook.SheetNames[0];
//   const worksheet = workbook.Sheets[sheetName];
//   return XLSX.utils.sheet_to_json(worksheet);
// }

// // Helper: Read cell A3 from Sale_Order_Size (2).xlsx
// function getA3CellValue(): string {
//   const filePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
//   const workbook = XLSX.readFile(filePath);
//   const sheetName = workbook.SheetNames[0];
//   const worksheet = workbook.Sheets[sheetName];
//   const cell = worksheet['A3'];
//   return cell ? String(cell.v) : '';
// }

// test.describe('Export Item Module - Complete Workflow (Steps 1 to 44)', () => {
//   let exportItemPage: ExportItemPage;

//   test.beforeEach(async ({ page }) => {
//     await page.goto('/web/login');
//     exportItemPage = new ExportItemPage(page);
//   });

//   test('Should execute full Export Item flow with dynamic PI and Packing List', async ({ page }) => {
//     test.setTimeout(180000); // Extended timeout for multi-step process

//     // 1. Get Login Credentials
//     const excelRows: any[] = getLoginCredentials();
//     const validCredentials: any = excelRows[0];
//     const email = validCredentials.Email || validCredentials.email;
//     const password = validCredentials.Password || validCredentials.password;

//     console.log(`Logging in as: ${email}`);
//     await exportItemPage.performLogin(email, password);
//     await expect(page).toHaveTitle('BOFL - My Dashboard');

//     // 2. Read cell A3 value from Sale_Order_Size (2).xlsx
//     const searchValue = getA3CellValue();
//     console.log(`Extracted Search Value from Cell A3: ${searchValue}`);

//     // 3. Execute full 1-44 step flow
//     await exportItemPage.executeExportItemFlow(searchValue);
//   });
// });

import { test, expect } from '@playwright/test';
import { ExportItemPage } from '../pages/Exportitem.pom';
import * as XLSX from 'xlsx';
import * as path from 'path';

// Helper: Read login credentials from LoginInfo.xlsx
function getLoginCredentials() {
  const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

// Helper: Read cell A3 from Sale_Order_Size (2).xlsx
function getA3CellValue(): string {
  const filePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const cell = worksheet['A3'];
  return cell ? String(cell.v) : '';
}

test.describe('Export Item Module - Complete Workflow (Steps 1 to 73)', () => {
  let exportItemPage: ExportItemPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/login');
    exportItemPage = new ExportItemPage(page);
  });

  test('Should execute full Export Item flow with dynamic PI, Commercial Invoice, and Delivery Validation', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes timeout for 73-step full process

    // 1. Get Login Credentials 
    const excelRows: any[] = getLoginCredentials();
    const validCredentials: any = excelRows[0];
    const email = validCredentials.Email || validCredentials.email;
    const password = validCredentials.Password || validCredentials.password;

    console.log(`Logging in as: ${email}`);
    await exportItemPage.performLogin(email, password);
    await expect(page).toHaveTitle('BOFL - My Dashboard');

    // 2. Read cell A3 value from Sale_Order_Size (2).xlsx
    const searchValue = getA3CellValue();
    console.log(`Extracted Search Value from Cell A3: ${searchValue}`);

    // 3. Execute full 1-73 step flow
    await exportItemPage.executeExportItemFlow(searchValue); 
  });
});  
