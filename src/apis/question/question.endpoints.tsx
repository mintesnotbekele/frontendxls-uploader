import {API_URL} from "../../constants";
export const questionEndPoint = {
  getQuestions: `${API_URL}/question/getQuestions`,
  addQuestions: `${API_URL}/question/create`,
  deleteQuestion: `${API_URL}/question/deleteQuestion`,
  updateQuestion: `${API_URL}/question/updateQuestion`,
};
