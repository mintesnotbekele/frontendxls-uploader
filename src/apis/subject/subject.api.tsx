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
