import axios from "axios";

import { uploadEndPoint } from "./upload.endpoints";
import { httpService } from "helpers/api-helper";

export const getgetUploads = (data: any): any => {
  return httpService
    .get(`${uploadEndPoint.getUploads}`, { params: data })
    .then((response) => {
      return response;
    })
};

export const updateUploadedEntry = (params: any): any => {
  return httpService
    .put(`${uploadEndPoint.updateUploads}`, params)
    .then((response) => {
      return response;
    });
};

export const createUploadedEntries = (params: any): any => {
  return httpService
    .post(`${uploadEndPoint.addUploads}`, params)
    .then((response) => {
      return response;
    });
};

export const deleteUploadedEntry = (id: string): any => {
  return httpService
    .delete(`${uploadEndPoint.deleteUploads}/${id}`)
    .then((response) => {
      return response;
    });
};
