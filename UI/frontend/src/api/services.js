import API from "./axios";

// 📚 Courses
export const getCourses = () => API.get("/courses");
export const addCourse = (data) => API.post("/courses", data);

// 📦 Batches
export const getBatches = () => API.get("/batches");
export const addBatch = (data) => API.post("/batches", data);
export const getBatchById = (id) => API.get(`/batches/${id}`);
export const getBatchesByCourse = (courseId) =>
  API.get(`/batches/course/${courseId}`);

// 👨‍🎓 Students
export const getStudents = () => API.get("/students");
export const addStudent = (data) => API.post("/students", data);

// 📝 Registration
export const registerStudent = (data) =>
  API.post("/registrations", data);

export const getMyRegistrations = (studentId) =>
  API.get(`/registrations/student/${studentId}`);

export const getRegistrations = () =>
  API.get("/registrations");

// 💰 Discounts
export const getDiscounts = () => API.get("/discounts");
export const addDiscount = (data) => API.post("/discounts", data);