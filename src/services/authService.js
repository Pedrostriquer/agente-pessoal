import { API_BASE_URL, BASE_HEADERS, handleResponse } from './api';

export const loginService = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: BASE_HEADERS,
    body: JSON.stringify({ email, password })
  });
  return handleResponse(response);
};

export const loginWithGoogleService = async (idToken) => {
  const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
    method: 'POST',
    headers: BASE_HEADERS,
    body: JSON.stringify({ idToken })
  });
  return handleResponse(response);
};

export const getGoogleAuthUrl = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/google-connect`, {
    method: 'GET',
    headers: BASE_HEADERS
  });
  return handleResponse(response);
};