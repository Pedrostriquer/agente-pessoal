import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css';

// --- IMPORTAÇÃO DOS COMPONENTES ---
import StartingIA_V3 from './components/StartingIA_V3/StartingIA_V3';
import LoginPage from './components/LoginPage/LoginPage'; // Importando Login
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import TasksPage from './components/TasksPage/TasksPage';
import FinancePage from './components/FinancePage/FinancePage';
import StudyPage from './components/StudyPage/StudyPage';
import SettingsPage from './components/SettingsPage/SettingsPage';

// Componente "Guardião" para rotas protegidas
const ProtectedRoutes = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    // Se não estiver logado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }
  // Se estiver logado, renderiza o conteúdo (layout principal)
  return children;
};


function App() {
  const [isConfigured] = useState(true); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Estado de Autenticação
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Começa deslogado

  // Mock do Usuário
  const userData = {
    userName: 'Carlos Eduardo',
    agentName: 'Jarvis',
    agentAvatar: '🤖'
  };

  // Funções de Login/Logout
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  // Detectar Mobile
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

  // Objeto com as props comuns para passar às páginas
  const layoutProps = {
    isSidebarOpen,
    isMobile,
    toggleSidebar
  };

  return (
    <Router>
      <div className="app-container">
        {!isConfigured ? (
          <StartingIA_V3 onFinish={() => setIsConfigured(true)} />
        ) : (
          <Routes>
            {/* ROTA DE LOGIN */}
            <Route 
              path="/login" 
              element={
                isLoggedIn 
                  ? <Navigate to="/" replace /> // Se já logado, vai pro dashboard
                  : <LoginPage onLoginSuccess={handleLogin} />
              }
            />

            {/* ROTAS PROTEGIDAS */}
            <Route 
              path="/*" // Qualquer outra rota
              element={
                <ProtectedRoutes isLoggedIn={isLoggedIn}>
                  <div className="app-main">
                    <Sidebar 
                      isOpen={isSidebarOpen} 
                      toggleSidebar={toggleSidebar} 
                      isMobile={isMobile}
                      userData={userData}
                      onLogout={handleLogout} // Passando a função de logout
                    />
                    
                    {/* Conteúdo das Páginas */}
                    <Routes>
                      <Route path="/" element={<Dashboard {...layoutProps} />} />
                      <Route path="/tasks" element={<TasksPage {...layoutProps} />} />
                      <Route path="/finance" element={<FinancePage {...layoutProps} />} />
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