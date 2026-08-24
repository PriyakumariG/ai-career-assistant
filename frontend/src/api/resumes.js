import apiClient from "./client";

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post("/resumes/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const listResumes = () => apiClient.get("/resumes");

export const getResume = (resumeId) => apiClient.get(`/resumes/${resumeId}`);

export const analyzeResume = (resumeId, jobDescription = null) =>
  apiClient.post(`/resumes/${resumeId}/analyze`, {
    job_description: jobDescription,
  });