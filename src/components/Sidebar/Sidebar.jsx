import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { 
  LayoutDashboard, CheckSquare, Wallet, 
  GraduationCap, Settings, LogOut, Sparkles,
  ChevronLeft, ChevronRight, Menu, X,
  Dumbbell, // <--- Ícone da Academia
  Mail    // <--- Ícone de E-mail
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, isMobile, userData, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Dados padrão
  const user = userData || {
    userName: 'Visitante',
    agentName: 'MyAgent',
    agentAvatar: '🤖'
  };

  // Mapeamento de rotas - ATUALIZADO
  const menuItems = [
    { id: 'dashboard', path: '/', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'email', path: '/email', label: 'E-mail', icon: Mail },      // NOVO ITEM
    { id: 'tasks', path: '/tasks', label: 'To-Do & Listas', icon: CheckSquare },
    { id: 'finance', path: '/finance', label: 'Financeiro', icon: Wallet },
    { id: 'gym', path: '/gym', label: 'Academia', icon: Dumbbell },    // NOVO ITEM
    { id: 'study', path: '/study', label: 'Estudo', icon: GraduationCap },
  ];

  const containerClass = isMobile 
    ? `sidebar-container mobile ${isOpen ? 'mobile-open' : 'mobile-closed'}`
    : `sidebar-container desktop ${isOpen ? 'expanded' : 'collapsed'}`;

  const showText = (isOpen && !isMobile) || isMobile;

  // Função para verificar se a rota está ativa
  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) toggleSidebar(); // Fecha o menu no mobile ao clicar
  };

  return (
    <>
      {/* Botão flutuante para abrir no mobile */}
      {isMobile && !isOpen && (
        <button className="mobile-menu-trigger" onClick={toggleSidebar}>
          <Menu size={24} strokeWidth={2} />
        </button>
      )}

      {/* Overlay escuro no mobile */}
      <div 
        className={`sidebar-overlay ${isOpen && isMobile ? 'visible' : ''}`} 
        onClick={toggleSidebar}
      />

      {/* Corpo da Sidebar */}
      <aside className={containerClass}>
        
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-box">
              <Sparkles size={24} color="#10b981" fill="#10b981" />
            </div>
            <span className={`logo-text ${!showText ? 'hide' : ''}`}>
              MyAgent<span className="dot">.</span>ai
            </span>
          </div>
          
          {isMobile && (
            <button className="mobile-close-btn" onClick={toggleSidebar}>
              <X size={24} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Menu de Navegação */}
        <nav className="sidebar-nav">
          <div className={`nav-group-label ${!showText ? 'center' : ''}`}>
            {!showText ? '•••' : 'MENU PRINCIPAL'}
          </div>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id}
                className={`nav-btn ${isActive(item.path) ? 'active' : ''} ${!showText ? 'icon-only' : ''}`}
                onClick={() => handleNavigation(item.path)}
                title={!showText ? item.label : ''} 
              >
                <Icon size={22} strokeWidth={2} />
                <span className={`nav-label-text ${!showText ? 'hide' : ''}`}>
                  {item.label}
                </span>
                {isActive(item.path) && showText && <div className="active-pill" />}
              </button>
            );
          })}

          <div className={`nav-group-label ${!showText ? 'center' : ''}`} style={{marginTop: 'auto'}}>
             {!showText ? '•••' : 'CONTA'}
          </div>
          
          {/* Botão de Configurações */}
          <button 
            className={`nav-btn ${isActive('/settings') ? 'active' : ''} ${!showText ? 'icon-only' : ''}`}
            onClick={() => handleNavigation('/settings')}
          >
            <Settings size={22} strokeWidth={2} />
            <span className={`nav-label-text ${!showText ? 'hide' : ''}`}>Configurações</span>
          </button>
        </nav>

        {/* Rodapé */}
        <div className="sidebar-footer">
          {/* Botão de Recolher (Desktop) */}
          {!isMobile && (
            <button className="collapse-toggle-btn" onClick={toggleSidebar}>
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          )}

          {/* Cartão de Usuário/Agente (Clicável) */}
          <div 
            className={`user-card ${!showText ? 'compact' : ''} ${isActive('/settings') ? 'active-card' : ''}`}
            onClick={() => handleNavigation('/settings')}
          >
            <div className="avatar-placeholder">{user.agentAvatar}</div>
            <div className={`user-meta ${!showText ? 'hide' : ''}`}>
              <span className="agent-name-display">{user.agentName}</span>
              <span className="user-name-label">
                <span className="dot-status"></span> {user.userName}
              </span>
            </div>
            
            {/* Botão de Logout */}
            {showText && (
              <button 
                className="logout-btn" 
                title="Sair"
                onClick={(e) => {
                  e.stopPropagation(); // Impede que o clique navegue para /settings
                  onLogout(); // Chama a função de logout do App.jsx
                }}
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;