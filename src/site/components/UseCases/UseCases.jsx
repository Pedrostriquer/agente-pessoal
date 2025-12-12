import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, 
  GraduationCap, 
  ShoppingCart, 
  ArrowRight,
  Check
} from "lucide-react";
import "./UseCases.css";

const FinanceVisual = () => (
  <div className="uc-visual finance-visual">
    <div className="chart-container">
        {[40, 70, 30, 85, 50].map((h, i) => (
            <motion.div 
                key={i} 
                className="chart-bar"
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.1, duration: 0.5, type: "spring" }}
            >
                <div className="bar-tooltip">R$ {h * 10}</div>
            </motion.div>
        ))}
    </div>
    <motion.div 
        className="balance-pill"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
    >
        <span>Saldo Atual</span>
        <strong>R$ 2.450,00</strong>
    </motion.div>
  </div>
);

const StudyVisual = () => (
  <div className="uc-visual study-visual">
    <motion.div 
        className="focus-circle"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
        <div className="dot-marker"></div>
    </motion.div>
    <div className="timer-content">
        <span className="label">Foco: Cálculo II</span>
        <motion.div 
            className="time-display"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            24:59
        </motion.div>
    </div>
    <div className="progress-container">
        <div className="progress-label">Meta Diária</div>
        <div className="progress-track">
            <motion.div 
                className="progress-fill" 
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1.5, delay: 0.2 }}
            />
        </div>
    </div>
  </div>
);

const MarketVisual = () => (
  <div className="uc-visual market-visual">
    <div className="paper-sheet">
        <div className="hole"></div>
        <div className="lines">
            {["Leite Desnatado", "Ovos (30 un)", "Pão Integral", "Maçãs"].map((item, i) => (
                <motion.div 
                    key={i} 
                    className="list-row"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.3 }}
                >
                    <div className="checkbox-round">
                        <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            transition={{ delay: i * 0.3 + 0.2 }}
                        >
                            <Check size={10} color="white" strokeWidth={4} />
                        </motion.div>
                    </div>
                    <span>{item}</span>
                </motion.div>
            ))}
        </div>
    </div>
  </div>
);

const scenarios = [
  {
    id: "finance",
    icon: <Wallet size={20} />,
    title: "Controle Financeiro",
    desc: "Apenas fale: 'Gastei 50 no Uber'. A IA categoriza, desconta do saldo e gera gráficos.",
    color: "#10B981", 
    component: <FinanceVisual />
  },
  {
    id: "study",
    icon: <GraduationCap size={20} />,
    title: "Rotina de Estudos",
    desc: "Cadastre matérias e horários. Receba lembretes de revisão e cronometre seu foco.",
    color: "#8B5CF6", 
    component: <StudyVisual />
  },
  {
    id: "market",
    icon: <ShoppingCart size={20} />,
    title: "Mercado & Casa",
    desc: "Lembrou que acabou o leite? Avise a IA e sua lista estará pronta quando chegar no mercado.",
    color: "#F59E0B", 
    component: <MarketVisual />
  }
];

export default function UseCases() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="use-cases-section">
      <div className="uc-container">
        
        <div className="uc-header">
            <motion.span 
                className="uc-tag"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                Versatilidade
            </motion.span>
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
            >
                Um assistente para <br/> cada momento.
            </motion.h2>
        </div>

        <div className="uc-content-wrapper">
            <div className="uc-nav">
                {scenarios.map((scenario, index) => (
                    <div 
                        key={scenario.id}
                        className={`nav-item ${activeTab === index ? 'active' : ''}`}
                        onClick={() => setActiveTab(index)}
                        style={{ "--accent-color": scenario.color }}
                    >
                        <div className="nav-icon-box">
                            {scenario.icon}
                        </div>
                        <div className="nav-text">
                            <h3>{scenario.title}</h3>
                            <p>{scenario.desc}</p>
                        </div>
                        {activeTab === index && (
                            <motion.div 
                                className="nav-indicator" 
                                layoutId="navIndicator"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="uc-display-area">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        className="visual-wrapper"
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        style={{ "--theme-color": scenarios[activeTab].color }}
                    >
                        <div className="display-bg-glow" />
                        
                        {scenarios[activeTab].component}

                        <div className="context-action">
                            <span>Ver Detalhes</span>
                            <ArrowRight size={14} />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

      </div>
    </section>
  );
}