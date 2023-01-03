import axios from "axios";
import { ILogin } from "interfaces/login";
import { studyEndPoint } from "./study.endpoints";
import { httpService } from "helpers/api-helper";

export const getStudies = (data: any): any => {
  return httpService
    .get(`${studyEndPoint.getStudies}`, { params: data })
    .then((response) => {
      return response;
    })
};

export const updateQuestion = (params: any): any => {
  return httpService
    .put(`${studyEndPoint.updateQuestion}`, params)
    .then((response) => {
      return response;
    });
};

export const createStudy = (params: any): any => {
  return httpService
    .post(`${studyEndPoint.addStudies}`, params)
    .then((response) => {
      return response;
    });
};

export const deleteStudy = (id: string): any => {
  return httpService
    .delete(`${studyEndPoint.deleteQuestion}/${id}`)
    .then((response) => {
      return response;
    });
};
