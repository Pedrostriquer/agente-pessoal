import { apiRequest } from './api';

export const getGymProfile = async () => {
  return apiRequest('/gym/profile', { method: 'GET' });
};

export const updateGymProfile = async (data) => {
  return apiRequest('/gym/profile', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const getWeeklyPlan = async () => {
  return apiRequest('/gym/plan', { method: 'GET' });
};

export const saveWorkoutDay = async (day, focus, exercises) => {
  // exercises agora será um array de objetos estruturados
  // Ex: [{ name: 'Supino', sets: '4', reps: '12', load: '20kg' }]
  return apiRequest('/gym/plan', {
    method: 'POST',
    body: JSON.stringify({ 
      day, 
      focus, 
      exercises 
    })
  });
};