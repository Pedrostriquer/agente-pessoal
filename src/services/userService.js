// CORREÇÃO: Importar 'BASE_HEADERS' em vez de 'PUBLIC_HEADERS'
import { API_BASE_URL, BASE_HEADERS, handleResponse } from './api';

export const createUserService = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users/create`, {
    method: 'POST',
    // CORREÇÃO: Usar a variável correta aqui também
    headers: BASE_HEADERS,
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};