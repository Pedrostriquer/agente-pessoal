// src/services/api.js

// Lógica segura para definir a URL base
let apiUrl = 'https://b9485e9074c8.ngrok-free.app'; // Fallback padrão

// 1. Tenta pegar do Vite (import.meta.env)
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
  apiUrl = import.meta.env.VITE_API_BASE_URL;
} 
// 2. Tenta pegar do CRA/Node (process.env) de forma segura
else if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE_URL) {
  apiUrl = process.env.REACT_APP_API_BASE_URL;
}

export const API_BASE_URL = apiUrl;

// Headers padrão (Ngrok + JSON)
export const BASE_HEADERS = { 
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json"
};

/**
 * FETCH HELPER
 * Adiciona automaticamente o Token em todas as chamadas.
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('user_token');
  
  const headers = {
    ...BASE_HEADERS,
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };

  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers 
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      console.warn("Sessão inválida ou expirada.");
      // localStorage.removeItem('user_token');
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `Erro ${response.status}`);
  }
  
  if (response.status === 204) return null;
  
  return await response.json();
};