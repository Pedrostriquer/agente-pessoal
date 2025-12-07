import React, { useState } from 'react';
import './SettingsPage.css';
import { 
  User, Mail, Phone, CreditCard, Bot, 
  Mic, Sparkles, Shield, Edit3, Smartphone,
  Moon, Sun, Monitor 
} from 'lucide-react';

// Importa o contexto do tema
import { useTheme } from '../../context/ThemeContext';

const SettingsPage = ({ isSidebarOpen }) => {
  
  // Utiliza o hook para acessar o tema e a função de troca
  const { theme, toggleTheme } = useTheme();

  // --- MOCK DATA (Simulando o que veio do StartingIA) ---
  const [userData] = useState({
    nickname: 'Carlos Eduardo',
    email: 'carlos.edu@exemplo.com',
    phone: '(11) 91234-5678',
    plan: 'Pro Ultimate',
    price: '24,90',
    modules: ['Resumo de Reuniões', 'Gestão Financeira', 'Integração Alexa']
  });

  const [agentData] = useState({
    name: 'Jarvis',
    gender: 'male', // female, male, robot
    traits: ['Organizado', 'Sarcástico', 'Proativo'],
    voice: 'Masculina (Executivo)',
    status: 'Online'
  });

  // Helper para Avatar
  const getAvatar = (gender) => {
    if (gender === 'male') return '👨‍💼';
    if (gender === 'robot') return '🤖';
    return '👩‍💼';
  };

  return (
    <div className={`settings-wrapper fade-in ${isSidebarOpen ? 'open' : 'closed'}`}>
      
      <header className="page-header">
        <h1>Configurações da Conta</h1>
        <p>Gerencie seu perfil, seu agente e sua assinatura.</p>
      </header>

      <div className="settings-grid">
        
        {/* COLUNA ESQUERDA: APARÊNCIA, USUÁRIO E PLANO */}
        <div className="settings-col">
          
          {/* --- NOVO CARD: APARÊNCIA --- */}
          <div className="settings-card">
            <div className="card-header-simple">
              <h3><Monitor size={18}/> Aparência do App</h3>
            </div>
            
            <div 
              className="info-item" 
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {theme === 'light' ? <Sun size={20} color="#f59e0b"/> : <Moon size={20} color="#8b5cf6"/>}
                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                  Modo {theme === 'light' ? 'Claro' : 'Escuro'}
                </span>
              </div>
              
              <button 
                onClick={toggleTheme}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color, #cbd5e1)', /* Usa variável ou fallback */
                  background: 'transparent',
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: 'inherit',
                  transition: '0.2s'
                }}
              >
                Trocar
              </button>
            </div>
          </div>

          {/* 1. PERFIL DO USUÁRIO */}
          <div className="settings-card">
            <div className="card-header-simple">
              <h3><User size={18}/> Perfil do Usuário</h3>
              <button className="btn-edit-icon"><Edit3 size={16}/></button>
            </div>
            
            <div className="profile-info-list">
              <div className="info-item">
                <div className="label"><User size={14}/> Nome de Tratamento</div>
                <div className="value">{userData.nickname}</div>
              </div>
              <div className="info-item">
                <div className="label"><Mail size={14}/> E-mail de Acesso</div>
                <div className="value">{userData.email}</div>
              </div>
              <div className="info-item">
                <div className="label"><Smartphone size={14}/> WhatsApp Conectado</div>
                <div className="value phone-highlight">{userData.phone}</div>
              </div>
            </div>
          </div>

          {/* 2. PLANO E ASSINATURA */}
          <div className="settings-card plan-card-highlight">
            <div className="card-header-simple">
              <h3><CreditCard size={18}/> Assinatura Ativa</h3>
              <span className="status-badge">Ativo</span>
            </div>
            
            <div className="plan-summary">
              <div className="plan-name-row">
                <h2>{userData.plan}</h2>
                <span className="plan-price">R$ {userData.price}<small>/mês</small></span>
              </div>
              
              <div className="modules-list-display">
                <label>Módulos Instalados:</label>
                <div className="modules-tags">
                  {userData.modules.map((mod, idx) => (
                    <span key={idx} className="mod-tag"><Shield size={10}/> {mod}</span>
                  ))}
                </div>
              </div>

              <div className="plan-actions">
                <button className="btn-manage-plan">Gerenciar Cobrança</button>
              </div>
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA: IDENTIDADE DO AGENTE */}
        <div className="settings-col">
          
          {/* 3. CARD DO AGENTE (IDENTIDADE) */}
          <div className="settings-card agent-identity-card">
            <div className="agent-visual-header">
              <div className="agent-avatar-big">{getAvatar(agentData.gender)}</div>
              <div className="agent-status-pill">
                <span className="dot-online"></span> {agentData.status}
              </div>
            </div>

            <div className="agent-body-info">
              <div className="agent-name-row">
                <h2>{agentData.name}</h2>
                <button className="btn-edit-mini"><Edit3 size={14}/></button>
              </div>
              <p className="agent-role">Assistente Pessoal & Financeiro</p>

              <div className="agent-specs">
                <div className="spec-row">
                  <div className="spec-icon"><Mic size={16}/></div>
                  <div className="spec-data">
                    <label>Voz do Agente</label>
                    <span>{agentData.voice}</span>
                  </div>
                </div>
                <div className="spec-row">
                  <div className="spec-icon"><Bot size={16}/></div>
                  <div className="spec-data">
                    <label>Personalidade</label>
                    <div className="traits-display">
                      {agentData.traits.map(t => <span key={t}>#{t}</span>)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="agent-preview-msg">
                <Sparkles size={14} className="sparkle-icon"/>
                "Olá, {userData.nickname}! Estou pronto para ajudar com suas tarefas e finanças hoje."
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SettingsPage;