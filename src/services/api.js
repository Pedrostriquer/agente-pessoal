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
      console.log(response)
  
      if (!response.ok) {
        throw new Error('Erro ao criar usuário');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      console.log(error)

      throw error;
    }
  };