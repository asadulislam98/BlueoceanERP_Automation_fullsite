import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom';
import { GetMaterialListPage } from '../pages/GetmaterialList.pom';
import * as XLSX from 'xlsx';
import * as path from 'path';

function getLoginCredentials() {
    const filePath = path.resolve(__dirname, '../LoginInfo.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(worksheet);
    return rows[0];
}

test.describe('Get Material List Direct Workflow', () => {
    let loginPage: LoginPage;
    let getMaterialListPage: GetMaterialListPage;

    test.beforeEach(async ({ page }) => {
        await page.goto('/web/login');

        loginPage = new LoginPage(page);
        getMaterialListPage = new GetMaterialListPage(page);

        const credentials = getLoginCredentials();
        const email = credentials.Email || credentials.email;
        const password = credentials.Password || credentials.password;

        await loginPage.login(email, password);
        await expect(page).toHaveTitle('BOFL - My Dashboard');
    });

    test('Execute Get Material List and Mark Done Process', async () => {
        await getMaterialListPage.executeGetMaterialListFlow();
    });

    
});