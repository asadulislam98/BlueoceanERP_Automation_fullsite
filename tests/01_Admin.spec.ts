import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/Login.pom.ts';
import { RegistrationPage } from '../pages/Registration.pom.ts';
import { UserModel ,Role } from '../pages/usersModel/Person.model.ts';
import { faker } from '@faker-js/faker';
import { generateRandomNumber,saveJSONData,getLatestUser } from '../utils/Utils.ts';


test.describe.serial("Admin activity", () => {

    let page : Page;

test.beforeAll( async({browser}) => {

    page = await browser.newPage();

} )

test.afterAll( async()=>{

    await page.close();

} )

  //admin login code 
  test('Admin can login successfully', async () => {

    await page.goto("https://dmoneyportal.roadtocareer.net/login");

    const loginPageObj = new LoginPage(page);
    await loginPageObj.login("admin@dmoney.com", "1234");

    
  });
  
 
  //Registration code 
  test('Admin can Register successfully', async () => {

    const registrationObject = new RegistrationPage(page);

    //model banate hoy ekhane  
    const user : UserModel={
        //faker install command : npm install @faker-js/faker --save-dev
        fullName : faker.person.fullName(),
        email: `Asad+9292+${generateRandomNumber(1000,10000)}@gmail.com`,

        //ekek bar ekek email hbe etar code utils e ache
        password :"1234",
        phoneNumber: `01755${generateRandomNumber(100000, 999999)}`,

        nid:"4512520193",
        //role:"abc"//enum er gurutto dekhun string pass korle hbena error dekhabe.
        role:Role.Admin

    }
    await registrationObject.createUser(user)
    saveJSONData(user,"./resources/Users.json")


    
  });

});



//01_Admin.spec.ts 
//02_Users.spec.ts 
//evabe save dile prothome 01_Admin.spec.ts ei file run hbe erpor 02_Users.spec.ts ei file run hbe jokhon eksathe sob run hbe.