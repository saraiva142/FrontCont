import { supabase } from './supabase.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const getAuthHeaders = async () => {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const api = {
  async get(url) {
    const response = await fetch(`${BACKEND_URL}${url}`, {
      headers: await getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  async post(url, data) {
    const response = await fetch(`${BACKEND_URL}${url}`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  async upload(url, formData) {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const response = await fetch(`${BACKEND_URL}${url}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  }
};

// Specific API methods
export const analysisAPI = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload('/api/analysis/upload', formData);
  },

  analyzeText: (text) => {
    return api.post('/api/analysis/upload', { text });
  },

  getHistory: () => {
    return api.get('/api/analysis/history');
  }
};

export const insightsAPI = {
  askQuestion: (question) => {
    return api.post('/api/insights/ask', { question });
  }
};

export const authAPI = {
  getSession: () => {
    return api.get('/api/auth/session');
  }
};