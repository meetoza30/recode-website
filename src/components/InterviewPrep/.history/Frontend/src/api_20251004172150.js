import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  updateProfile: async (userId, profileData) => {
    const response = await api.post(`/users/profile/${userId}`, profileData);
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/users/get/${userId}`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/users/gets'); // or whatever your route is
    return response.data;
  }
};

// Experience Services - UPDATED TO USE GET REQUESTS
export const experienceService = {
  getAllExperiences: async (userId) => {
    const response = await api.get(`/interview/gets?id=${userId}`);
    return response.data;
  },

  getRecommendedExperiences: async (userId) => {
    const response = await api.get(`/interview/gets/knn?id=${userId}`);
    return response.data;
  },

  getExperience: async (id) => {
    const response = await api.get(`/interview/gets/${id}`);
    return response.data;
  },

  addExperience: async (experienceData) => {
    const response = await api.post('/interview/add', experienceData);
    return response.data;
  },

  updateExperience: async (id, experienceData) => {
    const response = await api.put(`/interview/update/${id}`, experienceData);
    return response.data;
  },

  deleteExperience: async (id) => {
    const response = await api.delete(`/interview/delete/${id}`);
    return response.data;
  },

  addView: async (id) => {
    const response = await api.patch(`/interview/view/${id}`);
    return response.data;
  }
};

// Company Services
export const companyService = {
  getCompanies: async () => {
    const response = await api.get('/companies/get');
    return response.data;
  },

  addCompany: async (companyData) => {
    const response = await api.post('/companies/add', companyData);
    return response.data;
  },

  updateCompany: async (id, companyData) => {
    const response = await api.put(`/companies/update/${id}`, companyData);
    return response.data;
  },

  deleteCompany: async (id) => {
    const response = await api.delete(`/companies/delete/${id}`);
    return response.data;
  }
};

// Saved Article Services
export const savedArticleService = {
  getSavedArticles: async (userId) => {
    const response = await api.get(`/saved-articles/${userId}`);
    return response.data;
  },

  saveArticle: async (userId, articleId) => {
    const response = await api.post(`/saved-articles/${userId}`, { 
      article_id: articleId 
    });
    return response.data;
  },

  deleteSavedArticle: async (userId, articleId) => {
    const response = await api.delete(`/saved-articles/${userId}`, { 
      data: { article_id: articleId } 
    });
    return response.data;
  }
};

// Add this to your existing api.js file in the services section

// Roadmap Services
export const roadmapService = {
  generateRoadmap: async (company, userQuery) => {
    const response = await api.post('/roadmap/generate', { company, userQuery });
    return response.data;
  },

  saveRoadmap: async (userId, roadmapName, roadmap) => {
    const response = await api.post('/roadmap/save', {
      userId,
      roadmapName, 
      roadmap
    });
    return response.data;
  },

  getUserRoadmaps: async (userId) => {
    const response = await api.get(`/roadmap/user/${userId}`);
    return response.data;
  },

  getRoadmap: async (roadmapId) => {
    const response = await api.get(`/roadmap/${roadmapId}`);
    return response.data;
  },

  updateRoadmapProgress: async (roadmapId, roadmap) => {
    const response = await api.patch(`/roadmap/${roadmapId}/progress`, {
      roadmap
    });
    return response.data;
  }
};


export const quizService = {
  updateQuizScore: async (userId, scores) => {
    const response = await api.patch(`/users/score/${userId}`, { scores });
    return response.data;
  }
};

export default api;