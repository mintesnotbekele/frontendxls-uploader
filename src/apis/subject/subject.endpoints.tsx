import {API_URL} from "../../constants";
export const subjectEndPoint = {
  getSubjects:`${API_URL}/subject/getSubjects`, 
  toggleSubjectStatus:`${API_URL}/subject/toggleSubjectStatus`, 
  addSubject: `${API_URL}/subject/create`,
};
