import React, { useState } from 'react';
import './StartingIA.css';

const StartingIA = () => {
  const [step, setStep] = useState(1);
  const [selectedIntegrations, setSelectedIntegrations] = useState([]);
  
  const [agentName, setAgentName] = useState('');
  const [agentGender, setAgentGender] = useState('female');
  const [agentPersonality, setAgentPersonality] = useState('pro');

  const BASE_PRICE = 9.90;

  const integrations = [
    { id: 1, name: 'Resumo de Reuniões', desc: 'Meet e Zoom', price: 14.90, icon: '📹' },
    { id: 2, name: 'Comandos de Voz', desc: 'Alexa Integrada', price: 5.90, icon: '🗣️' },
    { id: 3, name: 'Automação de E-mails', desc: 'Gmail/Outlook', price: 9.90, icon: '📧' },
    { id: 4, name: 'Gestão Financeira Pro', desc: 'Dashboard e Metas', price: 7.90, icon: '📊' },
  ];

  const personalities = [
    { id: 'pro', name: 'Executivo', icon: '👔', desc: 'Formal, direto e eficiente.' },
    { id: 'friendly', name: 'Amigável', icon: '😊', desc: 'Empático, casual e leve.' },
    { id: 'coach', name: 'Treinador', icon: '🔥', desc: 'Motivador e exigente.' },
    { id: 'witty', name: 'Sarcástico', icon: '😜', desc: 'Engraçado e cheio de personalidade.' },
  ];

  // Lógica da mensagem de boas-vindas baseada na personalidade
  const getWelcomeMessage = () => {
    const name = agentName || 'Chefe';
    switch (agentPersonality) {
      case 'pro': return `Sistemas operacionais. Sou ${agentName || 'seu Assistente'}. Aguardando ordens para otimizar sua rotina.`;
      case 'friendly': return `Oii, ${name}! Tudo pronto! Mal posso esperar para a gente organizar sua vida juntos! ✨`;
      case 'coach': return `Tudo configurado, ${name}. A moleza acabou. Vamos focar e bater essas metas agora! 🚀`;
      case 'witty': return `Finalmente! Achei que você nunca ia terminar essa configuração. Vamos trabalhar ou vai ficar aí olhando? 💅`;
      default: return 'Olá! Estou pronto para ajudar.';
    }
  };

  const getPersonalityIcon = () => {
    return personalities.find(p => p.id === agentPersonality)?.icon || '🤖';
  };

  const toggleIntegration = (id) => {
    if (selectedIntegrations.includes(id)) {
      setSelectedIntegrations(selectedIntegrations.filter(item => item !== id));
    } else {
      setSelectedIntegrations([...selectedIntegrations, id]);
    }
  };

  const calculateTotal = () => {
    const addonsTotal = integrations
      .filter(item => selectedIntegrations.includes(item.id))
      .reduce((sum, item) => sum + item.price, 0);
    return (BASE_PRICE + addonsTotal).toFixed(2).replace('.', ',');
  };

  return (
    <div className="ia-container">
      
      {/* --- BACKGROUND STORYTELLING (Mantido) --- */}
      <div className="background-decor">
        <div className="float-item float-chat-sim">
          <div className="msg-bubble user-msg anim-msg-1">
            <p>Lembra de enviar atividade de física e cria um resumo.</p>
            <span className="time">10:42</span>
          </div>
          <div className="typing-indicator anim-type-1"><span>•</span><span>•</span><span>•</span></div>
          <div className="msg-bubble ai-msg anim-msg-2">
            <p>Agendado para 14h! 📅 O resumo 'Física_Mecânica.pdf' já está na pasta.</p>
            <span className="time">10:42</span>
          </div>
          <div className="msg-bubble user-msg anim-msg-3">
            <p>Comprei um lanche no BK. R$ 28,90.</p>
            <span className="time">12:15</span>
          </div>
          <div className="typing-indicator anim-type-2"><span>•</span><span>•</span><span>•</span></div>
          <div className="msg-bubble ai-msg anim-msg-4">
            <p>Anotado! 🍔 Categoria: Alimentação. Você gastou 40% do budget diário.</p>
            <span className="time">12:15</span>
          </div>
        </div>
        <div className="right-widgets-group">
            <div className="float-widget widget-calendar anim-widget-1">
                <div className="cal-header">AGOSTO</div>
                <div className="cal-content">
                    <div className="cal-date-big">15</div>
                    <div className="cal-event-row"><div className="cal-dot red"></div><div className="cal-text"><span className="evt-time">14:00</span><span className="evt-name">Entrega Física</span></div></div>
                </div>
            </div>
            <div className="float-widget widget-drive anim-widget-2">
                <div className="drive-icon">📁</div>
                <div className="drive-info"><span className="drive-file">Física_Mecânica.pdf</span><span className="drive-status">Sincronizado agora</span></div><div className="drive-check">✓</div>
            </div>
        </div>
        <div className="float-widget widget-finance anim-widget-3">
            <div className="fin-header"><span>💸 Novo Gasto</span><span className="fin-badge">Alimentação</span></div>
            <div className="fin-amount">- R$ 28,90</div>
            <div className="fin-merchant">Burger King</div>
            <div className="fin-graph"><div className="graph-line"></div></div>
        </div>
      </div>

      {/* --- CARD PRINCIPAL --- */}
      <div className="card-wrapper">
        <div className="ia-card">
          
          {/* Barra de Progresso (4 Passos) */}
          <div className="progress-bar">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`line ${step >= 2 ? 'active-line' : ''}`}></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className={`line ${step >= 3 ? 'active-line' : ''}`}></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
            <div className={`line ${step >= 4 ? 'active-line' : ''}`}></div>
            <div className={`step ${step >= 4 ? 'active' : ''}`}>4</div>
          </div>

          {/* PASSO 1: PRODUTO BASE */}
          {step === 1 && (
            <div className="step-content fade-in-up">
              <div className="header-section">
                <span className="badge">IA Pessoal v2.0</span>
                <h1 className="title">Seu Segundo Cérebro.</h1>
                <p className="subtitle">Organize estudos, finanças e agenda pelo WhatsApp.</p>
              </div>
              <div className="features-grid">
                <div className="feature-box"><span className="f-icon">📅</span><span>Agenda</span></div>
                <div className="feature-box"><span className="f-icon">💰</span><span>Finanças</span></div>
                <div className="feature-box"><span className="f-icon">📂</span><span>Drive</span></div>
                <div className="feature-box"><span className="f-icon">✅</span><span>Tasks</span></div>
              </div>
              <div className="pricing-section">
                <div className="price-display"><span className="currency">R$</span><span className="value">9,90</span><span className="period">/mês</span></div>
              </div>
              <button className="btn-primary glow-button" onClick={() => setStep(2)}>Criar meu Agente</button>
            </div>
          )}

          {/* PASSO 2: INTEGRAÇÕES */}
          {step === 2 && (
            <div className="step-content fade-in-up">
              <div className="header-section">
                <h2 className="title-sm">Turbinar Inteligência</h2>
                <p className="subtitle-sm">Adicione módulos extras.</p>
              </div>
              <div className="integrations-list">
                {integrations.map((item) => (
                  <div key={item.id} className={`integration-item ${selectedIntegrations.includes(item.id) ? 'selected' : ''}`} onClick={() => toggleIntegration(item.id)}>
                    <div className="int-left">
                      <span className="int-icon">{item.icon}</span>
                      <div className="int-texts"><span className="int-name">{item.name}</span><span className="int-desc">{item.desc}</span></div>
                    </div>
                    <div className="int-right">
                      <div className="int-price">+ {item.price.toFixed(2).replace('.', ',')}</div>
                      <div className="checkbox-custom"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="footer-action">
                <div className="total-row"><span>Mensalidade</span><span className="total-value">R$ {calculateTotal()}</span></div>
                <div className="button-group">
                  <button className="btn-text" onClick={() => setStep(1)}>Voltar</button>
                  <button className="btn-primary" onClick={() => setStep(3)}>Continuar</button>
                </div>
              </div>
            </div>
          )}

          {/* PASSO 3: IDENTIDADE */}
          {step === 3 && (
            <div className="step-content fade-in-up">
              <div className="header-section">
                <h2 className="title-sm">Identidade da IA</h2>
                <p className="subtitle-sm">Personalize o comportamento.</p>
              </div>
              <div className="input-group">
                <label>Nome do Agente</label>
                <input type="text" placeholder="Ex: Jarvis..." value={agentName} onChange={(e) => setAgentName(e.target.value)} className="custom-input" />
              </div>
              <div className="input-group">
                <label>Voz / Gênero</label>
                <div className="gender-selector">
                  <div className={`gender-option ${agentGender === 'male' ? 'active' : ''}`} onClick={() => setAgentGender('male')}>👨 Masc</div>
                  <div className={`gender-option ${agentGender === 'female' ? 'active' : ''}`} onClick={() => setAgentGender('female')}>👩 Fem</div>
                  <div className={`gender-option ${agentGender === 'neutral' ? 'active' : ''}`} onClick={() => setAgentGender('neutral')}>🤖 Neutro</div>
                </div>
              </div>
              <div className="input-group">
                <label>Personalidade</label>
                <div className="personality-grid">
                  {personalities.map((p) => (
                    <div key={p.id} className={`pers-card ${agentPersonality === p.id ? 'active' : ''}`} onClick={() => setAgentPersonality(p.id)}>
                      <span className="pers-icon">{p.icon}</span><span className="pers-name">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="footer-action">
                <div className="button-group">
                  <button className="btn-text" onClick={() => setStep(2)}>Voltar</button>
                  <button className="btn-primary" onClick={() => setStep(4)}>Gerar Agente</button>
                </div>
              </div>
            </div>
          )}

          {/* PASSO 4: RESUMO E CHECKOUT (NOVO) */}
          {step === 4 && (
            <div className="step-content fade-in-up">
              
              <div className="header-section">
                <span className="badge">Configuração Concluída</span>
                <h2 className="title-sm" style={{marginTop: '10px'}}>Pronto para Ativar?</h2>
              </div>

              {/* Preview do Agente "Vivo" */}
              <div className="agent-preview-card">
                <div className="agent-avatar-circle">
                  {getPersonalityIcon()}
                </div>
                <div className="agent-msg-box">
                  <div className="agent-header">
                    <span className="agent-name-display">{agentName || 'Seu Agente'}</span>
                    <span className="agent-status">Online agora</span>
                  </div>
                  <p className="agent-text-display">"{getWelcomeMessage()}"</p>
                </div>
              </div>

              {/* Recibo / Resumo */}
              <div className="receipt-container">
                <div className="receipt-title">Resumo do Plano</div>
                
                <div className="receipt-item">
                  <span>Plano Agente Base</span>
                  <span>R$ 9,90</span>
                </div>

                {integrations.filter(i => selectedIntegrations.includes(i.id)).map(item => (
                   <div className="receipt-item sub-item" key={item.id}>
                     <span>+ {item.name}</span>
                     <span>R$ {item.price.toFixed(2).replace('.', ',')}</span>
                   </div>
                ))}
                
                <div className="receipt-divider"></div>
                
                <div className="receipt-total">
                  <span>Total Mensal</span>
                  <span className="total-highlight">R$ {calculateTotal()}</span>
                </div>
              </div>

              <div className="footer-action">
                 <button className="btn-primary glow-button" onClick={() => alert('Redirecionando para pagamento...')}>
                    Pagar e Ativar no WhatsApp
                 </button>
                 <button className="btn-text" style={{width: '100%', marginTop: '10px'}} onClick={() => setStep(3)}>
                    Editar Personalização
                 </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default StartingIA;