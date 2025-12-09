import { API_BASE_URL, TEST_WA_ID, NGROK_HEADERS, handleResponse } from './api';

export const getIdeasList = async () => {
  const response = await fetch(`${API_BASE_URL}/ideas/list`, {
    method: 'POST',
    headers: NGROK_HEADERS,
    body: JSON.stringify({ wa_id: TEST_WA_ID })
  });
  return handleResponse(response);
};

export const addIdea = async (content) => {
  const response = await fetch(`${API_BASE_URL}/ideas/create`, {
    method: 'POST',
    headers: NGROK_HEADERS,
    body: JSON.stringify({
      wa_id: TEST_WA_ID,
      content,
      tags: []
    })
  });
  return handleResponse(response);
};

export const removeIdea = async (ideaId) => {
  const response = await fetch(`${API_BASE_URL}/ideas/${ideaId}`, {
    method: 'DELETE',
    headers: NGROK_HEADERS,
    body: JSON.stringify({ wa_id: TEST_WA_ID })
  });
  return handleResponse(response);
};