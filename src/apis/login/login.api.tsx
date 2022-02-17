import axios from "axios";
import { ILogin } from "interfaces/login";
import { loginEndPoint } from "./login.endpoints";
import { httpService } from "helpers/api-helper";

export const login = ({ phoneNumber, password }: ILogin): any => {
  return httpService
    .post(`${loginEndPoint.login}`, { phoneNumber, password })
    .then((response) => {
      return response;
    });
};
