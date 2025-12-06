import React, { useState } from 'react';
import './StartingIA_V3.css';
import { createUserService } from '../../services/api'; // Importando o serviço

const StartingIA_V3 = () => {
  const [step, setStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento

  // Estados do Agente
  const [gender, setGender] = useState('female');
  const [aiName, setAiName] = useState('');
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [userNickname, setUserNickname] = useState('');
  
  // Estados do Telefone
  const [ddi, setDdi] = useState('55'); // Sem o + para facilitar o payload
  const [ddd, setDdd] = useState('');
  const [phone, setPhone] = useState('');

  // Estados da Conta
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados do Checkout
  const [selectedPlanId, setSelectedPlanId] = useState('pro');
  const [extraModules, setExtraModules] = useState([]);

  // Dados Estáticos
  const allModules = [
    { id: 1, name: 'Resumo de Reuniões', price: 14.90 },
    { id: 2, name: 'Gestão Financeira', price: 7.90 }, 
    { id: 3, name: 'Integração Alexa', price: 5.90 },
  ];

  const plans = [
    { id: 'base', title: 'Starter', price: 9.90, includedModules: [2], tag: '' },
    { id: 'pro', title: 'Pro Ultimate', price: 24.90, includedModules: [1, 2, 3], tag: 'Melhor Escolha 🔥' }
  ];

  const traitsList = ['Organizado', 'Criativo', 'Bem-humorado', 'Rigoroso', 'Empático', 'Sarcástico', 'Formal', 'Motivador'];
  const TOTAL_STEPS = 5; 

  // --- FUNÇÃO PARA MAPEAR GÊNERO PARA ID DE VOZ ---
  const getVoiceId = (gen) => {
    // IDs de exemplo da ElevenLabs
    if (gen === 'female') return 'EXAVOICE_FEMALE_ID'; 
    if (gen === 'male') return 'EXAVOICE_MALE_ID';
    return 'EXAVOICE_ROBOT_ID';
  };

  // --- NAVEGAÇÃO ---
  const nextStep = () => {
    // Validações
    if (step === 1 && !gender) return alert("Selecione um gênero.");
    if (step === 2 && !aiName) return alert("Digite um nome para a IA.");
    if (step === 3 && selectedTraits.length === 0) return alert("Selecione pelo menos uma personalidade.");
    if (step === 4 && !userNickname) return alert("Digite seu nome.");
    
    // VALIDAÇÃO DE TELEFONE (Passo 5)
    if (step === 5) {
      if (!ddd || ddd.length < 2) return alert("Digite um DDD válido.");
      if (!phone) return alert("Digite o número do telefone.");
      
      // Verifica se tem 9 dígitos
      if (phone.length !== 9) return alert("O número deve ter exatamente 9 dígitos.");
      
      // Verifica se começa com 9
      if (phone.charAt(0) !== '9') return alert("O número de celular deve começar com o dígito 9.");
    }

    setIsAnimating(true);
    setTimeout(() => {
      setStep(prev => prev + 1);
      setIsAnimating(false);
    }, 400);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  // --- HANDLERS ---
  const toggleTrait = (trait) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter(t => t !== trait));
    } else {
      if (selectedTraits.length < 3) setSelectedTraits([...selectedTraits, trait]);
    }
  };

  const toggleExtraModule = (moduleId) => {
    const currentPlan = plans.find(p => p.id === selectedPlanId);
    if (currentPlan.includedModules.includes(moduleId)) return; 
    if (extraModules.includes(moduleId)) {
      setExtraModules(extraModules.filter(id => id !== moduleId));
    } else {
      setExtraModules([...extraModules, moduleId]);
    }
  };

  const handlePlanChange = (planId) => {
    setSelectedPlanId(planId);
    setExtraModules([]); 
  };

  const calculateTotal = () => {
    const plan = plans.find(p => p.id === selectedPlanId);
    const extrasTotal = allModules
      .filter(m => extraModules.includes(m.id))
      .reduce((acc, curr) => acc + curr.price, 0);
    return (plan.price + extrasTotal).toFixed(2).replace('.', ',');
  };

  const getAvatar = () => {
    if (gender === 'male') return '👨‍💼';
    if (gender === 'robot') return '🤖';
    return '👩‍💼';
  };

  // --- FUNÇÃO FINAL: CRIAR USUÁRIO NA API ---
  const handleFinalSubmit = async () => {
    if (!email || !password) return alert("Preencha e-mail e senha.");

    setIsLoading(true);

    // Montando o Payload conforme solicitado
    const payload = {
      full_name: userNickname, // Usando o nickname como nome completo por enquanto
      country_code: ddi,
      area_code: ddd,
      phone_number: phone,
      user_nickname: userNickname,
      agent_nickname: aiName,
      agent_gender: gender === 'female' ? 'Feminino' : gender === 'male' ? 'Masculino' : 'Robótica',
      agent_voice_id: getVoiceId(gender),
      agent_personality: selectedTraits
    };

    try {
      console.log("Enviando Payload:", payload); // Para debug
      const result = await createUserService(payload);
      
      console.log("Sucesso:", result);
      alert("Agente criado com sucesso! Redirecionando para pagamento...");
      // Aqui você redirecionaria para o gateway de pagamento (Stripe/MercadoPago)
      
    } catch (error) {
      alert("Erro ao criar agente. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercent = Math.min((step / TOTAL_STEPS) * 100, 100);

  return (
    <div className={`v3-container ${step >= 6 ? 'mode-full' : ''}`}>
      
      <div className="top-progress-bar">
        <div className="progress-fill" style={{ width: `${step >= 6 ? 100 : progressPercent}%` }}></div>
      </div>

      {/* --- LADO ESQUERDO --- */}
      <div className="v3-left-panel">
        
        <div className="v3-header">
          {step <= TOTAL_STEPS && <span className="step-indicator">Passo {step} de {TOTAL_STEPS}</span>}
        </div>

        <div className={`form-content ${isAnimating ? 'fade-out' : 'fade-in'}`}>
          
          {step === 1 && (
            <div className="step-wrapper">
              <h1 className="v3-title">Escolha a voz do seu agente.</h1>
              <p className="v3-desc">Gênero e tom de voz para os áudios.</p>
              <div className="v3-grid-options">
                <button className={`option-card ${gender === 'female' ? 'active' : ''}`} onClick={() => setGender('female')}>
                  <span className="opt-icon">👩</span> Feminina
                </button>
                <button className={`option-card ${gender === 'male' ? 'active' : ''}`} onClick={() => setGender('male')}>
                  <span className="opt-icon">👨</span> Masculina
                </button>
                <button className={`option-card ${gender === 'robot' ? 'active' : ''}`} onClick={() => setGender('robot')}>
                  <span className="opt-icon">🤖</span> Robótica
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-wrapper">
              <h1 className="v3-title">Qual será o nome?</h1>
              <p className="v3-desc">Dê um nome único para sua IA.</p>
              <input type="text" className="v3-input" placeholder="Ex: Jarvis..." value={aiName} onChange={(e) => setAiName(e.target.value)} />
            </div>
          )}

          {step === 3 && (
            <div className="step-wrapper">
              <h1 className="v3-title">Personalidade.</h1>
              <p className="v3-desc">Escolha até 3 traços ({selectedTraits.length}/3).</p>
              <div className="traits-wrap">
                {traitsList.map((trait, index) => (
                  <button key={index} className={`trait-tag ${selectedTraits.includes(trait) ? 'active' : ''}`} onClick={() => toggleTrait(trait)}>{trait}</button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-wrapper">
              <h1 className="v3-title">Como te chamar?</h1>
              <p className="v3-desc">Seu nome ou apelido.</p>
              <input type="text" className="v3-input" placeholder="Seu nome..." value={userNickname} onChange={(e) => setUserNickname(e.target.value)} />
            </div>
          )}

          {/* PASSO 5: WHATSAPP COM VALIDAÇÃO */}
          {step === 5 && (
            <div className="step-wrapper">
              <h1 className="v3-title">Qual seu WhatsApp?</h1>
              <p className="v3-desc">Onde seu agente vai viver. Digite o número com 9 dígitos.</p>
              
              <div className="phone-inputs-group">
                <div className="input-box small">
                  <label>País</label>
                  <select className="v3-input-select" value={ddi} onChange={(e) => setDdi(e.target.value)}>
                    <option value="55">🇧🇷 55</option>
                    <option value="1">🇺🇸 1</option>
                    <option value="351">🇵🇹 351</option>
                  </select>
                </div>
                
                <div className="input-box small">
                  <label>DDD</label>
                  <input type="tel" maxLength="2" className="v3-input" placeholder="11" value={ddd} onChange={(e) => setDdd(e.target.value.replace(/\D/g, ''))} />
                </div>

                <div className="input-box large">
                  <label>Número (9 dígitos)</label>
                  <input 
                    type="tel" 
                    maxLength="9" 
                    className="v3-input" 
                    placeholder="91234-5678" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="v3-nav-buttons">
            {step > 1 && <button className="btn-back" onClick={prevStep}>Voltar</button>}
            
            <button className="btn-next" onClick={nextStep}>
              {step === 5 ? 'Ver Planos' : 'Continuar'}
            </button>
        </div>
      </div>

      {/* --- LADO DIREITO --- */}
      <div className="v3-right-panel">
        
        {/* PREVIEW CARD */}
        <div className="preview-card-wrapper">
          <div className="live-card">
            <div className="card-header">
              <div className="card-avatar">{getAvatar()}</div>
              <div className="card-status"><span className="status-dot"></span> Online</div>
            </div>
            <div className="card-body">
              <h2 className="card-name">{aiName || 'Nome da IA'}</h2>
              <p className="card-role">Assistente Pessoal</p>
              <div className="card-traits">
                {selectedTraits.length > 0 ? selectedTraits.map(t => <span key={t}>#{t}</span>) : <span className="placeholder-text">...</span>}
              </div>
              <div className="card-message">
                "Olá{userNickname ? `, ${userNickname}` : ''}! {step === 5 ? 'Vou mandar mensagem nesse número.' : 'Tudo pronto.'}"
              </div>
            </div>
          </div>
        </div>

        {/* PASSO 6: PLANOS */}
        {step === 6 && (
          <div className="checkout-details fade-in-delayed">
            <h2 className="checkout-title">Escolha o plano ideal.</h2>
            
            <div className="plans-container">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`plan-card ${selectedPlanId === plan.id ? 'active-plan' : ''}`}
                  onClick={() => handlePlanChange(plan.id)}
                >
                  {plan.tag && <div className="plan-tag">{plan.tag}</div>}
                  <div className="plan-header">
                    <h3 className="plan-name">{plan.title}</h3>
                    <div className="plan-radio"></div>
                  </div>
                  <div className="plan-price">R$ {plan.price.toFixed(2).replace('.', ',')}<span>/mês</span></div>
                  <div className="plan-mini-features">
                    {plan.id === 'base' && <span>✅ Inclui Finanças</span>}
                    {plan.id === 'pro' && <span>✅ Tudo Incluso (Sem limites)</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="divider-text">Personalize seu pacote</div>

            <div className="modules-list">
              {allModules.map((mod) => {
                const isIncluded = plans.find(p => p.id === selectedPlanId).includedModules.includes(mod.id);
                const isSelected = extraModules.includes(mod.id);
                return (
                  <div key={mod.id} className={`module-row ${isIncluded ? 'included' : ''} ${isSelected ? 'selected' : ''}`} onClick={() => toggleExtraModule(mod.id)}>
                    <div className="mod-info">
                      <span className="mod-name">{mod.name}</span>
                      {isIncluded ? <span className="mod-status">Incluso ✅</span> : <span className="mod-price">+ R$ {mod.price.toFixed(2).replace('.', ',')}</span>}
                    </div>
                    {!isIncluded && <div className="checkbox-circle"></div>}
                  </div>
                );
              })}
            </div>

            <div className="checkout-footer">
              <div className="final-total">
                <span>Total Mensal</span>
                <span className="price-big">R$ {calculateTotal()}</span>
              </div>
              <button className="btn-finish" onClick={() => setStep(7)}>Ir para Ativação</button>
              <button className="btn-edit-agent" onClick={() => setStep(5)}>Voltar</button>
            </div>
          </div>
        )}

        {/* PASSO 7: CONTA E ENVIO API */}
        {step === 7 && (
          <div className="account-details fade-in-delayed">
            <div className="account-header">
              <div className="icon-lock">🔒</div>
              <h2 className="checkout-title">Crie seu acesso.</h2>
              <p className="v3-desc text-center">Para acessar o painel web gratuito.</p>
            </div>

            <div className="account-form-group">
              <div className="input-block">
                <label>E-mail</label>
                <input type="email" className="v3-input" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="input-block">
                <label>Senha</label>
                <input type="password" className="v3-input" placeholder="******" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>

            <div className="checkout-footer">
               <div className="summary-mini">
                 <span>Plano: <strong>{plans.find(p => p.id === selectedPlanId).title}</strong></span>
                 <span>Total: <strong>R$ {calculateTotal()}</strong></span>
               </div>
               
               <button className="btn-finish" onClick={handleFinalSubmit} disabled={isLoading}>
                 {isLoading ? 'Criando Agente...' : 'Finalizar e Pagar'}
               </button>
               
               <button className="btn-edit-agent" onClick={() => setStep(6)}>Voltar aos Planos</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StartingIA_V3;