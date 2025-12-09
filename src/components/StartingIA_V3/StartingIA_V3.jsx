import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartingIA_V3.css';
import { createUserService } from '../../services/userService';
import { Play, Pause, Check } from 'lucide-react';

// --- IMPORTS DOS ÁUDIOS ---
// Certifique-se que os arquivos estão na pasta src/audios/
import audioMarcio from '../../audios/Marcio.mp3';
import audioEduardo from '../../audios/ElevenLabs_2025-12-07T19_49_30_Eduardo Monteiro - Brazilian from the Northeast of Alagoas_pvc_sp100_s65_sb75_se19_b_m2.mp3';
import audioRocha from '../../audios/ElevenLabs_2025-12-07T19_50_43_Rocha - Podcast_pvc_sp109_s50_sb75_se0_b_m2.mp3';
import audioJenifer from '../../audios/Jenifer.mp3';
import audioThais from '../../audios/Thais.mp3';
import audioRaquel from '../../audios/Raquel.mp3';

const StartingIA_V3 = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- CONFIGURAÇÃO DAS VOZES ---
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

  // Estados do Agente
  const [gender, setGender] = useState('female');
  const [selectedVoiceId, setSelectedVoiceId] = useState(''); // ID da voz selecionada
  const [playingVoiceId, setPlayingVoiceId] = useState(null); // ID da voz tocando agora
  const [audioObj, setAudioObj] = useState(null); // Objeto de áudio atual

  const [aiName, setAiName] = useState('');
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [userNickname, setUserNickname] = useState('');
  
  // Estados do Telefone
  const [ddi, setDdi] = useState('55');
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

  // --- HANDLER DE ÁUDIO ---
  const handlePlayAudio = (e, voice) => {
    e.stopPropagation(); // Impede de selecionar o card ao clicar no play

    // Se já estiver tocando esse áudio, pausa
    if (playingVoiceId === voice.id) {
      if (audioObj) {
        audioObj.pause();
        setPlayingVoiceId(null);
      }
      return;
    }

    // Se estiver tocando outro, para o anterior
    if (audioObj) {
      audioObj.pause();
      audioObj.currentTime = 0;
    }

    // Toca o novo
    const newAudio = new Audio(voice.src);
    newAudio.play();
    setAudioObj(newAudio);
    setPlayingVoiceId(voice.id);

    // Quando terminar, reseta o ícone
    newAudio.onended = () => setPlayingVoiceId(null);
  };

  // Limpa áudio ao desmontar ou mudar passo
  useEffect(() => {
    return () => {
      if (audioObj) audioObj.pause();
    };
  }, [audioObj, step]);


  // --- NAVEGAÇÃO ---
  const nextStep = () => {
    if (step === 1 && !selectedVoiceId) return alert("Selecione uma voz para continuar.");
    if (step === 2 && !aiName) return alert("Digite um nome para a IA.");
    if (step === 3 && selectedTraits.length === 0) return alert("Selecione pelo menos uma personalidade.");
    if (step === 4 && !userNickname) return alert("Digite seu nome.");
    
    if (step === 5) {
      if (!ddd || ddd.length < 2) return alert("Digite um DDD válido.");
      if (!phone) return alert("Digite o número do telefone.");
      if (phone.length !== 9) return alert("O número deve ter exatamente 9 dígitos.");
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
    return '👩‍💼';
  };

  // --- FUNÇÃO FINAL: CRIAR USUÁRIO NA API ---
  const handleFinalSubmit = async () => {
    if (!email || !password) return alert("Preencha e-mail e senha.");

    setIsLoading(true);

    const payload = {
      full_name: userNickname,
      country_code: ddi,
      area_code: ddd,
      phone_number: phone,
      user_nickname: userNickname,
      agent_nickname: aiName,
      agent_gender: gender === 'female' ? 'Feminino' : 'Masculino',
      agent_voice_id: selectedVoiceId, // ID REAL DA VOZ
      agent_personality: selectedTraits,
      email: email, // Adicionado campo de e-mail (se sua API esperar isso no payload de create)
      password: password // Adicionado campo de senha
    };

    try {
      console.log("Enviando Payload:", payload);
      await createUserService(payload);
      
      alert("Agente criado com sucesso! Redirecionando para login...");
      navigate('/login');
      
    } catch (error) {
      console.error("Erro na criação:", error);
      const msg = error.message || "";
      if (msg.toLowerCase().includes("já existe um usuário") || msg.toLowerCase().includes("already exists")) {
        alert("Ops! Já existe uma conta vinculada a este telefone.");
        navigate('/login');
      } else {
        alert(`Erro ao criar conta: ${msg}`);
      }
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
          
          {/* PASSO 1: SELEÇÃO DE VOZ COM PREVIEW */}
          {step === 1 && (
            <div className="step-wrapper">
              <h1 className="v3-title">Escolha a voz.</h1>
              <p className="v3-desc">Ouça e selecione o tom ideal para seu agente.</p>
              
              {/* Toggle Gênero */}
              <div className="gender-toggle-container">
                <button 
                  className={`gender-tab ${gender === 'female' ? 'active' : ''}`} 
                  onClick={() => setGender('female')}
                >
                  👩 Feminina
                </button>
                <button 
                  className={`gender-tab ${gender === 'male' ? 'active' : ''}`} 
                  onClick={() => setGender('male')}
                >
                  👨 Masculina
                </button>
              </div>

              {/* Lista de Vozes */}
              <div className="voice-list">
                {VOICES[gender].map((voice) => (
                  <div 
                    key={voice.id}
                    className={`voice-card ${selectedVoiceId === voice.id ? 'selected' : ''}`}
                    onClick={() => setSelectedVoiceId(voice.id)}
                  >
                    <div className="voice-info">
                      <div className="voice-icon-circle">
                        {gender === 'female' ? '👩' : '👨'}
                      </div>
                      <span className="voice-name">{voice.name}</span>
                    </div>

                    <div className="voice-actions">
                      {/* Botão de Play */}
                      <button 
                        className={`btn-audio-preview ${playingVoiceId === voice.id ? 'playing' : ''}`}
                        onClick={(e) => handlePlayAudio(e, voice)}
                      >
                        {playingVoiceId === voice.id ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                      </button>
                      
                      {/* Check de Seleção */}
                      <div className="selection-radio">
                        {selectedVoiceId === voice.id && <div className="radio-inner" />}
                      </div>
                    </div>
                  </div>
                ))}
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