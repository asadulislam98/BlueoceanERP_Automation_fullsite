import { expect, test } from '@playwright/test';
import { SampleSheetToProductionPage } from '../pages/Sample_sheet_to_production.pom';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

// Helper function to read all rows of login credentials from Excel file
function getExcelData() {
  const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];   
  
  return XLSX.utils.sheet_to_json(worksheet);
}

// Helper function to read saved article number from JSON
function getArticleNoFromJson(): string {
  const jsonPath = path.resolve(__dirname, '../article_no.json');
  
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`JSON file not found at path: ${jsonPath}`);
  }

  const fileData = fs.readFileSync(jsonPath, 'utf-8');
  const parsedData = JSON.parse(fileData);

  console.log(`Retrieved Article No from JSON: [${parsedData.articleNo}]`);
  return parsedData.articleNo;
}

test.describe('Sample Sheet to Production - Login Test', () => {
  let sampleSheetPage: SampleSheetToProductionPage;
  let excelRows: any[];

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/login');
    sampleSheetPage = new SampleSheetToProductionPage(page);
    excelRows = getExcelData();
  });

  test('Should login, navigate to Size Info, fill grid, save, and complete Sample Sheet workflow', async ({ page }) => {
    const validCredentials = excelRows[0];
    const email = validCredentials.Email || validCredentials.email;
    const password = validCredentials.Password || validCredentials.password;

    console.log(`Executing Valid Login with: ${email}`);
    
    await sampleSheetPage.login(email, password);
    await expect(page).toHaveTitle('BOFL - My Dashboard');

    // 1. Navigate to BOFL Custom Module
    await sampleSheetPage.navigateToBoflCustomModule();

    // 2. Click Sample button and navigate to Size Info
    await sampleSheetPage.openSizeInfo();

    // 3. Read Article No from article_no.json
    const articleNo = getArticleNoFromJson();

    // 4. Click on the "New" button
    await sampleSheetPage.clickNewButton();

    // 5. Fill Article No field with the value from JSON
    await sampleSheetPage.fillArticleNo(articleNo);
    console.log(`Successfully pasted Article No [${articleNo}] into input field.`);

    // 6. Click on the "Load Size" button
    await sampleSheetPage.clickLoadSizeButton();
    console.log('Clicked Load Size button successfully.');

    // 7. Fill cell inputs in the table grid
    await sampleSheetPage.fillSizeGridDetails();
    console.log('Successfully filled all size grid table inputs.');

    // 8. Click "Save manually" button
    await sampleSheetPage.clickSaveManuallyButton();
    console.log('Clicked Save manually button successfully.');

    // 9. Step: Click Sample -> Sample Sheet -> New -> Fill Article No -> Save manually
    await sampleSheetPage.completeSampleSheetWorkflow(articleNo);
    console.log('Successfully completed Sample Sheet final workflow.');

    // 10. Step: Sales Order to Production Sheet Workflow with updated Checkbox Class Selector
    await sampleSheetPage.completeSalesOrderToProductionWorkflow(articleNo);
    console.log('Successfully completed Sales Order to Production Sheet workflow.');
  });
});