import { API_BASE_URL, TEST_WA_ID, NGROK_HEADERS, handleResponse } from './api';

export const getCalendarEvents = async () => {
  const response = await fetch(`${API_BASE_URL}/calendar/list`, {
    method: 'POST',
    headers: NGROK_HEADERS,
    body: JSON.stringify({ wa_id: TEST_WA_ID })
  });
  return handleResponse(response);
};