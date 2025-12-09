import { API_BASE_URL, TEST_WA_ID, handleResponse } from './api';

// Header especial para pular o aviso do Ngrok
const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json"
};

export const getMarketList = async () => {
  // GET precisa do header agora também
  const response = await fetch(`${API_BASE_URL}/market-list?wa_id=${TEST_WA_ID}`, {
    method: 'GET',
    headers: {
      "ngrok-skip-browser-warning": "true" // Header obrigatório para GET no ngrok free
    }
  });
  return handleResponse(response);
};

export const addMarketItem = async (itemName, quantity = 1) => {
  const response = await fetch(`${API_BASE_URL}/market-list/add`, {
    method: 'POST',
    headers: NGROK_HEADERS, // Usa os headers com o bypass
    body: JSON.stringify({
      wa_id: TEST_WA_ID,
      items: [{ itemName, quantity }]
    })
  });
  return handleResponse(response);
};

export const removeMarketItem = async (itemId) => {
  const response = await fetch(`${API_BASE_URL}/market-list/${itemId}`, {
    method: 'DELETE',
    headers: NGROK_HEADERS,
    body: JSON.stringify({ wa_id: TEST_WA_ID })
  });
  return handleResponse(response);
};

export const updateMarketItem = async (itemId, newQuantity) => {
  const response = await fetch(`${API_BASE_URL}/market-list/${itemId}`, {
    method: 'PUT',
    headers: NGROK_HEADERS,
    body: JSON.stringify({
      wa_id: TEST_WA_ID,
      new_quantity: newQuantity
    })
  });
  return handleResponse(response);
};