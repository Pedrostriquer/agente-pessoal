import React, { useState } from 'react';
import './StudyPage.css';
import { 
  Plus, Trash2, ChevronDown, ChevronUp, 
  BookOpen, CalendarDays, FileText 
} from 'lucide-react';

const StudyPage = ({ isSidebarOpen }) => {
  
  // --- ESTADOS ---

  // 1. Matérias
  const [subjects, setSubjects] = useState([
    { 
      id: 1, 
      name: 'Cálculo II', 
      // Agora um campo único de texto livre
      content: `Professor: Roberto
Sala: Bloco C - 304
Horário: Seg/Qua 19:00

--- Avaliações ---
P1: 4.5 (Preciso recuperar)
P2: 12/12 (Matéria toda)

--- Anotações ---
Estudar regra da cadeia e integrais duplas.`
    },
    { 
      id: 2, 
      name: 'Engenharia de Software', 
      content: `Professora: Ana
Laboratório 02

Entregar diagrama de classes impresso até dia 15.
Nota atual: 9.0`
    }
  ]);

  const [newSubjectName, setNewSubjectName] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // 2. Horário Semanal (Visual apenas)
  const schedule = [
    { day: 'Seg', classes: [{ name: 'Cálculo II', time: '19:00' }, { name: 'Física', time: '21:00' }] },
    { day: 'Ter', classes: [{ name: 'Eng. Soft', time: '19:00' }] },
    { day: 'Qua', classes: [{ name: 'Cálculo II', time: '19:00' }] },
    { day: 'Qui', classes: [{ name: 'Eng. Soft', time: '21:00' }] },
    { day: 'Sex', classes: [] },
  ];

  // --- HANDLERS ---

  const handleAddSubject = () => {
    if (!newSubjectName) return;
    const newSub = {
      id: Date.now(),
      name: newSubjectName,
      content: '' // Começa vazio
    };
    setSubjects([...subjects, newSub]);
    setNewSubjectName('');
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const updateContent = (id, newText) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, content: newText } : s));
  };

  return (
    <div className={`study-wrapper fade-in ${isSidebarOpen ? 'open' : 'closed'}`}>
      
      <header className="page-header">
        <h1>Área de Estudos</h1>
        <p>Acompanhe suas aulas e anotações.</p>
      </header>

      {/* 1. HORÁRIO SEMANAL (TOPO) */}
      <section className="schedule-section">
        <div className="section-title">
          <CalendarDays size={18} color="#10b981"/>
          <h3>Grade Semanal</h3>
        </div>
        <div className="schedule-grid">
          {schedule.map((day, index) => (
            <div key={index} className="day-card">
              <div className="day-header">{day.day}</div>
              <div className="class-list">
                {day.classes.length > 0 ? (
                  day.classes.map((cls, idx) => (
                    <div key={idx} className="class-item">
                      <span className="cls-time">{cls.time}</span>
                      <span className="cls-name">{cls.name}</span>
                    </div>
                  ))
                ) : (
                  <span className="no-class">-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. LISTA DE MATÉRIAS */}
      <section className="subjects-section">
        <div className="section-title">
          <BookOpen size={18} color="#10b981"/>
          <h3>Caderno de Matérias</h3>
        </div>

        {/* Adicionar Matéria */}
        <div className="add-subject-bar">
          <input 
            placeholder="Nova matéria..." 
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
          />
          <button onClick={handleAddSubject}><Plus size={20}/></button>
        </div>

        <div className="subjects-list">
          {subjects.map(sub => {
            const isOpen = expandedId === sub.id;
            return (
              <div key={sub.id} className={`subject-card ${isOpen ? 'expanded' : ''}`}>
                
                {/* Cabeçalho do Card */}
                <div className="subject-header" onClick={() => toggleExpand(sub.id)}>
                  <div className="sub-title-row">
                    <div className="icon-sub">{sub.name.charAt(0)}</div>
                    <strong>{sub.name}</strong>
                  </div>
                  <div className="sub-actions">
                    <button 
                      className="btn-trash" 
                      onClick={(e) => { e.stopPropagation(); removeSubject(sub.id); }}
                    >
                      <Trash2 size={16}/>
                    </button>
                    {isOpen ? <ChevronUp size={20} color="#64748b"/> : <ChevronDown size={20} color="#64748b"/>}
                  </div>
                </div>

                {/* Conteúdo Expandido (EDITOR DE TEXTO LIVRE) */}
                {isOpen && (
                  <div className="subject-body">
                    <div className="document-editor">
                      <div className="editor-label">
                        <FileText size={14} /> Detalhes & Anotações
                      </div>
                      <textarea 
                        className="paper-textarea"
                        placeholder="Escreva aqui horarios, salas, datas de provas, notas..."
                        value={sub.content}
                        onChange={(e) => updateContent(sub.id, e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

    </div>
  );
};

export default StudyPage;