import axios from "axios";
import { ILogin } from "interfaces/login";
import { usersEndPoint } from "./users.endpoints";
import { httpService } from "helpers/api-helper";

export const getUsers = (data: any): any => {
  return httpService
    .get(`${usersEndPoint.getUsers}`, { params: data })
    .then((response) => {
      return response;
    });
};

export const getProfile = (): any => {
  return httpService
    .get(`${usersEndPoint.getProfile}`)
    .then((response) => {
      return response;
    });
};

export const updateProfile = (data: any): any => {
  return httpService
    .put(`${usersEndPoint.updateProfile}`, data)
    .then((response) => {
      return response;
    });
};

export const toggleUserStatus = (id : string): any => {
  return httpService
    .post(`${usersEndPoint.toggleUserStatus}`, { id})
    .then((response) => {
      return response;
    });
};
export const passPayment= (userid: string): any=>{
  
  return httpService
  .post(`${usersEndPoint.passPayment}`, { userid})
  .then((response) => {
    return response;
  });
}

