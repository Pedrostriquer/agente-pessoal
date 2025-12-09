import { apiRequest } from './api';

export const getIdeasList = async () => {
  // GET /ideas
  return apiRequest('/ideas', { method: 'GET' });
};

export const addIdea = async (content) => {
  // POST /ideas
  return apiRequest('/ideas', {
    method: 'POST',
    body: JSON.stringify({ content, tags: [] })
  });
};

export const removeIdea = async (ideaId) => {
  // DELETE /ideas/:ideaId
  return apiRequest(`/ideas/${ideaId}`, { method: 'DELETE' });
};