import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Check, 
  Smartphone, 
  MessageSquare, 
  Layers, 
  AlertCircle,
  Zap
} from "lucide-react";
import "./Transformation.css";

const ChaosCard = () => (
  <div className="card-scenario chaos">
    <div className="scenario-header">
      <div className="icon-box red"><AlertCircle size={20} /></div>
      <h3>Rotina Fragmentada</h3>
    </div>
    <div className="chaos-visual">
        <motion.div className="floating-notif n1" animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <span>Pagar luz!! 🚨</span>
        </motion.div>
        <motion.div className="floating-notif n2" animate={{ y: [0, 6, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}>
            <span>Prova amanhã??</span>
        </motion.div>
        <motion.div className="floating-notif n3" animate={{ y: [0, -4, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}>
            <span>Onde anotei??</span>
        </motion.div>
        
        <div className="scattered-apps">
            <div className="app-icon a1"></div>
            <div className="app-icon a2"></div>
            <div className="app-icon a3"></div>
            <div className="app-icon a4"></div>
        </div>
    </div>
    <ul className="scenario-list">
      <li><X size={14} className="x-icon"/> 5 Apps diferentes para gerenciar</li>
      <li><X size={14} className="x-icon"/> Dados espalhados e perdidos</li>
      <li><X size={14} className="x-icon"/> Carga mental constante</li>
    </ul>
  </div>
);

const OrderCard = () => (
  <div className="card-scenario order">
    <div className="scenario-header">
      <div className="icon-box green"><Zap size={20} /></div>
      <h3>Fluxo Unificado</h3>
    </div>
    <div className="order-visual">
        <div className="central-hub">
            <MessageSquare size={28} color="white" fill="white" />
        </div>
        
        <motion.div className="orbit o1" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
            <div className="planet p1"></div>
        </motion.div>
        <motion.div className="orbit o2" animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
            <div className="planet p2"></div>
        </motion.div>
    </div>
    <ul className="scenario-list">
      <li><Check size={14} className="check-icon"/> Tudo no seu WhatsApp</li>
      <li><Check size={14} className="check-icon"/> Cruzamento de dados inteligente</li>
      <li><Check size={14} className="check-icon"/> Paz de espírito automática</li>
    </ul>
  </div>
);

const ReplacementItem = ({ oldTool, newTool, delay }) => (
  <motion.div 
    className="replace-row"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
  >
    <div className="side old">
        <span>{oldTool}</span>
    </div>
    <div className="arrow-box">
        <motion.div 
            animate={{ x: [0, 5, 0] }} 
            transition={{ duration: 2, repeat: Infinity }}
        >
            →
        </motion.div>
    </div>
    <div className="side new">
        <strong>{newTool}</strong>
    </div>
  </motion.div>
);

export default function Transformation() {
  return (
    <section className="trans-section">
      <div className="trans-container">
        
        <div className="trans-header">
            <motion.span className="trans-tag" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>Upgrade de Vida</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                Pare de lutar contra <br/> sua própria rotina.
            </motion.h2>
            <p className="trans-desc">
                Você não precisa de mais disciplina. Você precisa de um sistema melhor.
                Veja como o MyButler limpa o ruído do seu dia a dia.
            </p>
        </div>

        <div className="comparison-wrapper">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <ChaosCard />
            </motion.div>
            
            <div className="vs-badge">VS</div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <OrderCard />
            </motion.div>
        </div>

        <div className="consolidation-area">
            <div className="cons-text">
                <h3>O poder da Consolidação</h3>
                <p>Ao assinar o MyButler, você para de desperdiçar energia (e dinheiro) gerenciando múltiplas ferramentas incompletas.</p>
            </div>
            
            <div className="cons-list">
                <ReplacementItem 
                    oldTool="Apps de Controle Financeiro" 
                    newTool="Áudios de 5 segundos" 
                    delay={0.2}
                />
                <ReplacementItem 
                    oldTool="Agenda + To-Do List + Notas" 
                    newTool="Um Chat Inteligente" 
                    delay={0.3}
                />
                <ReplacementItem 
                    oldTool="Carga Mental & Ansiedade" 
                    newTool="Controle Total" 
                    delay={0.4}
                />
            </div>
        </div>

      </div>
    </section>
  );
}