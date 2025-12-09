import { API_BASE_URL, NGROK_HEADERS, handleResponse } from './api';

export const loginService = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: NGROK_HEADERS,
    body: JSON.stringify({ email, password })
  });
  return handleResponse(response);
};