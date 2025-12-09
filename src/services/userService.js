import { API_BASE_URL, NGROK_HEADERS, handleResponse } from './api';

export const createUserService = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users/create`, {
    method: 'POST',
    headers: NGROK_HEADERS,
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};