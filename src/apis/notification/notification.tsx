import { NotificationEndPoint } from "apis/notification/notification.endpoints";
import { httpService } from "helpers/api-helper";

export const getNotification = (data: any): any => {
    return httpService
      .get(`${NotificationEndPoint.getNotification}`, { params: data })
      .then((response) => {
        return response;
      })
  };
export const createNotification = (params: any): any => {
  return httpService
    .post(`${NotificationEndPoint.addNotification}`, params)
    .then((response) => {
      return response;
    });
};

export const deleteNotification=(id: any)=>{
    return httpService
    .delete(`${NotificationEndPoint.deleteNotification}/${id}`)
    .then((response) => {
      return response;
    });
}