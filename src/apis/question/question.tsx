import axios from "axios";
import { ILogin } from "interfaces/login";
import { questionEndPoint } from "./question.endpoints";
import { httpService } from "helpers/api-helper";

export const getQuestions = (): any => {
  return httpService
    .get(`${questionEndPoint.getQuestions}`)
    .then((response) => {
      return response;
    });
};

export const createQuestion = (params:any): any => {
  return httpService
    .post(`${questionEndPoint.addQuestions}`, params)
    .then((response) => {
      return response;
    });
};
