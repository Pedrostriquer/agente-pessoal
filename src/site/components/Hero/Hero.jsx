import React, { useState, useEffect, useRef } from "react";
// ADICIONADO: useScroll e useTransform para o efeito de rolagem
import { motion, AnimatePresence, animate, useScroll, useTransform } from "framer-motion";
import { 
  Send, 
  ArrowRight, 
  TrendingDown, 
  MoreHorizontal 
} from "lucide-react";
import "./Hero.css";

// ... (MANTENHA OS COMPONENTES AnimatedCounter E Typewriter IGUAIS AQUI) ...
const AnimatedCounter = ({ from, to }) => {
  const nodeRef = useRef();
  useEffect(() => {
    const node = nodeRef.current;
    const controls = animate(from, to, {
      duration: 1.0, 
      ease: "circOut", 
      onUpdate(value) {
        node.textContent = value.toLocaleString('pt-BR', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        });
      }
    });
    return () => controls.stop();
  }, [from, to]);
  return <span ref={nodeRef} className="tabular-nums" />; 
};

const Typewriter = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let index = 0;
    let isMounted = true;
    const typeChar = () => {
      if (!isMounted) return;
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
        const delay = Math.random() * 60 + 40; 
        setTimeout(typeChar, delay);
      } else {
        if (onComplete) onComplete();
      }
    };
    typeChar();
    return () => { isMounted = false; };
  }, [text, onComplete]);
  return <span className="typing-text">{displayedText}</span>;
};
// ... (FIM DOS COMPONENTES AUXILIARES) ...


export default function Hero() {
  const [startTyping, setStartTyping] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  
  const [aiReplied, setAiReplied] = useState(false);      
  const [showPopover, setShowPopover] = useState(false);  
  const [decreaseBalance, setDecreaseBalance] = useState(false); 

  // --- LÓGICA DE TRANSIÇÃO DE SCROLL (NOVA) ---
  const { scrollY } = useScroll();
  
  // Enquanto rola de 0px a 500px:
  // 1. Opacidade vai de 100% a 0%
  const opacity = useTransform(scrollY, [0, 500], [1, 0]); 
  // 2. Escala vai de 1 para 0.9 (efeito de profundidade)
  const scale = useTransform(scrollY, [0, 500], [1, 0.95]);
  // 3. Move o Hero um pouco mais devagar que o scroll (Parallax)
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  // 4. Adiciona um blur progressivo
  const blur = useTransform(scrollY, [0, 400], ["blur(0px)", "blur(10px)"]);

  useEffect(() => {
    const runSequence = async () => {
      await new Promise(r => setTimeout(r, 1000));
      setStartTyping(true);
    };
    runSequence();
  }, []);

  const handleTypingComplete = async () => {
    await new Promise(r => setTimeout(r, 500));
    setStartTyping(false);
    setMessageSent(true);
    await new Promise(r => setTimeout(r, 800));
    setAiThinking(true);
    await new Promise(r => setTimeout(r, 1500));
    setAiThinking(false);
    setAiReplied(true);
    await new Promise(r => setTimeout(r, 700));
    setShowPopover(true);
    await new Promise(r => setTimeout(r, 1000));
    setDecreaseBalance(true);
  };

  return (
    // Transformamos a section em motion.section para aplicar os hooks
    <motion.section 
      className="hero-section"
      style={{ opacity, scale, y, filter: blur }} // APLICAÇÃO DOS EFEITOS
    >
      {/* Background Orbs */}
      <div className="hero-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <div className="container">
        
        {/* LADO ESQUERDO */}
        <div className="content-side">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="pill-badge">
              <span className="dot"></span>
              Seu Butler Digital
            </div>
            <h1 className="title">
              Organize sua vida <br />
              no ritmo do <span className="text-gradient">WhatsApp</span>.
            </h1>
            <p className="description">
              Registre gastos, consulte a agenda e bata metas conversando naturalmente. 
              A simplicidade de uma mensagem com o poder de uma IA.
            </p>
            <div className="buttons-wrapper">
              <motion.button className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Começar Agora <ArrowRight size={18} />
              </motion.button>
              <button className="btn-outline">Ver Funcionalidades</button>
            </div>
          </motion.div>
        </div>

        {/* LADO DIREITO */}
        <div className="visual-side">
          <div className="composition-area">
            
            <AnimatePresence>
              {aiReplied && (
                <motion.div 
                  className="finance-widget glass-card"
                  initial={{ opacity: 0, x: 50, rotateY: -10 }} 
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 1.2, type: "spring", stiffness: 50, damping: 15 }}
                >
                  <div className="card-shine"></div>
                  <div className="widget-header">
                    <div className="bank-logo">
                      <div className="circle red"></div>
                      <div className="circle orange"></div>
                    </div>
                    <MoreHorizontal size={20} className="menu-icon" />
                  </div>
                  <div className="balance-section">
                    <span className="label">Saldo Total</span>
                    <div className={`balance-value ${decreaseBalance ? 'updating' : ''}`}>
                      <span className="currency">R$</span>
                      {decreaseBalance ? (
                        <AnimatedCounter from={250} to={230} />
                      ) : (
                        <span className="tabular-nums">250,00</span>
                      )}
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="card-details">
                      <span className="card-num">**** 8492</span>
                      <span className="card-name">CONTA CORRENTE</span>
                    </div>
                    <div className="visa-tag">VISA</div>
                  </div>
                  <motion.div 
                    className="expense-popover"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ 
                      opacity: showPopover ? 1 : 0, 
                      y: showPopover ? 0 : 20,
                      scale: showPopover ? 1 : 0.9
                    }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="expense-icon-bg">
                      <TrendingDown size={14} color="#fff" />
                    </div>
                    <div className="expense-text">
                      <span>Lanche Faculdade</span>
                      <small>- R$ 20,00</small>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              className="chat-interface glass-panel"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
            >
              <div className="chat-header">
                <div className="avatar-wrapper">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Butler" />
                </div>
                <div className="header-info">
                  <strong>Seu Butler</strong>
                  <span>Online</span>
                </div>
              </div>
              <div className="chat-content">
                <AnimatePresence>
                  {messageSent && (
                    <motion.div className="message user-message" initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5 }}>
                      Gastei 20 reais com um lanche na faculdade 🍔
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {aiThinking && (
                    <motion.div className="message ai-message loading-bubble" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="dots"><span></span><span></span><span></span></div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {aiReplied && (
                    <motion.div className="message ai-message" initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5 }}>
                      <p>Anotado! ✅</p>
                      <p className="sub-text">Saldo atualizado com sucesso.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="input-area">
                <div className="input-field">
                  {startTyping && !messageSent ? (
                    <Typewriter text="Gastei 20 reais com um lanche..." onComplete={handleTypingComplete} />
                  ) : (
                    <span className="placeholder">Mensagem</span>
                  )}
                </div>
                <motion.div 
                  className={`send-btn ${messageSent ? 'sent' : ''}`}
                  animate={messageSent ? { scale: [1, 1.1, 1], backgroundColor: "#25D366", color: "#fff" } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Send size={18} />
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </motion.section>
  );
}