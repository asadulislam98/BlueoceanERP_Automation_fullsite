import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { SalesOrderSheetPage } from '../pages/Salesordersheet.pom';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

function getExcelData() {
  const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

interface ProdData {
  prodNo: string;
  pairs: number;
}

// Helper: Save current executing Article Number to article_no.json
function saveArticleNoToJson(articleNo: string) {
  const jsonPath = path.resolve(__dirname, '../article_no.json');
  const jsonData = {
    articleNo: articleNo,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');
  console.log(`Executing Article No [${articleNo}] successfully saved to article_no.json`);
}

// Helper: Writes production numbers and distributes the pairs quantity into B, C, D columns
async function updateOrderSizeExcel(dataList: ProdData[]) {
  const orderSizePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(orderSizePath);
  
  const worksheet = workbook.worksheets[0]; 

  if (!worksheet) {
    console.error('Error: No worksheet found in Sale_Order_Size (2).xlsx');
    return;
  }

  // FIXED COLUMNS:
  const prodNoColIndex = 1; // Column A for Production No
  const col3Index = 2;      // Column B for 3#
  const col35Index = 3;     // Column C for 3.5#
  const col4Index = 4;      // Column D for 4#

  console.log(`--- Syncing Data & Distributing Pairs Into Sale_Order_Size (2).xlsx ---`);

  // Loop through rows 3 to 11 to populate numbers and breakdown pairs
  for (let rowNum = 3; rowNum <= 11; rowNum++) {
    const dataIndex = rowNum - 3; // Maps row 3 to array index 0, row 4 to index 1...
    
    if (dataList[dataIndex] !== undefined) {
      const item = dataList[dataIndex];
      
      // 1. Set the Production Number in Column A
      const cellProd = worksheet.getCell(rowNum, prodNoColIndex);
      cellProd.value = item.prodNo;

      // 2. Distribute pairs calculation logic into B, C, D
      const totalPairs = item.pairs;
      if (totalPairs > 0) {
        const baseQty = Math.floor(totalPairs / 3); 
        const remainder = totalPairs % 3;

        // Distribute remainder step by step to ensure exact checksum match
        const qty3 = baseQty;
        const qty35 = baseQty + (remainder > 0 ? 1 : 0);
        const qty4 = baseQty + (remainder > 1 ? 1 : 0);

        worksheet.getCell(rowNum, col3Index).value = qty3;
        worksheet.getCell(rowNum, col35Index).value = qty35;
        worksheet.getCell(rowNum, col4Index).value = qty4;

        console.log(`Row ${rowNum} | Prod: [${item.prodNo}] | Pairs: ${totalPairs} -> B[3#]: ${qty3}, C[3.5#]: ${qty35}, D[4#]: ${qty4}`);
      } else {
        worksheet.getCell(rowNum, col3Index).value = 0;
        worksheet.getCell(rowNum, col35Index).value = 0;
        worksheet.getCell(rowNum, col4Index).value = 0;
      }
    }
  }

  // Save changes to the size sheet file
  await workbook.xlsx.writeFile(orderSizePath);
  console.log('Sale_Order_Size (2).xlsx updated with exact calculations successfully.');
}

// Main Function: Saves current F3 value to JSON, then increments F3 and Column K (Prod) for the next run
async function incrementExcelProductionNumbers() {
  const targetFilePath = path.resolve(__dirname, '../new_sales_order_sheet_format 1 - Copy-1 (6).xlsx');
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(targetFilePath);
  
  const worksheet = workbook.getWorksheet('Need Update');

  if (!worksheet) {
    console.error(`Error: Sheet named "Need Update" not found!`);
    return;
  }

  // -------------------------------------------------------------
  // LOGIC FOR CELL F3
  // -------------------------------------------------------------
  const cellF3 = worksheet.getCell('F3');
  const currentF3Val = cellF3.value ? String(cellF3.value).trim() : 'CAT000-1A001';

  // 1. Save the CURRENT value (e.g. CAT000-1A001) that is actually being uploaded/used
  saveArticleNoToJson(currentF3Val);

  // 2. Increment for the NEXT run
  let updatedF3Val = currentF3Val;
  const matchF3 = currentF3Val.match(/(.*?)(\d+)$/);

  if (matchF3) {
    const prefix = matchF3[1];         // e.g. "CAT000-1A"
    const numberPart = matchF3[2];     // e.g. "001"
    const nextNum = parseInt(numberPart, 10) + 1;
    const paddedNextNum = String(nextNum).padStart(numberPart.length, '0'); // "002"
    
    updatedF3Val = `${prefix}${paddedNextNum}`;
  } else {
    updatedF3Val = 'CAT000-1A001';
  }

  // Set next run value into Excel
  cellF3.value = updatedF3Val;
  console.log(`Executed with: [${currentF3Val}] | Prepared Cell F3 for next run: [${updatedF3Val}]`);

  // -------------------------------------------------------------
  // INCREMENT PRODUCTION NUMBERS (Column K, Rows 2 to 10)
  // -------------------------------------------------------------
  const prodColumnIndex = 11;  // Column K (Production No)
  const pairsColumnIndex = 3;  // Column C (Pairs)
  
  console.log(`--- Modifying Production Sheet Numbers & Extracting Pairs Count ---`);
  
  const updatedDataList: ProdData[] = [];

  // Loop through rows 2 to 10
  for (let rowNum = 2; rowNum <= 10; rowNum++) {
    const cellProd = worksheet.getCell(rowNum, prodColumnIndex);
    const cellPairs = worksheet.getCell(rowNum, pairsColumnIndex);

    const currentProdVal = cellProd.value ? String(cellProd.value).trim() : '';
    const currentPairsVal = cellPairs.value ? Number(cellPairs.value) : 0;

    let finalProdValue = currentProdVal;

    if (currentProdVal) {
      const match = currentProdVal.match(/(.*?)(\d+)$/);
      
      if (match) {
        const prefix = match[1];        
        const numberPart = match[2];    
        const nextNum = parseInt(numberPart, 10) + 1;
        const paddedNextNum = String(nextNum).padStart(numberPart.length, '0');
        
        finalProdValue = `${prefix}${paddedNextNum}`;
        cellProd.value = finalProdValue;
        console.log(`Row ${rowNum} | Prod No Incremented to: [${finalProdValue}]`);
      }
    }

    updatedDataList.push({
      prodNo: finalProdValue,
      pairs: isNaN(currentPairsVal) ? 0 : currentPairsVal
    });
  }

  // Save data back into the original sheet template
  await workbook.xlsx.writeFile(targetFilePath);
  console.log('Original template saved successfully.');

  // SYNC ACTION: Write the data list and run mathematical division injection on the second sheet
  if (updatedDataList.length > 0) {
    await updateOrderSizeExcel(updatedDataList);
  }
}

test.describe('Sales Order Sheet Upload Test Suite', () => {
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

  test('Should auto-increment production numbers once per script execution and upload', async ({ page }) => {
    const salesOrderSheet = new SalesOrderSheetPage(page);

    const fixedStartPos = '2';
    const fixedEndPos = '10';

    await incrementExcelProductionNumbers();
    await page.waitForTimeout(1500);

    console.log('Executing upload process with updated template numbers...');
    await salesOrderSheet.uploadExcelSalesOrderSheet(fixedStartPos, fixedEndPos);
  });
}); 
