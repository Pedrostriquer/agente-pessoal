import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartingIA_V3.css';
import { createUserService } from '../../services/userService';
import { getGoogleAuthUrl } from '../../services/authService';
import { Play, Pause } from 'lucide-react';

// --- Áudios e Configurações Iniciais ---
import audioMarcio from '../../audios/Marcio.mp3';
import audioEduardo from '../../audios/ElevenLabs_2025-12-07T19_49_30_Eduardo Monteiro - Brazilian from the Northeast of Alagoas_pvc_sp100_s65_sb75_se19_b_m2.mp3';
import audioRocha from '../../audios/ElevenLabs_2025-12-07T19_50_43_Rocha - Podcast_pvc_sp109_s50_sb75_se0_b_m2.mp3';
import audioJenifer from '../../audios/Jenifer.mp3';
import audioThais from '../../audios/Thais.mp3';
import audioRaquel from '../../audios/Raquel.mp3';

const VOICES = {
  female: [
    { id: 'PZIBrGsMjLyYasEz50bI', name: 'Jenifer', src: audioJenifer },
    { id: '5EtawPduB139avoMLQgH', name: 'Thais N', src: audioThais },
    { id: 'GDzHdQOi6jjf8zaXhCYD', name: 'Raquel', src: audioRaquel },
  ],
  male: [
    { id: 'Zk0wRqIFBWGMu2lIk7hw', name: 'Marcio', src: audioMarcio },
    { id: '83Nae6GFQiNslSbuzmE7', name: 'Eduardo M.', src: audioEduardo },
    { id: 'PzTMbh7ilIswxFbjDqwL', name: 'Rocha', src: audioRocha },
  ]
};

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

// =============================================================================
// COMPONENTES DE CADA PASSO (SEPARAÇÃO DE RESPONSABILIDADES)
// =============================================================================

