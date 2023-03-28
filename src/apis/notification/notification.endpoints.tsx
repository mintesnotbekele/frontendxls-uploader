import {API_URL} from "../../constants";
export const NotificationEndPoint = {
  getNotification: `${API_URL}/notify/getNotifications`,
  addNotification: `${API_URL}/notify/createNotification`,
  deleteNotification: `${API_URL}/notify/deleteNotification`,
  updateNotification: `${API_URL}/notofy/updateNotification`,
};