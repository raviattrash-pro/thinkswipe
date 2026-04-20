import axios from "axios";

// --- VISITOR ID (anonymous tracking) ---
export function getVisitorId() {
  let id = localStorage.getItem("thinkswipe_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("thinkswipe_visitor_id", id);
  }
  return id;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"
});

// Attach visitorId to every request
api.interceptors.request.use((config) => {
  config.headers["X-Visitor-Id"] = getVisitorId();
  return config;
});

// --- FEED & CORE ---
export const fetchQuestions = async (page = 0) => {
  const response = await api.get("/questions/feed", { params: { page } });
  return response.data;
};

export const fetchDailyChallenge = async () => {
  const response = await api.get("/questions/daily");
  return response.data;
};

export const fetchByCompany = async (company) => {
  const response = await api.get(`/questions/company/${company}`);
  return response.data;
};

export const skipQuestion = async (id) => {
  await api.post(`/questions/${id}/skip`);
};

// --- SEARCH ---
export const searchQuestions = async (query) => {
  const response = await api.get("/questions/search", { params: { q: query } });
  return response.data;
};

// --- ANSWER & CODE ---
export const submitAnswer = async ({ questionId, userAnswer }) => {
  const response = await api.post("/answer", { questionId, userAnswer });
  return response.data;
};

export const executeCode = async (script, language = "java") => {
  const response = await api.post("/questions/execute-code", { script, language });
  return response.data;
};

// --- LIKE ---
export const likeQuestion = async (questionId) => {
  await api.post(`/questions/${questionId}/like`);
};

// --- LEADERBOARD ---
export const fetchLeaderboard = async () => {
  const response = await api.get("/leaderboard");
  return response.data;
};

export const updateLeaderboardProgress = async (score) => {
  await api.post("/leaderboard/update", { score });
};

// --- PUSH ---
export const subscribePush = async (subscription) => {
  await api.post("/push/subscribe", subscription);
};

// --- PERFORMANCE ---
export const fetchPerformanceSummary = async () => {
  const response = await api.get("/questions/performance/summary");
  return response.data;
};

// --- USER SUBMISSIONS ---
export const submitUserQuestion = async (data) => {
  const response = await api.post("/submit/question", data);
  return response.data;
};

export const submitUserComment = async (data) => {
  const response = await api.post("/submit/comment", data);
  return response.data;
};

// --- VISITOR PING ---
export const pingVisitor = async (platform, questionsAttempted) => {
  try {
    await api.post("/submit/ping", {
      platform,
      questionsAttempted: String(questionsAttempted)
    });
  } catch (e) {
    // silent fail
  }
};

// --- ADMIN (requires token header) ---
const ADMIN_TOKEN = "admin123";
const adminHeaders = { "X-Admin-Token": ADMIN_TOKEN };

export const fetchAdminStats = async () => {
  const response = await api.get("/admin/stats", { headers: adminHeaders });
  return response.data;
};

export const fetchAdminAnalyticsQuestions = async () => {
  const response = await api.get("/admin/analytics/questions", { headers: adminHeaders });
  return response.data;
};

export const fetchAdminAnalyticsRetention = async () => {
  const response = await api.get("/admin/analytics/retention", { headers: adminHeaders });
  return response.data;
};

export const fetchAdminAnalyticsFunnel = async () => {
  const response = await api.get("/admin/analytics/funnel", { headers: adminHeaders });
  return response.data;
};

export const fetchAdminAnalyticsPopular = async () => {
  const response = await api.get("/admin/analytics/popular", { headers: adminHeaders });
  return response.data;
};

export const bulkImportQuestions = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/admin/questions/bulk-import", formData, {
    headers: { ...adminHeaders, "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

export const fetchAdminSubmissions = async () => {
  const response = await api.get("/admin/submissions", { headers: adminHeaders });
  return response.data;
};

export const approveSubmission = async (id) => {
  const response = await api.post(`/admin/submissions/${id}/approve`, {}, { headers: adminHeaders });
  return response.data;
};

export const deleteSubmission = async (id) => {
  const response = await api.delete(`/admin/submissions/${id}`, { headers: adminHeaders });
  return response.data;
};

export const fetchAdminComments = async () => {
  const response = await api.get("/admin/comments", { headers: adminHeaders });
  return response.data;
};

export const approveComment = async (id) => {
  const response = await api.post(`/admin/comments/${id}/approve`, {}, { headers: adminHeaders });
  return response.data;
};

export const deleteComment = async (id) => {
  const response = await api.delete(`/admin/comments/${id}`, { headers: adminHeaders });
  return response.data;
};

export const fetchAdminVisitors = async () => {
  const response = await api.get("/admin/visitors", { headers: adminHeaders });
  return response.data;
};
