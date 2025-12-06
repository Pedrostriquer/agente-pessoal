import React, { useState } from 'react';
import './Dashboard.css';
import { 
  Plus, Trash2, CheckCircle2, Circle, Calendar as CalendarIcon, 
  TrendingUp, TrendingDown, ChevronDown, ChevronUp,
  DownloadCloud, Edit3, ShoppingCart, Clock, Wallet, MapPin, 
  BookOpen, AlertCircle, Lightbulb, Menu, X
} from 'lucide-react';

// Adicionei isSidebarOpen nas props para controlar a margem
const Dashboard = ({ toggleSidebar, isSidebarOpen }) => {
  
  // --- ESTADOS ---
  const [selectedDate, setSelectedDate] = useState(6);

  // 1. TO-DO
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Finalizar Protótipo', done: false },
    { id: 2, title: 'Pagar Internet', done: true },
    { id: 3, title: 'Agendar Médico', done: false },
    { id: 4, title: 'Responder E-mails', done: false },
    { id: 5, title: 'Limpar Escritório', done: false },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // 2. MERCADO
  const [marketList, setMarketList] = useState([
    { id: 1, text: 'Leite', done: false },
    { id: 2, text: 'Café', done: true },
    { id: 3, text: 'Ovos', done: false },
    { id: 4, text: 'Detergente', done: false },
  ]);
  const [newMarketItem, setNewMarketItem] = useState('');

  // 3. IDEIAS
  const [ideas, setIdeas] = useState([
    { id: 1, text: 'Canal no YouTube sobre Tech' },
    { id: 2, text: 'Investir em Fundos Imobiliários' },
    { id: 3, text: 'Aprender Python' },
  ]);
  const [newIdea, setNewIdea] = useState('');

  // 4. PLANEJAMENTO (Sem input de add)
  const [plans, setPlans] = useState([
    { 
      id: 1, title: 'Viagem Irlanda 🇮🇪', progress: 45, 
      steps: [
        { id: 101, text: 'Tirar Passaporte', done: true },
        { id: 102, text: 'Comprar Euro', done: false },
      ]
    },
    { 
      id: 2, title: 'Setup Novo', progress: 20, 
      steps: [
        { id: 201, text: 'Comprar Cadeira', done: false },
        { id: 202, text: 'Pintar Paredes', done: true },
      ]
    },
  ]);
  const [expandedPlanId, setExpandedPlanId] = useState(null);

  // 5. ESTUDOS
  const [subjects, setSubjects] = useState([
    { 
      id: 1, name: 'Cálculo II', grade: '4.5', 
      infos: [
        { icon: <Clock size={14}/>, text: 'Seg/Qua 19:00' },
        { icon: <MapPin size={14}/>, text: 'Sala 304 - B' },
        { icon: <AlertCircle size={14}/>, text: 'Prova: 12/12' },
        { icon: <DownloadCloud size={14}/>, text: 'Resumo_Limites.pdf', isLink: true }
      ],
      tasks: ['Lista 04', 'Revisar Integrais']
    },
    { 
      id: 2, name: 'Eng. Software', grade: '9.0', 
      infos: [
        { icon: <Clock size={14}/>, text: 'Ter/Qui 21:00' },
        { icon: <MapPin size={14}/>, text: 'Lab 02' },
        { icon: <AlertCircle size={14}/>, text: 'Prova: 15/12' },
        { icon: <DownloadCloud size={14}/>, text: 'UML_Diagrams.pdf', isLink: true }
      ],
      tasks: ['Diagrama de Classes', 'Caso de Uso']
    }
  ]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(1);

  // --- HANDLERS ---
  const addTask = () => {
    if(!newTaskTitle) return;
    setTasks([...tasks, {id: Date.now(), title: newTaskTitle, done: false}]);
    setNewTaskTitle('');
  };
  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? {...t, done: !t.done} : t));

  const addMarket = () => {
    if(!newMarketItem) return;
    setMarketList([...marketList, {id: Date.now(), text: newMarketItem, done: false}]);
    setNewMarketItem('');
  };
  const toggleMarket = (id) => setMarketList(marketList.map(m => m.id === id ? {...m, done: !m.done} : m));

  const addIdea = () => {
    if(!newIdea) return;
    setIdeas([...ideas, {id: Date.now(), text: newIdea}]);
    setNewIdea('');
  };
  const removeIdea = (id) => setIdeas(ideas.filter(i => i.id !== id));

  const togglePlan = (id) => setExpandedPlanId(expandedPlanId === id ? null : id);
  const toggleStep = (planId, stepId) => {
    setPlans(plans.map(p => {
      if(p.id !== planId) return p;
      return { ...p, steps: p.steps.map(s => s.id === stepId ? {...s, done: !s.done} : s) }
    }));
  };

  const activeSubject = subjects.find(s => s.id === selectedSubjectId);

  // Mini Calendar render
  const renderMiniCalendar = () => {
    return Array.from({length: 31}, (_, i) => i + 1).map(day => (
      <div 
        key={day} 
        className={`cal-day-mini ${day === selectedDate ? 'active' : ''}`}
        onClick={() => setSelectedDate(day)}
      >
        {day}
      </div>
    ));
  };

  return (
    // Adicionei as classes condicionais aqui para ajustar a margem
    <div className={`dsh-wrapper fade-in ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      
      {/* HEADER */}
      <header className="dsh-header">
        <div className="header-left">
          <button className="menu-btn-mobile" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <div>
            <h1>Dashboard</h1>
            <p>Visão geral do sistema.</p>
          </div>
        </div>
        <div className="dsh-date">
          <CalendarIcon size={16} /> 06/12/2025
        </div>
      </header>

      {/* --- GRID LAYOUT ESTRUTURADO --- */}
      <div className="dsh-grid-container">

        {/* 1. AGENDA (TOPO ESQUERDA) */}
        <div className="dsh-card area-agenda">
          <div className="card-header">
             <h3><CalendarIcon size={16}/> Agenda Hoje</h3>
          </div>
          <div className="agenda-layout">
            <div className="agenda-items">
              <div className="agenda-row urgent">
                <span className="time">14:00</span>
                <span>Reunião Investidores</span>
              </div>
              <div className="agenda-row normal">
                <span className="time">16:30</span>
                <span>Dentista</span>
              </div>
              <div className="agenda-row">
                <span className="time">20:00</span>
                <span>Jantar</span>
              </div>
            </div>
            <div className="mini-calendar-grid">
              {renderMiniCalendar()}
            </div>
          </div>
        </div>

        {/* 2. FINANÇAS (TOPO DIREITA - AGORA EM CIMA) */}
        <div className="dsh-card area-finance">
           <div className="card-header">
             <h3><Wallet size={16} color="#10b981"/> Finanças</h3>
           </div>
           <div className="fin-content">
              <div className="fin-big-val">
                <small>Saldo Total</small>
                <h2>R$ 7.450,00</h2>
              </div>
              <div className="fin-mini-list">
                 <div className="mini-trans"><TrendingDown size={14} color="#ef4444"/> Uber - R$ 24,90</div>
                 <div className="mini-trans"><TrendingUp size={14} color="#10b981"/> Pix + R$ 150,00</div>
                 <div className="mini-trans"><TrendingDown size={14} color="#ef4444"/> Spotify - R$ 21,90</div>
              </div>
           </div>
        </div>

        {/* 3. TO-DO LIST (MEIO ESQUERDA) */}
        <div className="dsh-card area-todo">
          <div className="card-header">
            <h3>To-Do List</h3>
            <span className="badge">{tasks.filter(t => !t.done).length}</span>
          </div>
          <div className="input-row-clean">
             <input 
               placeholder="Nova tarefa..." 
               value={newTaskTitle}
               onChange={e => setNewTaskTitle(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && addTask()}
             />
             <button onClick={addTask}><Plus size={18}/></button>
          </div>
          <div className="list-scroll">
             {tasks.map(task => (
               <div key={task.id} className="item-row" onClick={() => toggleTask(task.id)}>
                  <div className={`check-circle ${task.done ? 'checked' : ''}`}>
                    {task.done && <CheckCircle2 size={16} color="white"/>}
                  </div>
                  <span className={task.done ? 'risked' : ''}>{task.title}</span>
               </div>
             ))}
          </div>
        </div>

        {/* 4. MERCADO (MEIO CENTRO) */}
        <div className="dsh-card area-market">
          <div className="card-header">
             <h3><ShoppingCart size={16} color="#10b981"/> Mercado</h3>
          </div>
          <div className="input-row-clean">
             <input 
               placeholder="Item..." 
               value={newMarketItem}
               onChange={e => setNewMarketItem(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && addMarket()}
             />
             <button onClick={addMarket}><Plus size={18}/></button>
          </div>
          <div className="list-scroll">
             {marketList.map(item => (
               <div key={item.id} className="item-row" onClick={() => toggleMarket(item.id)}>
                  <div className={`checkbox-sq ${item.done ? 'checked' : ''}`}>
                    {item.done && <CheckCircle2 size={14} color="white"/>}
                  </div>
                  <span className={item.done ? 'risked' : ''}>{item.text}</span>
               </div>
             ))}
          </div>
        </div>

        {/* 5. IDEIAS (MEIO DIREITA) */}
        <div className="dsh-card area-ideas">
           <div className="card-header">
              <h3><Lightbulb size={16} color="#f59e0b"/> Ideias</h3>
           </div>
           <div className="input-row-clean">
             <input 
               placeholder="Nova ideia..." 
               value={newIdea}
               onChange={e => setNewIdea(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && addIdea()}
             />
             <button onClick={addIdea}><Plus size={18}/></button>
          </div>
          <div className="list-scroll">
             {ideas.map(idea => (
               <div key={idea.id} className="idea-row-simple">
                 <span>{idea.text}</span>
                 <button onClick={() => removeIdea(idea.id)}><Trash2 size={14}/></button>
               </div>
             ))}
          </div>
        </div>

        {/* 6. ESTUDOS (BAIXO ESQUERDA - SPAN 2) */}
        <div className="dsh-card area-study">
           <div className="card-header">
             <h3><BookOpen size={16}/> Faculdade</h3>
           </div>
           
           <div className="study-container">
             {/* Abas */}
             <div className="study-tabs">
               {subjects.map(sub => (
                 <button 
                   key={sub.id} 
                   className={`tab-btn ${selectedSubjectId === sub.id ? 'active' : ''}`}
                   onClick={() => setSelectedSubjectId(sub.id)}
                 >
                   {sub.name}
                 </button>
               ))}
             </div>

             {/* Conteúdo em Listas Simples */}
             <div className="study-content-cols">
                <div className="study-col">
                   <h4 className="col-title">Informações</h4>
                   <div className="simple-list">
                      {activeSubject.infos.map((info, idx) => (
                        <div key={idx} className="simple-list-item">
                           {info.icon}
                           {info.isLink ? (
                             <a href="#" className="link-text">{info.text}</a>
                           ) : (
                             <span>{info.text}</span>
                           )}
                        </div>
                      ))}
                   </div>
                </div>

                <div className="study-col">
                   <h4 className="col-title">Tarefas Pendentes</h4>
                   <div className="simple-list">
                      {activeSubject.tasks.map((t, idx) => (
                        <div key={idx} className="simple-list-item">
                           <Circle size={14} color="#cbd5e1"/>
                           <span>{t}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           </div>
        </div>

        {/* 7. PLANEJAMENTO (BAIXO DIREITA) */}
        <div className="dsh-card area-plans">
           <div className="card-header">
              <h3>Planejamento</h3>
           </div>
           <div className="plans-scroll">
              {plans.map(plan => {
                const isOpen = expandedPlanId === plan.id;
                return (
                  <div key={plan.id} className={`plan-block ${isOpen ? 'open' : ''}`}>
                     <div className="plan-header" onClick={() => togglePlan(plan.id)}>
                        <div className="plan-meta">
                          <strong>{plan.title}</strong>
                          <div className="progress-track"><div className="progress-fill" style={{width: `${plan.progress}%`}}></div></div>
                        </div>
                        {isOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                     </div>
                     {isOpen && (
                       <div className="plan-steps-list">
                          {plan.steps.map(step => (
                            <div key={step.id} className="plan-step-item" onClick={() => toggleStep(plan.id, step.id)}>
                               <div className={`step-check ${step.done ? 'checked' : ''}`}></div>
                               <span>{step.text}</span>
                            </div>
                          ))}
                       </div>
                     )}
                  </div>
                )
              })}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;