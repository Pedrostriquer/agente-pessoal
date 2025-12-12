import React from "react";
import { motion } from "framer-motion";
import { Mic, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import "./HowItWorks.css";

const VoiceVisual = () => {
  return (
    <div className="visual-stage voice-stage">
      <div className="voice-bars">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="bar"
            animate={{
              height: [20, 40 + Math.random() * 40, 20],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
            }}
          />
        ))}
      </div>
      <motion.div 
        className="mic-icon-wrapper"
        animate={{ boxShadow: ["0 0 0 0px rgba(37, 211, 102, 0)", "0 0 0 10px rgba(37, 211, 102, 0.2)", "0 0 0 20px rgba(37, 211, 102, 0)"] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Mic size={24} color="#fff" />
      </motion.div>
    </div>
  );
};

const ProcessingVisual = () => {
  return (
    <div className="visual-stage processing-stage">
      <motion.div 
        className="ring ring-1"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="ring ring-2"
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <div className="core-glow">
        <Zap size={28} className="zap-icon" />
      </div>
      
      <motion.div className="code-particle p1" animate={{ y: [-10, 10, -10], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}>101</motion.div>
      <motion.div className="code-particle p2" animate={{ y: [10, -10, 10], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}>{`{ }`}</motion.div>
    </div>
  );
};

const ActionVisual = () => {
  return (
    <div className="visual-stage action-stage">
      <motion.div 
        className="mini-card calendar-card"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="card-top">
          <div className="dot red"></div>
          <div className="line"></div>
        </div>
        <div className="card-body">
            <span className="event-time">14:00</span>
            <span className="event-name">Dentista</span>
        </div>
        <motion.div 
            className="check-badge"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
        >
            <CheckCircle2 size={16} color="white" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default function HowItWorks() {
  return (
    <section className="how-it-works-section">
      <div className="hiw-container">
        <motion.div 
            className="hiw-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
          <span className="sub-tag">Workflow Simples</span>
          <h2>Do áudio à ação em <br /><span className="highlight">segundos.</span></h2>
        </motion.div>

        <div className="steps-grid">
            <motion.div className="step-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <div className="visual-container">
                    <VoiceVisual />
                </div>
                <div className="step-content">
                    <span className="step-number">01</span>
                    <h3>Você Envia</h3>
                    <p>Mande um áudio no WhatsApp como se falasse com um amigo. "Marque dentista amanhã às 14h".</p>
                </div>
            </motion.div>

            <div className="step-connector">
                <ArrowRight size={24} className="arrow-icon" />
            </div>

            <motion.div className="step-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                <div className="visual-container">
                    <ProcessingVisual />
                </div>
                <div className="step-content">
                    <span className="step-number">02</span>
                    <h3>Ele Entende</h3>
                    <p>A IA transcreve, interpreta a intenção e extrai datas, valores e categorias automaticamente.</p>
                </div>
            </motion.div>

             <div className="step-connector">
                <ArrowRight size={24} className="arrow-icon" />
            </div>

            <motion.div className="step-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                <div className="visual-container">
                    <ActionVisual />
                </div>
                <div className="step-content">
                    <span className="step-number">03</span>
                    <h3>Está Feito</h3>
                    <p>O evento aparece na sua Google Agenda ou o gasto vai para sua planilha financeira.</p>
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}