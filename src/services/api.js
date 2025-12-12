// src/services/api.js

let apiUrl = 'https://whale-app-ccv5z.ondigitalocean.app'; 

export const API_BASE_URL = apiUrl;

export const BASE_HEADERS = { 
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json"
};

/**
 * Função auxiliar para tentar renovar o token
 */
const tryRefreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;

  try {
    // Faz a chamada "crua" para não cair em loop com o apiRequest
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: JSON.stringify({ refreshToken })
    });

    if (response.ok) {
      const data = await response.json();
      // Atualiza os tokens no storage (Token Rotation)
      localStorage.setItem('user_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      return data.accessToken;
    } else {
      // Se falhar (refresh expirado ou inválido), força logout
      throw new Error('Refresh expired');
    }
  } catch (error) {
    console.error("Falha ao renovar token:", error);
    localStorage.removeItem('user_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    window.location.href = '/login'; // Redireciona para login
    return null;
  }
};

/**
 * FETCH HELPER COM AUTO-REFRESH
 */
export const apiRequest = async (endpoint, options = {}) => {
  let token = localStorage.getItem('user_token');
  
  const getHeaders = (t) => ({
    ...BASE_HEADERS,
    ...(t ? { "Authorization": `Bearer ${t}` } : {})
  });

  const config = {
    ...options,
    headers: {
      ...getHeaders(token),
      ...options.headers 
    }
  };

  try {
    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // SE O BACKEND RETORNAR 403 (Token Expirado conforme seu middleware)
    if (response.status === 403) {
      console.warn("Token expirado (403). Tentando renovar...");
      
      const newToken = await tryRefreshToken();
      
      if (newToken) {
        // Tenta a requisição original novamente com o novo token
        const newConfig = {
            ...options,
            headers: {
                ...getHeaders(newToken),
                ...options.headers
            }
        };
        response = await fetch(`${API_BASE_URL}${endpoint}`, newConfig);
      }
    }

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const handleResponse = async (response) => {
  if (!response.ok) {
    // Se mesmo após o refresh continuar dando erro de auth
    if (response.status === 401 || response.status === 403) {
      console.warn("Acesso negado final.");
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `Erro ${response.status}`);
  }
  
  if (response.status === 204) return null;
  
  return await response.json();
};