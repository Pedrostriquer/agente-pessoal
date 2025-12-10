import { apiRequest } from './api';

export const getCalendarEvents = async () => {
  return apiRequest('/calendar/list', { method: 'POST' });
};

export const createCalendarEvent = async (eventData) => {
  return apiRequest('/calendar/create', {
    method: 'POST',
    body: JSON.stringify(eventData)
  });
};

export const deleteCalendarEvent = async (eventId) => {
  return apiRequest('/calendar/delete', {
    method: 'POST',
    body: JSON.stringify({ event_id: eventId })
  });
};

// --- NOVA FUNÇÃO DE UPDATE ---
// Como não há rota de PATCH no backend, removemos o antigo e criamos um novo
export const updateCalendarEvent = async (oldEventId, newEventData) => {
  await deleteCalendarEvent(oldEventId);
  return createCalendarEvent(newEventData);
};