import { apiRequest } from './api';

export const getFinanceReport = async () => {
  return apiRequest('/finance/report', { method: 'GET' });
};

// --- NOVA FUNÇÃO DE BUSCA (PAGINADA) ---
export const searchTransactions = async (page = 1, limit = 20, category = '', description = '') => {
  const params = new URLSearchParams({
    page,
    limit,
    ...(category && { category }),
    ...(description && { description })
  });
  
  return apiRequest(`/finance/search?${params.toString()}`, { method: 'GET' });
};

// Mantive a função antiga caso use em outro lugar, mas o foco é a searchTransactions
export const getTransactionsList = async (limit = 20) => {
  return apiRequest(`/finance/transactions?limit=${limit}`, { method: 'GET' });
};

export const addTransaction = async (amount, type, description, category = 'Geral') => {
  return apiRequest('/finance/transaction', {
    method: 'POST',
    body: JSON.stringify({ 
      amount: Number(amount), 
      type, 
      description, 
      category,
      date: new Date().toISOString()
    })
  });
};