import { Page } from '@playwright/test';

export class LoginPage{

    constructor(private page: Page) { }//page hoilo variable r Page hoilo data type

    async fillEmailorPhone( emailorPhone : string  ){

       await this.page.getByRole( "textbox" , { name : "Email or Phone Number" } ).fill(emailorPhone);

      }

      async fillPassword(password : string){
        await this.page.getByRole( "textbox" , { name : "Password" } ).fill(password);
     
      }
      async clickLoginBtn(){
        await this.page.getByRole( "button" , { name : "LOGIN" } ).click()
      }


      //login hoyar por jei page ba dashboard ashbe seta jotokhon load na hbe opekkha korbe
      async waitforPageLOad(){
        await this.page.waitForLoadState("networkidle")
      }
      //choto choto method gula theke boro ekta method banabo
      async login(emailorPhone:string ,password:string){
      
        await this.fillEmailorPhone(emailorPhone);
        await this.fillPassword(password);
        await this.clickLoginBtn();
        await this.waitforPageLOad();


      }


}
