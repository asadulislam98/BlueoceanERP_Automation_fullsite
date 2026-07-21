// 

// import { test, expect } from '@playwright/test';
// import { LoginPage } from '../pages/Login.pom';
// import { SalesOrderSheetPage } from '../pages/Salesordersheet.pom';
// import * as ExcelJS from 'exceljs';
// import * as path from 'path';
// import * as XLSX from 'xlsx';

// function getExcelData() {
//   const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
//   const workbook = XLSX.readFile(filePath);
//   const sheetName = workbook.SheetNames[0];
//   const worksheet = workbook.Sheets[sheetName];
//   return XLSX.utils.sheet_to_json(worksheet);
// }

// // NEW HELPER: Writes the collected production numbers into Sale_Order_Size (2).xlsx from rows 3 to 11
// async function updateOrderSizeExcel(prodNumbers: string[]) {
//   const orderSizePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
  
//   const workbook = new ExcelJS.Workbook();
//   await workbook.xlsx.readFile(orderSizePath);
  
//   // Gets the first sheet available in the order size file
//   const worksheet = workbook.worksheets[0]; 

//   if (!worksheet) {
//     console.error('Error: No worksheet found in Sale_Order_Size (2).xlsx');
//     return;
//   }

//   // Find the column index for "Production No" in the header row dynamically
//   let prodNoColIndex = -1;
//   const headerRow = worksheet.getRow(1);
//   headerRow.eachCell((cell, colNumber) => {
//     if (cell.value && String(cell.value).trim() === 'Production No') {
//       prodNoColIndex = colNumber;
//     }
//   });

//   // If header text is missing or not found, defaults to Column A (Index 1)
//   if (prodNoColIndex === -1) {
//     prodNoColIndex = 1; 
//   }

//   console.log(`--- Writing to Sale_Order_Size (2).xlsx at Column Index ${prodNoColIndex} ---`);

//   // Loop through rows 3 to 11 to set the values synchronized from the first sheet
//   for (let rowNum = 3; rowNum <= 11; rowNum++) {
//     const dataIndex = rowNum - 3; // Maps row 3 to array index 0, row 4 to index 1...
//     if (prodNumbers[dataIndex] !== undefined) {
//       const cell = worksheet.getCell(rowNum, prodNoColIndex);
//       cell.value = prodNumbers[dataIndex];
//       console.log(`Sale_Order_Size Row ${rowNum} | Set to: [${cell.value}]`);
//     }
//   }

//   // Save changes to the second file while keeping its styles and colors intact
//   await workbook.xlsx.writeFile(orderSizePath);
//   console.log('Sale_Order_Size (2).xlsx successfully updated and saved.');
// }

// // FIXED HELPER: Directly targets Column K (Index 11), increments the last single digit, and triggers sync
// async function incrementExcelProductionNumbers() {
//   const targetFilePath = path.resolve(__dirname, '../new_sales_order_sheet_format 1 - Copy-1 (6).xlsx');
  
//   const workbook = new ExcelJS.Workbook();
//   await workbook.xlsx.readFile(targetFilePath);
  
//   const worksheet = workbook.getWorksheet('Need Update');

//   if (!worksheet) {
//     console.error(`Error: Sheet named "Need Update" not found!`);
//     return;
//   }

//   const targetColumnIndex = 11; // Column K (A=1, B=2... K=11)
//   console.log(`--- Modifying Column K (Index ${targetColumnIndex}) Directly ---`);
  
//   // Array to collect the newly generated numbers for syncing
//   const updatedNumbers: string[] = [];

//   // Loop through rows 2 to 10 (Your original logic)
//   for (let rowNum = 2; rowNum <= 10; rowNum++) {
//     const cell = worksheet.getCell(rowNum, targetColumnIndex);
//     const currentVal = cell.value ? String(cell.value).trim() : '';

//     console.log(`Row ${rowNum} | Column K Current Value: [${currentVal || 'EMPTY'}]`);

