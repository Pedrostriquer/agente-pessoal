import { apiRequest } from './api';

export const getCalendarEvents = async () => {
  return apiRequest('/calendar/list', { method: 'POST' });
};