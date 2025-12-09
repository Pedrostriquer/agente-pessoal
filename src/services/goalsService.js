import { apiRequest } from './api';

export const getGoalsList = async () => {
  // GET /goals
  return apiRequest('/goals', { method: 'GET' });
};

export const createGoal = async (goalName, targetAmount, unit = 'BRL') => {
  // POST /goals
  return apiRequest('/goals', {
    method: 'POST',
    body: JSON.stringify({
      goal_name: goalName,
      target_amount: Number(targetAmount),
      metric_unit: unit,
      category: 'Geral'
    })
  });
};

export const updateGoalProgress = async (goalId, amount, description) => {
  // PATCH /goals/progress/:goalId
  return apiRequest(`/goals/progress/${goalId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      amount: Number(amount),
      description
    })
  });
};

export const removeGoal = async (goalId) => {
  // DELETE /goals/:goalId
  return apiRequest(`/goals/${goalId}`, { 
    method: 'DELETE' 
  });
};