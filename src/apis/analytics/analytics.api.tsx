import axios from "axios";
import { ILogin } from "interfaces/login";
import { analyticsEndPoint } from "./analytics.endpoints";
import { httpService } from "helpers/api-helper";

export const getAnalytics = (): any => {
  return httpService
    .get(`${analyticsEndPoint.getAnalytics}`)
    .then((response) => {
      return response;
    });
};
