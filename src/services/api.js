import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export const apiAuth = {
  login: (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then((r) => {
      const accessToken = r.data?.access_token || r.data?.token || r.data;
      return { ...r.data, token: accessToken };
    });
  },
  register: (username, email, password, full_name) =>
    api.post('/auth/register', { username, email, password, full_name }).then((r) => r.data),
};

export const apiLists = {
  list: () => api.get('/wordlists').then((r) => r.data),
  create: (payload) => api.post('/wordlists/', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/wordlists/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/wordlists/${id}`).then((r) => r.data),
  words: (id) => api.get(`/words/list/${id}`).then((r) => r.data),
  addWord: (list_id, payload) => api.post('/words/', { list_id, ...payload }).then((r) => r.data),
};

export const apiWords = {
  update: (id, payload) => api.put(`/words/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/words/${id}`).then((r) => r.data),
};

export const apiOCR = {
  extract: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api
      .post('/ocr/extract', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },
  extractAndAdd: (listId, file) => {
    const form = new FormData();
    form.append('file', file);
    return api
      .post(`/ocr/extract-and-add/${listId}`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },
};

export const apiStats = {
  get: () => api.get('/stats/me').then((r) => r.data),
  word: (wordId) => api.get(`/stats/word/${wordId}`).then((r) => r.data),
  list: (listId) => api.get(`/stats/list/${listId}`).then((r) => r.data),
};

export const apiQuiz = {
  flashcard: () => api.get('/quiz/flashcard').then((r) => r.data),
  multipleChoice: () => api.get('/quiz/multiple-choice').then((r) => r.data),
  typing: () => api.get('/quiz/typing').then((r) => r.data),
  submit: (payload) => api.post('/quiz/answer', payload).then((r) => r.data),
  dueCount: () => api.get('/quiz/due-count').then((r) => r.data),
};

export default api;
