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

export const generateCoverLetter = (resumeId, jobDescription = null) =>
  apiClient.post(`/resumes/${resumeId}/cover-letter`, {
    job_description: jobDescription,
  });

export const generateInterviewQuestions = (resumeId, jobDescription = null) =>
  apiClient.post(`/resumes/${resumeId}/interview-questions`, {
    job_description: jobDescription,
  });  

export const generateLearningRoadmap = (resumeId, missingSkills, jobDescription = null) =>
  apiClient.post(`/resumes/${resumeId}/roadmap`, {
    missing_skills: missingSkills,
    job_description: jobDescription,
  });

export const deleteResume = (resumeId) =>
  apiClient.delete(`/resumes/${resumeId}`);

export const chatWithResume = (resumeId, question, conversationHistory) =>
  apiClient.post(`/resumes/${resumeId}/chat`, {
    question,
    conversation_history: conversationHistory,
  });