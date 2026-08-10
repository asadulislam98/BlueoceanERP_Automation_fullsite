import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import * as XLSX from 'xlsx';
import * as path from 'path';

// Helper function to read all rows of login credentials from Excel file
function getExcelData() {
  // Locate the Excel file at the project root directory
  const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
  
  // Read the workbook and access the first sheet
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];  
  
  // Convert sheet data into an array of JSON objects
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  // Debug log to see loaded Excel data in terminal
  console.log('Loaded Excel Data:', JSON.stringify(data, null, 2));
  
  return data;
} 

test.describe('Login Module Tests', () => {
  let loginPage: LoginPage;
  let excelRows: any[];

  // Runs before each individual test inside this suite
  test.beforeEach(async ({ page }) => {
    await page.goto('/web/login');
    loginPage = new LoginPage(page);
    
    // Load Excel data grid prior to test execution
    excelRows = getExcelData();
  });

  // Test Case 1: Login with valid credentials using Row 1 of Excel
  test('Should login successfully with valid credentials from Excel Row 1', async ({ page }) => {
    const validCredentials = excelRows[0];
    
    // Fallback logic in case Excel column headers vary in case
    const email = validCredentials.Email || validCredentials.email;
    const password = validCredentials.Password || validCredentials.password;

    console.log(`Executing Valid Login with: ${email}`);
    
    await loginPage.login(email, password);

    // Assert dashboard title
    await expect(page).toHaveTitle('BOFL - My Dashboard');
  });

  // Test Case 2: Login with invalid credentials using Row 2 of Excel
  test('Should display error message with invalid credentials from Excel Row 2', async () => {
    const invalidCredentials = excelRows[1];

    // Fallback logic in case Excel column headers vary in case
    const email = invalidCredentials.Email || invalidCredentials.email;
    const password = invalidCredentials.Password || invalidCredentials.password;

    console.log(`Executing Invalid Login with: ${email}`);

    await loginPage.login(email, password);
    
    // Passing exact expected text to verify against live UI actual message.
    // If there is even a single space, comma, or character mismatch, 
    // it will display the custom 10-second red UI banner and fail.
    await loginPage.verifyInvalidLogin('Wrong login/password');
  });
});