//     if (currentVal) {
//       const match = currentVal.match(/(.*)(\d)$/);
      
//       if (match) {
//         const prefix = match[1];        
//         const lastDigitStr = match[2];  
        
//         const nextNum = (parseInt(lastDigitStr, 10) + 1) % 10;
        
//         const newValue = `${prefix}${nextNum}`;
//         cell.value = newValue;
//         updatedNumbers.push(newValue); // Store the updated string
//         console.log(`Row ${rowNum} | Column K Updated to   : [${cell.value}]`);
//       } else {
//         updatedNumbers.push(currentVal); // Keep original if no match
//         console.log(`Row ${rowNum} | Skip: Value does not end with a numerical digit.`);
//       }
//     } else {
//       updatedNumbers.push('');
//     }
//     console.log('------------------------------------------------');
//   }

//   // Save changes to the first file
//   await workbook.xlsx.writeFile(targetFilePath);
//   console.log('Excel file saved successfully. Styles and increments are fully applied to Column K.');

//   // SYNC ACTION: Write those exact captured numbers into Sale_Order_Size (2).xlsx from rows 3 to 11
//   if (updatedNumbers.length > 0) {
//     await updateOrderSizeExcel(updatedNumbers);
//   }
// }

// test.describe('Sales Order Sheet Upload Test Suite', () => {
//   let loginPage: LoginPage;
//   let excelRows: any[];
  
//   test.beforeEach(async ({ page }) => {
//     await page.goto('/web/login');
//     loginPage = new LoginPage(page);
//     excelRows = getExcelData();
    
//     const validCredentials = excelRows[0];
//     const email = validCredentials.Email || validCredentials.email;
//     const password = validCredentials.Password || validCredentials.password;

//     await loginPage.login(email, password);
//     await expect(page).toHaveTitle('BOFL - My Dashboard');
//   });

//   test('Should auto-increment production numbers once per script execution and upload', async ({ page }) => {
//     const salesOrderSheet = new SalesOrderSheetPage(page);

//     const fixedStartPos = '2';
//     const fixedEndPos = '10';

//     // 1. DYNAMIC ACTION: Runs the fixed Column K updater and automatically syncs to the next sheet file
//     await incrementExcelProductionNumbers();
    
//     // Buffer timeout for file system processing
//     await page.waitForTimeout(1500);

//     // 2. UPLOAD ACTION: Performs navigation and upload form submission
//     console.log('Executing upload process with updated template numbers...');
//     await salesOrderSheet.uploadExcelSalesOrderSheet(fixedStartPos, fixedEndPos);

//     await page.pause();
//   });
// });


// import { test, expect } from '@playwright/test';
// import { LoginPage } from '../pages/Login.pom';
// import { SalesOrderSheetPage } from '../pages/Salesordersheet.pom';
// import * as ExcelJS from 'exceljs';
// import * as path from 'path';
// import * as XLSX from 'xlsx';

// function getExcelData() {
//   const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
//   const workbook = XLSX.readFile(filePath);
//   const sheetName = workbook.SheetNames[0];
//   const worksheet = workbook.Sheets[sheetName];
//   return XLSX.utils.sheet_to_json(worksheet);
// }

// // Interface to hold both values for syncing
// interface ProdData {
//   prodNo: string;
//   pairs: number;
// }

// // NEW HELPER: Writes production numbers and distributes the pairs quantity dynamically
// async function updateOrderSizeExcel(dataList: ProdData[]) {
//   const orderSizePath = path.resolve(__dirname, '../Sale_Order_Size (2).xlsx');
  
//   const workbook = new ExcelJS.Workbook();
//   await workbook.xlsx.readFile(orderSizePath);
  
//   const worksheet = workbook.worksheets[0]; 

//   if (!worksheet) {
//     console.error('Error: No worksheet found in Sale_Order_Size (2).xlsx');
//     return;
//   }

//   // Find target column indexes dynamically by scanning Row 1 headers
//   let prodNoColIndex = -1;
//   let col3Index = -1;
//   let col35Index = -1;
//   let col4Index = -1;

