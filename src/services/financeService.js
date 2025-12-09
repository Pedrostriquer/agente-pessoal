import { API_BASE_URL, TEST_WA_ID, NGROK_HEADERS, handleResponse } from './api';

export const getFinanceReport = async () => {
  const response = await fetch(`${API_BASE_URL}/finance/report`, {
    method: 'POST',
    headers: NGROK_HEADERS, // Inclui o bypass do Ngrok
    body: JSON.stringify({ wa_id: TEST_WA_ID })
  });
  return handleResponse(response);
};

export const addTransaction = async (amount, type, description, category = 'Geral') => {
  const response = await fetch(`${API_BASE_URL}/finance/add`, {
    method: 'POST',
    headers: NGROK_HEADERS, // Inclui o bypass do Ngrok
    body: JSON.stringify({
      wa_id: TEST_WA_ID,
      amount: Number(amount),
      type: type, // 'expense' ou 'income'
      description,
      category
    })
  });
  return handleResponse(response);
};