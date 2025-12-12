import React from 'react';
import { motion } from 'framer-motion';
import './Background.css';

export default function Background() {
  return (
    <div className="global-background">
      {/* Orb Verde Principal (O mesmo tom do Hero) */}
      <motion.div 
        className="orb orb-primary"
        animate={{ 
          x: [0, 50, -30, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Orb Verde Escuro / Azulado (Profundidade) */}
      <motion.div 
        className="orb orb-secondary"
        animate={{ 
          x: [0, -40, 40, 0],
          y: [0, 40, -40, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Camada de ruído para dar textura de "filme" e tirar o aspecto digital chapado */}
      <div className="noise-overlay"></div>
    </div>
  );
}