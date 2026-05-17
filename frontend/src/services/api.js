import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Candidate APIs ───────────────────────────────────────────────────────────

export const addCandidate = (data) => api.post('/candidates', data);

export const getAllCandidates = (params = {}) => api.get('/candidates', { params });

export const getCandidateById = (id) => api.get(`/candidates/${id}`);

export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);

// ─── Match APIs ───────────────────────────────────────────────────────────────

export const shortlistCandidates = (data) => api.post('/match', data);

// ─── AI APIs ──────────────────────────────────────────────────────────────────

export const aiShortlist = (data) => api.post('/ai/shortlist', data);

export const generateInterviewQuestions = (data) => api.post('/ai/interview-questions', data);

export default api;
