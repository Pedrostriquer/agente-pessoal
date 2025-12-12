import { apiRequest } from './api';

export const listEmails = async (query = 'is:unread') => {
  const data = await apiRequest(`/gmail/list?query=${encodeURIComponent(query)}`, { method: 'GET' });
  
  // Tratamento de Autenticação Pendente
  if (data && data.status === 'auth_required' && data.authUrl) {
    window.location.href = data.authUrl;
    return [];
  }
  
  return data;
};

export const readEmail = async (messageId) => {
  const data = await apiRequest(`/gmail/read/${messageId}`, { method: 'GET' });
  
  if (data && data.status === 'auth_required' && data.authUrl) {
    window.location.href = data.authUrl;
    return null;
  }

  return data;
};