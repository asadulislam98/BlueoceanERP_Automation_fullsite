import { Page } from '@playwright/test';
import { Role,UserModel } from './usersModel/Person.model';

export class RegistrationPage{

    constructor(private page: Page) { }
    async clickCreateMenu(){
     await this.page.locator('span', { hasText: 'Create User' }).first().click();


    }

    async fillName(name : string){
        await this.page.getByRole("textbox",{name:"Name"}).fill(name)
    }
    async fillEmail(email : string){
        await this.page.getByRole("textbox",{name:"Email"}).fill(email)
    }

    async fillPassword(password : string){
        await this.page.getByRole("textbox",{name:"Password"}).fill(password)
    }

    async fillPhoneNumber(phonenum : string){
        await this.page.getByRole("textbox",{name:"Phone Number"}).fill(phonenum)
    }

    async fillNID(nid : string){
        await this.page.getByRole("textbox",{name:"NID"}).fill(nid)
    }
    async selectRole(role  ?: Role){
        await this.page.getByRole("combobox",{exact : true}).click()
        await this.page.getByRole("option",{name:role}).click()
        //name:role deyar karon kokhon admin pass korbo kokhono merchant kokhono agent pass korbo tai.

    }

     async clickCreateUser(){
        await this.page.getByRole("button",{name:"CREATE USER"}).click()
    }
    /*
    //all small method inside into createUser() method
    //async createUser(name:string,email:string,password:string,phonenum : string,nid : string,role : string){
    //evabe kotogula parameter hoye jay kheyal koren eto parameter evabe pass kora thik hbena.
    //etar solution provide kore Usermodel concept
    //registration er somoy user model toiri korte hoy
    //userModel name ekta folder create kore etar solution kori

    await this.clickCreateMenu()
    await this.fillName();
    await this.fillEmail();
    await this.fillPassword();
    await this.fillPhoneNumber();
    await this.fillNID();
    await this.selectRole();
    await this.clickCreateUser();

    }
    */
   //function calling 
    async createUser(userModel : UserModel){
    await this.clickCreateMenu()
    await this.fillName(userModel.fullName);
    await this.fillEmail(userModel.email);
    await this.fillPassword(userModel.password);
    await this.fillPhoneNumber(userModel.phoneNumber);
    await this.fillNID(userModel.nid);
    await this.selectRole(userModel.role);
    await this.clickCreateUser();

}
}


