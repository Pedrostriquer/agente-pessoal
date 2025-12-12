import React, { useRef, useEffect } from "react";
import { 
  ShoppingCart, 
  CheckSquare, 
  LayoutGrid, 
  Zap,
  TrendingDown,
} from "lucide-react"; 
import { motion } from "framer-motion";
import "./Features.css";

// Importação da imagem
import screenshotImage from "../../../assets/Captura de Tela 2025-12-07 às 19.47.10.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 50, damping: 15 }
  }
};

const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(37, 211, 102, 0.15)", variants }) => {
  const divRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!divRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      divRef.current.style.setProperty("--mouse-x", `${x}px`);
      divRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    const card = divRef.current;
    card.addEventListener("mousemove", handleMouseMove);
    return () => card.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={divRef}
      className={`spotlight-card ${className}`}
      style={{ "--spotlight-color": spotlightColor }}
      variants={variants} 
    >
      <div className="spotlight-overlay" />
      <div className="card-inner-content">
        {children}
      </div>
    </motion.div>
  );
};

export default function Features() {
  return (
    <section className="features-section">
      <div className="features-container">
        
        {/* CORREÇÃO: Classe renomeada para não conflitar com StudyPage */}
        <motion.div 
          className="ft-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="tag-wrapper">
            <motion.span className="ft-tag">Funcionalidades</motion.span>
          </div>
          <h2>Um cérebro digital,<br/>vivendo no seu bolso.</h2>
        </motion.div>

        <motion.div 
          className="bento-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          
          <SpotlightCard className="bento-card card-platform" variants={itemVariants}>
            {/* CORREÇÃO: Classe renomeada para não conflitar com Dashboard */}
            <div className="ft-card-header">
              <div className="icon-badge blue"><LayoutGrid size={20} /></div>
              <div className="text-content">
                <h3>Visão de Comandante</h3>
                <p>Dashboard web completo para quando você precisa sentar e planejar a semana com detalhes.</p>
              </div>
            </div>
            <div className="card-image-wrapper">
              <div className="image-container">
                <img src={screenshotImage} alt="Dashboard da Plataforma Web" />
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="bento-card card-whatsapp" spotlightColor="rgba(37, 211, 102, 0.2)" variants={itemVariants}>
            <div className="whatsapp-bg-clean"></div>
            <div className="card-content-wrapper center-vertical">
              <motion.div 
                className="ios-notification"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="notif-header">
                  <div className="notif-icon"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" /></div>
                  <span className="notif-app">WhatsApp</span>
                  <span className="notif-time">AGORA</span>
                </div>
                <div className="notif-body">
                  <strong>Seu Butler</strong>
                  <p>🔔 Lembrete: Pagar a conta de luz até as 18h.</p>
                </div>
              </motion.div>

              <div className="card-text-bottom">
                <h3>Sempre no seu radar</h3>
                <p>Receba lembretes e insights no app que você mais usa. Impossível ignorar.</p>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="bento-card card-finance" spotlightColor="rgba(244, 63, 94, 0.2)" variants={itemVariants}>
             <div className="card-header-simple">
                <h3>Controle Financeiro</h3>
                <p>Monitore gastos sem abrir planilhas.</p>
             </div>

             <div className="finance-dashboard-mini">
                <div className="balance-card">
                  <span className="lbl">Saldo Disponível</span>
                  <div className="val">R$ 2.450,00</div>
                  <div className="trend negative">
                    <TrendingDown size={14} />
                    <span>R$ 120 gastos hoje</span>
                  </div>
                </div>

                <div className="expense-row">
                  <div className="exp-icon"><Zap size={14} /></div>
                  <div className="exp-info">
                    <span>Conta de Luz</span>
                    <small>Há 2 horas</small>
                  </div>
                  <span className="exp-amount">- R$ 150</span>
                </div>
             </div>
          </SpotlightCard>

          <SpotlightCard className="bento-card card-integrations" spotlightColor="rgba(245, 158, 11, 0.2)" variants={itemVariants}>
            {/* CORREÇÃO: Classe renomeada */}
            <div className="ft-card-header">
              <div className="icon-badge orange"><Zap size={20} /></div>
              <div className="text-content">
                <h3>Conectado a Tudo</h3>
                <p>Google Workspace e Listas inteligentes.</p>
              </div>
            </div>
            
            <div className="widgets-container">
              <div className="widget-row google-row">
                <div className="widget-title">Workspace</div>
                <div className="logos-group">
                    <img src="https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png" alt="Gmail" title="Gmail" />
                    <img src="https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png" alt="Calendar" title="Calendar" />
                    <img src="https://www.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png" alt="Drive" title="Drive" />
                    <span className="sync-badge">Sincronizado</span>
                </div>
              </div>

              <div className="widgets-split">
                <div className="mini-list-widget market">
                    <div className="list-header">
                        <ShoppingCart size={14} className="text-green-600" />
                        <span>Mercado</span>
                    </div>
                    <ul className="list-items">
                        <li><span className="bullet green"></span>Leite Desnatado</li>
                        <li><span className="bullet green"></span>Café em Grão</li>
                        <li><span className="bullet green"></span>Detergente</li>
                    </ul>
                </div>

                <div className="mini-list-widget todo">
                    <div className="list-header">
                        <CheckSquare size={14} className="text-blue-600" />
                        <span>Tarefas</span>
                    </div>
                    <ul className="list-items">
                        <li className="checked">
                            <div className="checkbox">✓</div>
                            <span>Pagar Internet</span>
                        </li>
                        <li>
                            <div className="checkbox empty"></div>
                            <span>Agendar Médico</span>
                        </li>
                    </ul>
                </div>
              </div>
            </div>
          </SpotlightCard>

        </motion.div>
      </div>
    </section>
  );
}