const StepVoice = ({ gender, setGender, selectedVoiceId, setSelectedVoiceId, playingVoiceId, handlePlayAudio }) => (
  <>
    <h1 className="v3-title">Escolha a voz.</h1>
    <div className="gender-toggle-container">
      <button className={`gender-tab ${gender === 'female' ? 'active' : ''}`} onClick={() => setGender('female')}>👩 Feminina</button>
      <button className={`gender-tab ${gender === 'male' ? 'active' : ''}`} onClick={() => setGender('male')}>👨 Masculina</button>
    </div>
    <div className="voice-list">
      {VOICES[gender].map((voice) => (
        <div key={voice.id} className={`voice-card ${selectedVoiceId === voice.id ? 'selected' : ''}`} onClick={() => setSelectedVoiceId(voice.id)}>
          <div className="voice-info">
            <div className="voice-icon-circle">{gender === 'female' ? '👩' : '👨'}</div>
            <span className="voice-name">{voice.name}</span>
          </div>
          <div className="voice-actions">
            <button className={`btn-audio-preview ${playingVoiceId === voice.id ? 'playing' : ''}`} onClick={(e) => handlePlayAudio(e, voice)}>
              {playingVoiceId === voice.id ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            </button>
            <div className="selection-radio">{selectedVoiceId === voice.id && <div className="radio-inner" />}</div>
          </div>
        </div>
      ))}
    </div>
  </>
);

const StepAIName = ({ aiName, setAiName }) => (
  <>
    <h1 className="v3-title">Qual será o nome?</h1>
    <input type="text" className="v3-input" placeholder="Ex: Jarvis..." value={aiName} onChange={(e) => setAiName(e.target.value)} />
  </>
);

const StepAIPersonality = ({ selectedTraits, toggleTrait }) => (
  <>
    <h1 className="v3-title">Personalidade.</h1>
    <p className="v3-desc">Escolha até 3 traços que definem seu assistente.</p>
    <div className="traits-wrap">
      {traitsList.map((trait, index) => (
        <button key={index} className={`trait-tag ${selectedTraits.includes(trait) ? 'active' : ''}`} onClick={() => toggleTrait(trait)}>
          {trait}
        </button>
      ))}
    </div>
  </>
);

const StepUserNickname = ({ userNickname, setUserNickname }) => (
  <>
    <h1 className="v3-title">Como te chamar?</h1>
    <input type="text" className="v3-input" placeholder="Seu nome..." value={userNickname} onChange={(e) => setUserNickname(e.target.value)} />
  </>
);

const StepWhatsApp = ({ ddi, setDdi, ddd, setDdd, phone, setPhone }) => (
  <>
    <h1 className="v3-title">Qual seu WhatsApp?</h1>
    <div className="phone-inputs-group">
      <div className="input-box small">
        <label>País</label>
        <select className="v3-input-select" value={ddi} onChange={(e) => setDdi(e.target.value)}>
          <option value="55">🇧🇷 55</option>
          <option value="1">🇺🇸 1</option>
        </select>
      </div>
      <div className="input-box small">
        <label>DDD</label>
        <input type="tel" maxLength="2" className="v3-input" placeholder="11" value={ddd} onChange={(e) => setDdd(e.target.value.replace(/\D/g, ''))} />
      </div>
      <div className="input-box large">
        <label>Número</label>
        <input type="tel" maxLength="9" className="v3-input" placeholder="91234-5678" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
      </div>
    </div>
  </>
);

const StepConsent = ({ isGoogleConnected, handleGoogleConnect }) => (
    <>
      <h1 className="v3-title">Conecte suas contas</h1>
      <p className="v3-desc">Para resumir reuniões e gerenciar sua agenda, precisamos de acesso ao seu Google Calendar.</p>
       <div className={`integration-card ${isGoogleConnected ? 'connected' : ''}`}>
        <div className="integration-icon google-icon"></div>
        <div className="integration-info">
          <h4>Google Calendar</h4>
          <p>{isGoogleConnected ? 'Conta conectada com sucesso!' : 'Acesso a eventos e calendário.'}</p>
        </div>
        <button className="btn-connect" onClick={handleGoogleConnect} disabled={isGoogleConnected}>
          {isGoogleConnected ? 'Conectado ✓' : 'Conectar'}
        </button>
      </div>
       {/* Adicione outras integrações aqui se necessário */}
    </>
);


// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const StartingIA_V3 = () => {
  const navigate = useNavigate();

  // --- Estados de Dados do Formulário ---
  const [gender, setGender] = useState('female');
  const [selectedVoiceId, setSelectedVoiceId] = useState('');
  const [aiName, setAiName] = useState('');
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [userNickname, setUserNickname] = useState('');
  const [ddi, setDdi] = useState('55');
  const [ddd, setDdd] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleRefreshToken, setGoogleRefreshToken] = useState(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('pro');
  const [extraModules, setExtraModules] = useState([]);

  // --- Estados de Controle da UI ---
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [audioObj, setAudioObj] = useState(null);

  // --- CONFIGURAÇÃO CENTRAL DOS PASSOS ---
  const steps = useMemo(() => [
    {
      id: 'voice',
      title: 'Escolha a voz',
      component: StepVoice,
      validate: () => selectedVoiceId !== '',
      errorMessage: "Por favor, selecione uma voz para continuar."
    },
    {
      id: 'aiName',
      title: 'Nome da IA',
      component: StepAIName,
      validate: () => aiName.trim() !== '',
      errorMessage: "O nome do seu assistente não pode ser vazio."
    },
    {
      id: 'aiPersonality',
      title: 'Personalidade',
      component: StepAIPersonality,
      validate: () => selectedTraits.length > 0,
      errorMessage: "Escolha pelo menos um traço de personalidade."
    },
    {
      id: 'userNickname',
      title: 'Seu Nome',
      component: StepUserNickname,
      validate: () => userNickname.trim() !== '',
      errorMessage: "Por favor, diga-nos como devemos te chamar."
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      component: StepWhatsApp,
      validate: () => ddd.length >= 2 && phone.length >= 8,
      errorMessage: "Por favor, insira um número de WhatsApp válido (DDD + Número)."
    },
    {
      id: 'consent',
      title: 'Consentimento',
      component: StepConsent,
      validate: () => true, // Opcional, pode validar se a conexão com o google foi feita.
      errorMessage: ""
    }
  ], [selectedVoiceId, aiName, selectedTraits, userNickname, ddd, phone]);
  
  const TOTAL_FORM_STEPS = steps.length;
  const [view, setView] = useState('form'); // 'form', 'plans', 'finalize'

  const CurrentStepComponent = steps[currentStepIndex].component;

  // --- Lógica de Efeitos e Handlers ---
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        setGoogleRefreshToken(event.data.refreshToken);
        console.log(event)
        console.log(event.data)
        console.log(event.data.refreshToken)
        setIsGoogleConnected(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  useEffect(() => {
    return () => {
      if (audioObj) audioObj.pause();
    };
  }, [audioObj]);


  const handleGoogleConnect = async () => {
    try {
      const data = await getGoogleAuthUrl();

      console.log(data)
      if (data.url) {
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open(data.url, 'GoogleAuth', `width=${width},height=${height},top=${top},left=${left}`);
      } else {
        alert("Erro: O servidor não retornou uma URL de autenticação.");
      }
    } catch (error) {
      console.error(error);
      alert("Falha ao iniciar a conexão com o Google.");
    }
  };
  
  const handlePlayAudio = (e, voice) => {
    e.stopPropagation();
    if (playingVoiceId === voice.id) {
      if (audioObj) {
        audioObj.pause();
        setPlayingVoiceId(null);
      }
      return;
    }
    if (audioObj) {
      audioObj.pause();
    }
    const newAudio = new Audio(voice.src);
    newAudio.play().catch(() => {});
    setAudioObj(newAudio);
    setPlayingVoiceId(voice.id);
    newAudio.onended = () => setPlayingVoiceId(null);
  };

  const toggleTrait = (trait) => {
    setSelectedTraits(prev => 
      prev.includes(trait) ? prev.filter(t => t !== trait) : (prev.length < 3 ? [...prev, trait] : prev)
    );
  };

  const toggleExtraModule = (moduleId) => {
    const currentPlan = plans.find(p => p.id === selectedPlanId);
    if (currentPlan.includedModules.includes(moduleId)) return;
    setExtraModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handlePlanChange = (planId) => {
    setSelectedPlanId(planId);
    setExtraModules([]);
  };

  const next = () => {
     setIsAnimating(true);
     setTimeout(() => {
        if (currentStepIndex < TOTAL_FORM_STEPS - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            setView('plans');
        }
        setIsAnimating(false);
     }, 400);
  }

  const prev = () => {
    if (view === 'form' && currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else if (view === 'plans') {
      setView('form');
    } else if (view === 'finalize') {
      setView('plans');
    }
  }

  const nextStep = () => {
    const currentStepConfig = steps[currentStepIndex];
    if (currentStepConfig.validate()) {
       next();
    } else {
      alert(currentStepConfig.errorMessage);
    }
  };
  
  const handleFinalSubmit = async () => {
    if (!email || !password) return alert("Preencha e-mail e senha para criar seu acesso.");
    setIsLoading(true);
    const payload = {
      full_name: userNickname,
      country_code: ddi,
      area_code: ddd,
      phone_number: phone,
      user_nickname: userNickname,
      agent_nickname: aiName,
      agent_gender: gender === 'female' ? 'Feminino' : 'Masculino',
      agent_voice_id: selectedVoiceId,
      agent_personality: selectedTraits,
      email: email,
      password: password,
      google_refresh_token: googleRefreshToken
    };

    try {
      await createUserService(payload);
      alert("Conta criada com sucesso!");
      navigate('/login');
    } catch (error) {
      console.error(error);
      const msg = error.message || "";
      if (msg.includes("already exists")) {
        alert("Um usuário com este e-mail já existe.");
        navigate('/login');
      } else {
        alert(`Ocorreu um erro ao criar seu agente: ${msg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    const plan = plans.find(p => p.id === selectedPlanId);
    const extrasTotal = allModules
      .filter(m => extraModules.includes(m.id))
      .reduce((acc, curr) => acc + curr.price, 0);
    return (plan.price + extrasTotal).toFixed(2).replace('.', ',');
  };
  
  const getAvatar = () => (gender === 'male' ? '👨‍💼' : '👩‍💼');
  const progressPercent = view === 'form' ? ((currentStepIndex + 1) / TOTAL_FORM_STEPS) * 100 : 100;
  
  return (
    <div className={`v3-container ${view !== 'form' ? 'mode-full' : ''}`}>
      <div className="top-progress-bar">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <div className="v3-left-panel">
        <div className="v3-header">
          {view === 'form' && <span className="step-indicator">Passo {currentStepIndex + 1} de {TOTAL_FORM_STEPS}</span>}
        </div>

        <div className={`form-content ${isAnimating ? 'fade-out' : 'fade-in'}`}>
          {view === 'form' && 
            <CurrentStepComponent 
              // Passa todos os estados e handlers necessários para o componente do passo atual
              gender={gender} setGender={setGender}
              selectedVoiceId={selectedVoiceId} setSelectedVoiceId={setSelectedVoiceId}
              playingVoiceId={playingVoiceId} handlePlayAudio={handlePlayAudio}
              aiName={aiName} setAiName={setAiName}
              selectedTraits={selectedTraits} toggleTrait={toggleTrait}
              userNickname={userNickname} setUserNickname={setUserNickname}
              ddi={ddi} setDdi={setDdi}
              ddd={ddd} setDdd={setDdd}
              phone={phone} setPhone={setPhone}
              isGoogleConnected={isGoogleConnected} handleGoogleConnect={handleGoogleConnect}
            />
          }
        </div>

        {view === 'form' && (
          <div className="v3-nav-buttons">
            {currentStepIndex > 0 && <button className="btn-back" onClick={prev}>Voltar</button>}
            <button className="btn-next" onClick={nextStep}>
              {currentStepIndex === TOTAL_FORM_STEPS - 1 ? 'Ver Planos' : 'Continuar'}
            </button>
          </div>
        )}
      </div>

      <div className="v3-right-panel">
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
                "Olá{userNickname ? `, ${userNickname}` : ''}! Estou pronto para começar."
              </div>
            </div>
          </div>
        </div>

        {view === 'plans' && (
          <div className="checkout-details fade-in-delayed">
            <h2 className="checkout-title">Escolha o plano ideal.</h2>
            <div className="plans-container">
              {plans.map((plan) => (
                <div key={plan.id} className={`plan-card ${selectedPlanId === plan.id ? 'active-plan' : ''}`} onClick={() => handlePlanChange(plan.id)}>
                  {plan.tag && <div className="plan-tag">{plan.tag}</div>}
                  <div className="plan-header">
                    <h3 className="plan-name">{plan.title}</h3>
                    <div className="plan-radio"></div>
                  </div>
                  <div className="plan-price">R$ {plan.price.toFixed(2).replace('.', ',')}<span>/mês</span></div>
                  <div className="plan-mini-features">
                    {plan.id === 'base' && <span>✅ Inclui Finanças</span>}
                    {plan.id === 'pro' && <span>✅ Tudo Incluso</span>}
                  </div>
                </div>
              ))}
            </div>
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
              <button className="btn-finish" onClick={() => setView('finalize')}>Ir para Ativação</button>
              <button className="btn-edit-agent" onClick={prev}>Voltar</button>
            </div>
          </div>
        )}

        {view === 'finalize' && (
          <div className="account-details fade-in-delayed">
            <div className="account-header">
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
               <button className="btn-edit-agent" onClick={prev}>Voltar aos Planos</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartingIA_V3;