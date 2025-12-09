export const API_BASE_URL = 'https://8db27ba1abe4.ngrok-free.app';
export const TEST_WA_ID = '5573999916668';

// Exportando os headers para usar em todos os serviços
export const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json"
};

export const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Erro na requisição');
  }
  return await response.json();
};