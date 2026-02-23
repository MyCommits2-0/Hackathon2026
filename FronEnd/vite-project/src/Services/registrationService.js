import api from "./api";

export const registerStudentToBatch = (data) => {
  return api.post("/registrations", data);
};