//   const headerRow = worksheet.getRow(1);
//   headerRow.eachCell((cell, colNumber) => {
//     const valStr = cell.value ? String(cell.value).trim() : '';
//     if (valStr === 'Production No') prodNoColIndex = colNumber;
//     if (valStr === '3#') col3Index = colNumber;
//     if (valStr === '3.5#') col35Index = colNumber;
//     if (valStr === '4#') col4Index = colNumber;
//   });

//   // HARDCODED FALLBACKS: If headers aren't detected by text, assign explicit column numbers here:
//   if (prodNoColIndex === -1) prodNoColIndex = 1; // e.g., Column A
//   if (col3Index === -1) col3Index = 2;          // Change to your exact column index if needed
//   if (col35Index === -1) col35Index = 3;        // Change to your exact column index if needed
//   if (col4Index === -1) col4Index = 4;          // Change to your exact column index if needed

//   console.log(`--- Syncing Data & Distributing Pairs Into Sale_Order_Size (2).xlsx ---`);

//   // Loop through rows 3 to 11 to populate numbers and breakdown pairs
//   for (let rowNum = 3; rowNum <= 11; rowNum++) {
//     const dataIndex = rowNum - 3; // Maps row 3 to array index 0, row 4 to index 1...
    
//     if (dataList[dataIndex] !== undefined) {
//       const item = dataList[dataIndex];
      
//       // 1. Set the Production Number cell
//       const cellProd = worksheet.getCell(rowNum, prodNoColIndex);
//       cellProd.value = item.prodNo;

//       // 2. Distribute pairs calculation logic
//       const totalPairs = item.pairs;
//       if (totalPairs > 0) {
//         // Equal breakdown flooring
//         const baseQty = Math.floor(totalPairs / 3); 
//         const remainder = totalPairs % 3;

//         // Distribute remainder step by step to ensure exact checksum match
//         const qty3 = baseQty;
//         const qty35 = baseQty + (remainder > 0 ? 1 : 0);
//         const qty4 = baseQty + (remainder > 1 ? 1 : 0);

//         worksheet.getCell(rowNum, col3Index).value = qty3;
//         worksheet.getCell(rowNum, col35Index).value = qty35;
//         worksheet.getCell(rowNum, col4Index).value = qty4;

//         console.log(`Row ${rowNum} | Prod: [${item.prodNo}] | Total Pairs: ${totalPairs} -> [3#]: ${qty3}, [3.5#]: ${qty35}, [4#]: ${qty4}`);
//       } else {
//         // Clear size values if pairs value is zero or empty
//         worksheet.getCell(rowNum, col3Index).value = 0;
//         worksheet.getCell(rowNum, col35Index).value = 0;
//         worksheet.getCell(rowNum, col4Index).value = 0;
//       }
//     }
//   }

//   // Save changes to the size template sheet file
//   await workbook.xlsx.writeFile(orderSizePath);
//   console.log('Sale_Order_Size (2).xlsx updated with exact calculations successfully.');
// }

// // FIXED HELPER: Reads Column K (Prod) & Column L (Pairs), auto-increments the digit, then updates target sheet
// async function incrementExcelProductionNumbers() {
//   const targetFilePath = path.resolve(__dirname, '../new_sales_order_sheet_format 1 - Copy-1 (6).xlsx');
  
//   const workbook = new ExcelJS.Workbook();
//   await workbook.xlsx.readFile(targetFilePath);
  
//   const worksheet = workbook.getWorksheet('Need Update');

//   if (!worksheet) {
//     console.error(`Error: Sheet named "Need Update" not found!`);
//     return;
//   }

//   const prodColumnIndex = 11;  // Column K (Production No)
//   const pairsColumnIndex = 12; // Column L (Pairs) <- Change to match your exact pairs column index if different
  
//   console.log(`--- Modifying Production Sheet Numbers & Extracting Pairs Count ---`);
  
