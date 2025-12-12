import React, { useState, useRef } from 'react';
import './LoginPage.css';
import { Mail, Lock, Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { loginService, loginWithGoogleService } from '../../services/authService';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Seu Client ID
  const GOOGLE_CLIENT_ID = "249946168812-mn5kigsrb2qf1epps45g9osv3ks843t7.apps.googleusercontent.com";

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Preencha todos os campos.");
    setIsLoading(true);
    try {
      const data = await loginService(email, password);
      if (data.accessToken) {
        onLoginSuccess(data);
      }
    } catch (error) {
      alert("Falha ao entrar: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      setIsGoogleLoading(false);
      return alert("Não foi possível obter o token de credencial do Google.");
    }

    try {
      const data = await loginWithGoogleService(idToken);
      if (data.accessToken) {
        onLoginSuccess(data);
      }
    } catch (error) {
      alert("Falha no login com Google: " + error.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    setIsGoogleLoading(false);
    alert("Ocorreu um erro durante a autenticação com o Google. Tente novamente.");
  };

  const GoogleIcon = () => (
    <svg className="google-icon" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56,12.25 C22.56,11.45 22.49,10.68 22.36,9.92 L12,9.92 L12,14.03 L18.17,14.03 C17.91,15.54 17.07,16.85 15.75,17.72 L15.75,20.59 L19.66,20.59 C21.57,18.84 22.56,15.84 22.56,12.25 Z"></path>
      <path fill="#34A853" d="M12,23 C15.24,23 17.95,21.89 19.66,20.59 L15.75,17.72 C14.65,18.44 13.45,18.86 12,18.86 C9.4,18.86 7.2,17.18 6.34,14.88 L2.29,14.88 L2.29,17.84 C4.02,20.93 7.7,23 12,23 Z"></path>
      <path fill="#FBBC05" d="M6.34,14.88 C6.1,14.18 5.96,13.45 5.96,12.7 C5.96,11.95 6.1,11.22 6.34,10.52 L6.34,7.56 L2.29,7.56 C1.48,9.15 1,10.85 1,12.7 C1,14.55 1.48,16.25 2.29,17.84 L6.34,14.88 Z"></path>
      <path fill="#EA4335" d="M12,5.14 C13.6,5.14 14.97,5.68 15.96,6.62 L19.74,2.84 C17.95,1.18 15.24,0 12,0 C7.7,0 4.02,2.07 2.29,5.16 L6.34,7.56 C7.2,5.26 9.4,3.58 12,3.58 L12,5.14 Z"></path>
    </svg>
  );

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="login-page-wrapper">
        <div className="login-branding-panel">
          <div className="brand-content">
            <div className="brand-logo"><Sparkles size={48} color="#fff" fill="#fff" /></div>
            <h1>Sua vida, organizada por IA.</h1>
            <p>Acesse seu painel e deixe seu agente inteligente cuidar do resto.</p>
          </div>
          <div className="brand-footer"><span>© MyAgent.ai 2025</span></div>
        </div>

        <div className="login-form-panel">
          <div className="login-form-container">
            <div className="form-header">
              <h2>Bem-vindo!</h2>
              <p>Faça login para continuar.</p>
            </div>

            <form onSubmit={handleStandardLogin}>
              <div className="input-group">
                <Mail className="input-icon left" size={20} />
                <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" />
              </div>
              <div className="input-group">
                <Lock className="input-icon left" size={20} />
                <input type={showPassword ? "text" : "password"} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field password" />
                <button type="button" className="btn-toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button type="submit" className="btn-login" disabled={isLoading || isGoogleLoading}>
                {isLoading ? <span className="flex-center"><Loader2 className="spin" size={20} /> Entrando...</span> : "Entrar"}
              </button>
            </form>

            <div className="divider">OU</div>

            <div style={{ display: 'none' }}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                useOneTap={false}
                shape="rectangular"
                theme="outline"
                size="large"
              />
            </div>

            <button
              onClick={() => {
                setIsGoogleLoading(true);
                const googleButton = document.querySelector('div[role="button"][aria-labelledby="button-label"]');
                if (googleButton) {
                  googleButton.click();
                } else {
                  handleGoogleLoginError();
                }
              }}
              className="btn-google"
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <span className="flex-center"><Loader2 className="spin" size={20} /> Verificando...</span>
              ) : (
                <>
                  <GoogleIcon />
                  Entrar com Google
                </>
              )}
            </button>

            <div className="form-footer">
              <p style={{ marginBottom: '15px' }}>
                Não tem conta? <a href="/start">Cadastre-se</a>
              </p>

              {/* --- LINK PARA TERMOS E PRIVACIDADE --- */}
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                fontSize: '12px',
                borderTop: '1px solid #f1f5f9',
                paddingTop: '15px'
              }}>
                <a href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '500' }}>Privacidade</a>
                <a href="/terms" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '500' }}>Termos de Uso</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;