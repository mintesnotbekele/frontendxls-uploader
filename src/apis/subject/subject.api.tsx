import { subjectEndPoint } from "./subject.endpoints";
import { httpService } from "helpers/api-helper";

export const getSubjects = (): any => {
  return httpService
    .get(`${subjectEndPoint.getSubjects}`)
    .then((response) => {
      return response;
    });
};

export const toggleSubjectStatus = (id: string): any => {
  return httpService
    .post(`${subjectEndPoint.toggleSubjectStatus}`, {id})
    .then((response) => {
      return response;
    });
};

export const createSubject = (params:any): any => {
  return httpService
    .post(`${subjectEndPoint.addSubject}`, params)
    .then((response) => {
      return response;
    });
};

export const updateSubject = (params:any): any => {
  return httpService
    .put(`${subjectEndPoint.updateSubject}`, params)
    .then((response) => {
      return response;
    });
};

export const deleteSubject = (params:any): any => {
  return httpService
    .delete(`${subjectEndPoint.updateSubject}`, params)
    .then((response) => {
      return response;
    });
};