//   const updatedDataList: ProdData[] = [];

//   // Loop through rows 2 to 10
//   for (let rowNum = 2; rowNum <= 10; rowNum++) {
//     const cellProd = worksheet.getCell(rowNum, prodColumnIndex);
//     const cellPairs = worksheet.getCell(rowNum, pairsColumnIndex);

//     const currentProdVal = cellProd.value ? String(cellProd.value).trim() : '';
//     const currentPairsVal = cellPairs.value ? Number(cellPairs.value) : 0;

//     let finalProdValue = currentProdVal;

//     if (currentProdVal) {
//       const match = currentProdVal.match(/(.*)(\d)$/);
      
//       if (match) {
//         const prefix = match[1];        
//         const lastDigitStr = match[2];  
//         const nextNum = (parseInt(lastDigitStr, 10) + 1) % 10;
        
//         finalProdValue = `${prefix}${nextNum}`;
//         cellProd.value = finalProdValue;
//         console.log(`Row ${rowNum} | Prod No Incremented to: [${finalProdValue}]`);
//       }
//     }

//     // Collect both new prod number and the original pairs quantity count
//     updatedDataList.push({
//       prodNo: finalProdValue,
//       pairs: isNaN(currentPairsVal) ? 0 : currentPairsVal
//     });
//   }

//   // Save data back into the original sheet template
//   await workbook.xlsx.writeFile(targetFilePath);
//   console.log('Original template saved successfully.');

//   // SYNC ACTION: Write the data list and run mathematical division injection on the second sheet
//   if (updatedDataList.length > 0) {
//     await updateOrderSizeExcel(updatedDataList);
//   }
// }

// test.describe('Sales Order Sheet Upload Test Suite', () => {
//   let loginPage: LoginPage;
//   let excelRows: any[];
  
//   test.beforeEach(async ({ page }) => {
//     await page.goto('/web/login');
//     loginPage = new LoginPage(page);
//     excelRows = getExcelData();
    
//     const validCredentials = excelRows[0];
//     const email = validCredentials.Email || validCredentials.email;
//     const password = validCredentials.Password || validCredentials.password;

//     await loginPage.login(email, password);
//     await expect(page).toHaveTitle('BOFL - My Dashboard');
//   });

//   test('Should auto-increment production numbers once per script execution and upload', async ({ page }) => {
//     const salesOrderSheet = new SalesOrderSheetPage(page);

//     const fixedStartPos = '2';
//     const fixedEndPos = '10';

//     await incrementExcelProductionNumbers();
//     await page.waitForTimeout(1500);

//     console.log('Executing upload process with updated template numbers...');
//     await salesOrderSheet.uploadExcelSalesOrderSheet(fixedStartPos, fixedEndPos);

//     await page.pause();
//   });
// });




import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { SalesOrderSheetPage } from '../pages/Salesordersheet.pom';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as XLSX from 'xlsx';

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

  // FIXED COLUMNS based on your input:
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

// Main Function: Reads Column K (Prod) & Column C (Pairs), increments last digit, then triggers sync
async function incrementExcelProductionNumbers() {
  const targetFilePath = path.resolve(__dirname, '../new_sales_order_sheet_format 1 - Copy-1 (6).xlsx');
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(targetFilePath);
  
  const worksheet = workbook.getWorksheet('Need Update');

  if (!worksheet) {
    console.error(`Error: Sheet named "Need Update" not found!`);
    return;
  }

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
      const match = currentProdVal.match(/(.*)(\d)$/);
      
      if (match) {
        const prefix = match[1];        
        const lastDigitStr = match[2];  
        const nextNum = (parseInt(lastDigitStr, 10) + 1) % 10;
        
        finalProdValue = `${prefix}${nextNum}`;
        cellProd.value = finalProdValue;
        console.log(`Row ${rowNum} | Prod No Incremented to: [${finalProdValue}]`);
      }
    }

    // Collect both new prod number and the original pairs quantity count from Column C
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

