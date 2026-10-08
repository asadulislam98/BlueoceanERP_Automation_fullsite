import { test, expect } from '@playwright/test';
import { LocalPurchasePage } from '../pages/Localpurchase.pom';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

// Helper: Read login credentials from LoginInfo.xlsx
function getExcelData() {
  const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

// Helper: Read Cell A11 from Sale_Order_Size (2).xlsx
function getSalesOrderSizeA11Value(): string {
  const filePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Reading cell A11 value
  const cell = worksheet['A11'];
  if (!cell || cell.v === undefined) {
    throw new Error('A11 cell is empty in Sale_Order_Size (2).xlsx');
  }
  return String(cell.v).trim();
}

// Helper: Generate PO Numbers
function getNextPONumber(): string {
  const counterFilePath = path.resolve(__dirname, '../po_counter.json');
  let counter = 1;

  if (fs.existsSync(counterFilePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(counterFilePath, 'utf-8'));
      counter = (data.counter || 0) + 1;
    } catch {
      counter = 1;
    }
  }

  fs.writeFileSync(counterFilePath, JSON.stringify({ counter }), 'utf-8');
  return `B098745673-${counter}`;
}



function getNextLCPONumber(): string {
  const counterFilePath = path.resolve(__dirname, '../lc_po_counter.json');
  let counter = 1;

  if (fs.existsSync(counterFilePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(counterFilePath, 'utf-8'));
      counter = (data.counter || 0) + 1;
    } catch {
      counter = 1;
    }
  }

  fs.writeFileSync(counterFilePath, JSON.stringify({ counter }), 'utf-8');
  return `B027072026-${counter}`;
}

test.describe('Local Purchase Module Tests', () => {
  let localPurchasePage: LocalPurchasePage;
  let excelRows: any[];

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/login');
    localPurchasePage = new LocalPurchasePage(page);
    excelRows = getExcelData();
  });

  test('Should perform login, create local purchase, execute LC/TC partial received, and run LC management', async ({ page }) => {
    
    test.setTimeout(120000);

    const validCredentials: any = excelRows[0];
    const email = validCredentials.Email || validCredentials.email;
    const password = validCredentials.Password || validCredentials.password;

    console.log(`Performing Login with: ${email}`);
    await localPurchasePage.performLogin(email, password);
    await expect(page).toHaveTitle('BOFL - My Dashboard');

    // 1. Execute First Flow
    const poNumber = getNextPONumber();
    console.log(`Executing First Flow with PO: ${poNumber}`);
    await localPurchasePage.createLocalPurchase(poNumber);

    // 2. Execute Second Flow (Reading cell A11 value dynamically from Excel)
    const dynamicProdNo = getSalesOrderSizeA11Value();
    const lcPoNumber = getNextLCPONumber();
    
    console.log(`Executing Second Flow with PO: ${lcPoNumber} and Excel A11 value: ${dynamicProdNo}`);
    await localPurchasePage.partialReceivedDoneByLCTC(lcPoNumber, dynamicProdNo);

    // 3. Execute Third Flow (New LC Management Task)
    console.log('Executing LC Management and Partial Purchase Flow...');
    await localPurchasePage.createLCAndCompletePartialPurchase();
  });
});  