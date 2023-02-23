import {API_URL} from "../../constants";
export const usersEndPoint = {
  toggleUserStatus: `${API_URL}/users/toggleUserStatus`,
  getProfile: `${API_URL}/users/getProfile`,
  getUsers: `${API_URL}/users/getUsers`,
  updateProfile: `${API_URL}/users/updateProfile`,
  passPayment: `${API_URL}/users/passPayment`,
};
