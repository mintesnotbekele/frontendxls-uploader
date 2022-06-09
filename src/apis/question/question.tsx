import axios from "axios";
import { ILogin } from "interfaces/login";
import { questionEndPoint } from "./question.endpoints";
import { httpService } from "helpers/api-helper";

export const getQuestions = (data: any): any => {
  return httpService
    .get(`${questionEndPoint.getQuestions}`, { params: data })
    .then((response) => {
      return response;
    })
};

export const updateQuestion = (params: any): any => {
  return httpService
    .put(`${questionEndPoint.updateQuestion}`, params)
    .then((response) => {
      return response;
    });
};

export const createQuestion = (params: any): any => {
  return httpService
    .post(`${questionEndPoint.addQuestions}`, params)
    .then((response) => {
      return response;
    });
};

export const deleteQuestion = (id: string): any => {
  return httpService
    .delete(`${questionEndPoint.deleteQuestion}/${id}`)
    .then((response) => {
      return response;
    });
};
