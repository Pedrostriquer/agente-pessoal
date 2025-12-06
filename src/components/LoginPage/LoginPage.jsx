import React, { useState } from 'react';
import './LoginPage.css';
import { Mail, Lock, Sparkles } from 'lucide-react';

// Recebe a função onLoginSuccess para avisar o App.jsx que o login foi feito
const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    // Lógica de Validação (Simples)
    if (!email || !password) {
      alert("Por favor, preencha e-mail e senha.");
      return;
    }
    
    // --- Simulação de Login Bem-sucedido ---
    // Aqui você faria a chamada para sua API de autenticação.
    // Se a API retornar sucesso, você chama onLoginSuccess().
    console.log("Tentando login com:", { email, password });
    onLoginSuccess();
  };

  return (
    <div className="login-page-wrapper">
      
      {/* PAINEL ESQUERDO: BRANDING E VISUAL */}
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
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Campo de Senha */}
            <div className="input-group">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-helpers">
              <label className="checkbox-label">
                <input type="checkbox" />
                Lembrar-me
              </label>
              <a href="#">Esqueceu a senha?</a>
            </div>

            <button type="submit" className="btn-login">
              Entrar
            </button>
          </form>

          <div className="form-footer">
            Não tem uma conta? <a href="#">Cadastre-se</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;