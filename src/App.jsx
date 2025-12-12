import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// --- IMPORTAÇÃO DOS COMPONENTES ---
import StartingIA_V3 from './components/StartingIA_V3/StartingIA_V3';
import LoginPage from './components/LoginPage/LoginPage'; 
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import TasksPage from './components/TasksPage/TasksPage';
import FinancePage from './components/FinancePage/FinancePage';
import StudyPage from './components/StudyPage/StudyPage';
import SettingsPage from './components/SettingsPage/SettingsPage';
import GymPage from './components/GymPage/GymPage'; 
import EmailPage from './components/EmailPage/EmailPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage/PrivacyPolicyPage';
import TermsOfUsePage from './components/PrivacyPolicyPage/TermsOfUsePage';
import SiteHome from './site/SiteHome'; // <--- IMPORTAÇÃO AQUI

// Componente "Guardião" para rotas protegidas
const ProtectedRoutes = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isConfigured] = useState(true); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Verifica se já existe um token no localStorage ao carregar
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user_token')); 

  // Estado para dados do usuário (Recupera do localStorage se existir)
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('user_data');
    return savedUser ? JSON.parse(savedUser) : {
      userName: 'Visitante',
      agentName: 'MyAgent',
      agentAvatar: '🤖'
    };
  });

  const handleLogin = (data) => {
    localStorage.setItem('user_token', data.accessToken);
    if (data.user) {
      const newUserData = {
        userName: data.user.full_name || 'Usuário',
        agentName: 'Jarvis',
        agentAvatar: '🤖'
      };
      localStorage.setItem('user_data', JSON.stringify(newUserData));
      setUserData(newUserData);
    }
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setIsLoggedIn(false);
    setUserData({ userName: 'Visitante', agentName: 'MyAgent', agentAvatar: '🤖' });
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false); 
      else setIsSidebarOpen(true);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const layoutProps = {
    isSidebarOpen,
    isMobile,
    toggleSidebar
  };

  return (
    <Router>
      <div className="app-container">
        {!isConfigured ? (
          <StartingIA_V3 />
        ) : (
          <Routes>
            {/* ROTA PÚBLICA PARA CRIAÇÃO DO AGENTE */}
            <Route path="/start" element={<StartingIA_V3 />} />

            {/* ROTA DO SITE INSTITUCIONAL */}
            <Route path="/site" element={<SiteHome />} /> {/* <--- ROTA AQUI */}

            {/* ROTAS PÚBLICAS LEGAIS */}
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfUsePage />} />

            {/* ROTA DE LOGIN */}
            <Route 
              path="/login" 
              element={
                isLoggedIn 
                  ? <Navigate to="/" replace /> 
                  : <LoginPage onLoginSuccess={handleLogin} />
              }
            />

            {/* ROTAS PROTEGIDAS */}
            <Route 
              path="/*" 
              element={
                <ProtectedRoutes isLoggedIn={isLoggedIn}>
                  <div className="app-main">
                    <Sidebar 
                      isOpen={isSidebarOpen} 
                      toggleSidebar={toggleSidebar} 
                      isMobile={isMobile}
                      userData={userData}
                      onLogout={handleLogout}
                    />
                    
                    <Routes>
                      <Route path="/" element={<Dashboard {...layoutProps} />} />
                      <Route path="/tasks" element={<TasksPage {...layoutProps} />} />
                      <Route path="/finance" element={<FinancePage {...layoutProps} />} />
                      <Route path="/gym" element={<GymPage {...layoutProps} />} /> 
                      <Route path="/email" element={<EmailPage {...layoutProps} />} />
                      <Route path="/study" element={<StudyPage {...layoutProps} />} />
                      <Route path="/settings" element={<SettingsPage {...layoutProps} />} />
                      <Route path="/planner" element={<Navigate to="/tasks" replace />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </ProtectedRoutes>
              } 
            />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;