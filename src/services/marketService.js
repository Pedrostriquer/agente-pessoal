import { apiRequest } from './api';

export const getMarketList = async () => {
  // GET /market-list
  return apiRequest('/market-list', { method: 'GET' });
};

export const addMarketItem = async (itemName, quantity = 1) => {
  // POST /market-list (Rota raiz do grupo)
  return apiRequest('/market-list', {
    method: 'POST',
    body: JSON.stringify({ items: [{ itemName, quantity }] })
  });
};

export const removeMarketItem = async (itemId) => {
  // DELETE /market-list/:itemId
  return apiRequest(`/market-list/${itemId}`, { method: 'DELETE' });
};

export const updateMarketItem = async (itemId, newQuantity) => {
  // PUT /market-list/:itemId
  return apiRequest(`/market-list/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ new_quantity: newQuantity })
  });
};