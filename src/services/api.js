export const createUserService = async (userData) => {
  const API_URL = 'https://8db27ba1abe4.ngrok-free.app/users/create';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Verifica se a resposta não foi bem-sucedida (ex: 400, 409, 500)
    if (!response.ok) {
      // Tenta extrair o JSON de erro da resposta
      const errorData = await response.json().catch(() => ({}));
      
      // Pega a mensagem de erro (chaves 'error' ou 'message') ou usa uma genérica
      const errorMessage = errorData.error || errorData.message || 'Erro desconhecido ao criar usuário';
      
      // Lança o erro com a mensagem específica do backend
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error; // Repassa o erro para ser tratado no componente
  }
};