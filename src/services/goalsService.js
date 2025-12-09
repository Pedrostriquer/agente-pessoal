import { API_BASE_URL, TEST_WA_ID, NGROK_HEADERS, handleResponse } from './api';

export const getGoalsList = async () => {
  const response = await fetch(`${API_BASE_URL}/goals/list`, {
    method: 'POST',
    headers: NGROK_HEADERS,
    body: JSON.stringify({ wa_id: TEST_WA_ID })
  });
  return handleResponse(response);
};

export const createGoal = async (goalName, targetAmount, unit = 'BRL') => {
  const response = await fetch(`${API_BASE_URL}/goals/create`, {
    method: 'POST',
    headers: NGROK_HEADERS,
    body: JSON.stringify({
      wa_id: TEST_WA_ID,
      goal_name: goalName,
      target_amount: Number(targetAmount),
      metric_unit: unit,
      category: 'Geral'
    })
  });
  return handleResponse(response);
};

export const updateGoalProgress = async (goalId, amount, description) => {
  const response = await fetch(`${API_BASE_URL}/goals/update-progress`, {
    method: 'POST',
    headers: NGROK_HEADERS,
    body: JSON.stringify({
      wa_id: TEST_WA_ID,
      goal_id: goalId,
      amount: Number(amount),
      description
    })
  });
  return handleResponse(response);
};

export const removeGoal = async (goalId) => {
  const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
    method: 'DELETE',
    headers: NGROK_HEADERS,
    body: JSON.stringify({ wa_id: TEST_WA_ID })
  });
  return handleResponse(response);
};