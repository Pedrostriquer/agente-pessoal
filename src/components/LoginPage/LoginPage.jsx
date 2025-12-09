import React, { useState } from 'react';
import './LoginPage.css';
import { Mail, Lock, Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginService } from '../../services/authService';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados novos
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Por favor, preencha todos os campos.");

    setIsLoading(true);
    try {
      // Chamada real à API
      const data = await loginService(email, password);
      
      // Se tiver sucesso, você pode salvar o token se a API retornar
      if (data.token) {
        localStorage.setItem('user_token', data.token);
      }
      
      onLoginSuccess(data); // Passa os dados do usuário para o App
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Falha ao entrar: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      
      {/* PAINEL ESQUERDO: BRANDING */}
      <div className="login-branding-panel">
        <div className="brand-content">
          <div className="brand-logo">
            <Sparkles size={48} color="#fff" fill="#fff" />
          </div>
          <h1>Sua vida, organizada por IA.</h1>
          <p>Acesse seu painel e deixe seu agente inteligente cuidar do resto.</p>
        </div>
        <div className="brand-footer">
          <span>© MyAgent.ai 2025</span>
        </div>
      </div>

      {/* PAINEL DIREITO: FORMULÁRIO */}
      <div className="login-form-panel">
        <div className="login-form-container">
          <div className="form-header">
            <h2>Bem-vindo de volta!</h2>
            <p>Faça login para acessar seu dashboard.</p>
          </div>

          <form onSubmit={handleLogin}>
            
            {/* Campo de E-mail */}
            <div className="input-group">
              <Mail className="input-icon left" size={20} />
              <input 
                type="email" 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>

            {/* Campo de Senha com Toggle */}
            <div className="input-group">
              <Lock className="input-icon left" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field password"
              />
              <button 
                type="button"
                className="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="form-helpers">
              <label className="checkbox-label">
                <input type="checkbox" />
                Lembrar-me
              </label>
              <a href="#">Esqueceu a senha?</a>
            </div>

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? (
                <span className="flex-center"><Loader2 className="spin" size={20}/> Entrando...</span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <div className="form-footer">
            Não tem uma conta? <a href="/start">Cadastre-se</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;