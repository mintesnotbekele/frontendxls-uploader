import {API_URL} from "../../constants";
export const uploadEndPoint = {
  getUploads: `${API_URL}/upload/getuploadentries`,
  addUploads: `${API_URL}/upload/createupload`,
  deleteUploads: `${API_URL}/upload/deleteUpload`,
  updateUploads: `${API_URL}/upload/updateUpload`,
};
