import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (email, username, fullName, password) =>
    apiClient.post('/auth/register', { email, username, fullName, password }),
  
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  
  getProfile: () =>
    apiClient.get('/auth/me'),
};

export const problemService = {
  getProblems: (page = 1, limit = 10, difficulty = null) =>
    apiClient.get('/problems', { params: { page, limit, difficulty } }),
  
  getProblem: (id) =>
    apiClient.get(`/problems/${id}`),
  
  createProblem: (problemData) =>
    apiClient.post('/problems', problemData),
  
  updateProblem: (id, data) =>
    apiClient.put(`/problems/${id}`, data),
};

export const interviewService = {
  createInterview: (data) =>
    apiClient.post('/interviews', data),
  
  getInterview: (id) =>
    apiClient.get(`/interviews/${id}`),
  
  getUserInterviews: () =>
    apiClient.get('/interviews/user/interviews'),
  
  updateInterview: (id, data) =>
    apiClient.put(`/interviews/${id}`, data),
  
  executeCode: (interviewId, code, language, input = '') =>
    apiClient.post(`/interviews/${interviewId}/execute`, { code, language, input }),
  
  submitSolution: (interviewId, code, language, problemId) =>
    apiClient.post(`/interviews/${interviewId}/solutions`, { code, language, problemId }),
  
  getInterviewSolutions: (interviewId) =>
    apiClient.get(`/interviews/${interviewId}/solutions`),
};

export default apiClient;
