//ekoi data diye 2 ba 3 bar jodi registration korte jai tokhon to error khabe : 
//ejonno utils e ei code gula rekhe dibo
export function generateRandomNumber(min: number, max: number) {

    const randomNumber = Math.random() * (max - min) + min;
    return Math.floor(randomNumber);
}

import { UserModel } from '../pages/usersModel/Person.model.ts';


//write jsondata
import fs from 'fs' //npm i fs install kore niyen

export function saveJSONData(jsonObject:object, fileLocation : string){
    let jsonArray=fs.readFileSync(fileLocation,"utf-8");
    let userDataArray=JSON.parse(jsonArray);
    userDataArray.push(jsonObject)
    fs.writeFileSync(fileLocation,JSON.stringify(userDataArray, null ,2 ))


}
//read json
export function getLatestUser(fileLocation: string): UserModel {

    let jsonArray = fs.readFileSync(fileLocation, 'utf-8');
    let userDataArray = JSON.parse(jsonArray);

    return userDataArray[userDataArray.length - 1];
}
