import { test, expect,} from '@playwright/test';
import { LoginPage } from '../pages/Login.pom.ts';
import { getLatestUser } from '../utils/Utils.ts';
test('Admin can login successfully', async ({page}) => {

    await page.goto("https://dmoneyportal.roadtocareer.net/login");
    const latestUser=getLatestUser("./resources/Users.json")

    const loginPageObj = new LoginPage(page);
    await loginPageObj.login(latestUser.email,latestUser.password);

    await page.pause();
  });


  