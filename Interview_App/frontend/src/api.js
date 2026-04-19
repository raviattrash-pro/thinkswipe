import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"
});

export const fetchQuestions = async () => {
  const response = await api.get("/questions/feed");
  return response.data;
};

export const submitAnswer = async ({ questionId, userAnswer }) => {
  const response = await api.post("/answer", { questionId, userAnswer });
  return response.data;
};

export const likeQuestion = async (questionId) => {
  await api.post(`/questions/${questionId}/like`);
};

export const fetchPerformanceSummary = async () => {
  const response = await api.get("/questions/performance/summary");
  return response.data;
};
