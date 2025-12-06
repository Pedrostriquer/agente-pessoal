import React, { useState } from 'react';
import './StartingIA_V2.css';

const StartingIA_V2 = () => {
  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);

  // Estados do Agente
  const [gender, setGender] = useState('');
  const [aiName, setAiName] = useState('');
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [userNickname, setUserNickname] = useState('');
  const [selectedModules, setSelectedModules] = useState([]);

  // Constantes
  const BASE_PRICE = 9.90;

  const traitsList = [
    'Organizado', 'Criativo', 'Bem-humorado', 'Rigoroso', 
    'Empático', 'Sarcástico', 'Formal', 'Motivador', 
    'Analítico', 'Zen', 'Direto', 'Geek'
  ];

  const modulesList = [
    { id: 1, name: 'Resumo de Reuniões', desc: 'Gravação e transcrição de calls.', price: 14.90 },
    { id: 2, name: 'Controle Financeiro', desc: 'Gráficos e gestão de gastos.', price: 7.90 },
    { id: 3, name: 'Integração Alexa', desc: 'Comandos de voz em casa.', price: 5.90 },
    { id: 4, name: 'Automação de E-mails', desc: 'Responde e organiza inbox.', price: 9.90 },
  ];

  // Navegação com atraso para animação
  const nextStep = () => {
    if (step === 1 && !gender) return alert("Selecione uma opção!");
    if (step === 2 && !aiName) return alert("Dê um nome ao seu agente!");
    if (step === 3 && selectedTraits.length === 0) return alert("Escolha pelo menos uma característica!");
    if (step === 4 && !userNickname) return alert("Como devo te chamar?");

    setAnimating(true);
    setTimeout(() => {
      setStep(step + 1);
      setAnimating(false);
    }, 400); // Tempo da animação de saída
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const toggleTrait = (trait) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter(t => t !== trait));
    } else {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };

  const toggleModule = (id) => {
    if (selectedModules.includes(id)) {
      setSelectedModules(selectedModules.filter(m => m !== id));
    } else {
      setSelectedModules([...selectedModules, id]);
    }
  };

  const calculateTotal = () => {
    const extras = modulesList
      .filter(m => selectedModules.includes(m.id))
      .reduce((acc, curr) => acc + curr.price, 0);
    return (BASE_PRICE + extras).toFixed(2).replace('.', ',');
  };

  return (
    <div className="v2-container">
      
      {/* Barra de Progresso Superior Minimalista */}
      <div className="v2-progress-bar">
        <div className="v2-progress-fill" style={{ width: `${(step / 6) * 100}%` }}></div>
      </div>

      <div className={`v2-content-wrapper ${animating ? 'slide-out' : 'slide-in'}`}>
        
        {/* PASSO 1: GÊNERO/VOZ */}
        {step === 1 && (
          <div className="step-box">
            <h1 className="v2-title">Primeiro, escolha a voz do seu agente.</h1>
            <p className="v2-subtitle">Isso define como ele vai soar nos áudios do WhatsApp.</p>
            
            <div className="gender-grid">
              <div className={`gender-card ${gender === 'female' ? 'selected' : ''}`} onClick={() => setGender('female')}>
                <span className="g-icon">👩</span>
                <span className="g-label">Feminina</span>
              </div>
              <div className={`gender-card ${gender === 'male' ? 'selected' : ''}`} onClick={() => setGender('male')}>
                <span className="g-icon">👨</span>
                <span className="g-label">Masculina</span>
              </div>
              <div className={`gender-card ${gender === 'robot' ? 'selected' : ''}`} onClick={() => setGender('robot')}>
                <span className="g-icon">🤖</span>
                <span className="g-label">Robótica</span>
              </div>
            </div>
          </div>
        )}

        {/* PASSO 2: NOME */}
        {step === 2 && (
          <div className="step-box">
            <h1 className="v2-title">Como você quer chamar sua IA?</h1>
            <p className="v2-subtitle">Dê um nome único para ela.</p>
            
            <input 
              type="text" 
              className="v2-input-big" 
              placeholder="Ex: Jarvis, Sexta-feira..." 
              value={aiName}
              onChange={(e) => setAiName(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {/* PASSO 3: TRAÇOS DE PERSONALIDADE (ESTILO SPOTIFY) */}
        {step === 3 && (
          <div className="step-box">
            <h1 className="v2-title">Personalidade</h1>
            <p className="v2-subtitle">Selecione 3 ou mais características que você gosta.</p>
            
            <div className="traits-cloud">
              {traitsList.map((trait, index) => (
                <div 
                  key={index}
                  className={`trait-pill ${selectedTraits.includes(trait) ? 'active' : ''}`}
                  onClick={() => toggleTrait(trait)}
                >
                  {trait}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PASSO 4: TRATAMENTO */}
        {step === 4 && (
          <div className="step-box">
            <h1 className="v2-title">E como devo chamar você?</h1>
            <p className="v2-subtitle">Pode ser seu nome, apelido ou um título.</p>
            
            <input 
              type="text" 
              className="v2-input-big" 
              placeholder="Ex: Chefe, Pedro, Mestre..." 
              value={userNickname}
              onChange={(e) => setUserNickname(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {/* PASSO 5: O RESUMO DA IA (CARD GERADO) */}
        {step === 5 && (
          <div className="step-box">
            <h1 className="v2-title">Sua IA foi gerada!</h1>
            <p className="v2-subtitle">Veja como ficou o perfil do seu assistente.</p>
            
            <div className="ai-profile-card">
              <div className="ai-avatar-large">
                {gender === 'female' ? '👩' : gender === 'male' ? '👨' : '🤖'}
              </div>
              <h2 className="ai-name-display">{aiName}</h2>
              <div className="ai-tags">
                {selectedTraits.slice(0, 3).map(t => <span key={t}>#{t}</span>)}
              </div>
              <div className="ai-message-bubble">
                "Olá, {userNickname}! Estou configurado e pronto para organizar sua vida. Vamos começar?"
              </div>
            </div>
          </div>
        )}

        {/* PASSO 6: CHECKOUT E MÓDULOS */}
        {step === 6 && (
          <div className="step-box checkout-mode">
            <h1 className="v2-title text-left">Finalizar Configuração</h1>
            <p className="v2-subtitle text-left">Adicione poderes extras ao {aiName}.</p>

            <div className="modules-list">
              {modulesList.map((mod) => (
                <div 
                  key={mod.id} 
                  className={`module-row ${selectedModules.includes(mod.id) ? 'checked' : ''}`}
                  onClick={() => toggleModule(mod.id)}
                >
                  <div className="mod-info">
                    <span className="mod-name">{mod.name}</span>
                    <span className="mod-desc">{mod.desc}</span>
                  </div>
                  <div className="mod-action">
                    <span className="mod-price">+ R$ {mod.price.toFixed(2).replace('.', ',')}</span>
                    <div className="v2-checkbox"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="v2-checkout-footer">
              <div className="price-breakdown">
                <span>Plano Base</span>
                <span>R$ 9,90</span>
              </div>
              <div className="price-total">
                <span>Total Mensal</span>
                <span className="big-price">R$ {calculateTotal()}</span>
              </div>
              <button className="v2-btn-pay" onClick={() => alert("Pagamento Processado!")}>
                Pagar e Ativar no WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navegação Inferior Fixa */}
      <div className="v2-bottom-nav">
        {step > 1 && (
          <button className="v2-btn-back" onClick={prevStep}>Voltar</button>
        )}
        {step < 6 && (
          <button className="v2-btn-next" onClick={nextStep}>
            {step === 5 ? 'Ver Planos' : 'Continuar'}
          </button>
        )}
      </div>
    </div>
  );
};

export default StartingIA_V2;