export enum Role {

  Admin = "Admin",
  Agent = "Agent",
  Customer = "Customer",
  Merchant = "Merchant"

}

export interface UserModel {

  fullName : string,
  email : string,
  password : string,
  phoneNumber : string,
  nid : string,
  role ?: Role

}

