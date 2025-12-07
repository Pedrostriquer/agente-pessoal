import React, { useState } from 'react';
import './TasksPage.css';
import { 
  Plus, Trash2, CheckCircle2, Circle, 
  Lightbulb, ShoppingCart, ListTodo, 
  Target, ChevronDown, ChevronUp, Layout, Calendar
} from 'lucide-react';

// Componente Item (Mantido)
const ListItem = ({ item, toggleCheck, updateDesc, remove }) => (
  <div className={`universal-item ${item.done ? 'done' : ''}`}>
    <button className="check-btn" onClick={() => toggleCheck(item.id)}>
      {item.done ? <CheckCircle2 size={22} className="check-icon done"/> : <Circle size={22} className="check-icon"/>}
    </button>
    <div className="item-content">
      <span className="item-text">{item.text}</span>
      <input 
        className="item-desc-input" 
        placeholder="Adicionar descrição..."
        value={item.desc}
        onChange={(e) => updateDesc(item.id, e.target.value)}
      />
    </div>
    <button className="btn-remove" onClick={() => remove(item.id)}><Trash2 size={18}/></button>
  </div>
);

const TasksPage = ({ isSidebarOpen }) => {
  
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState('todo'); 

  // Listas Padrão
  const [todos, setTodos] = useState([
    { id: 1, text: 'Finalizar design do app', desc: 'Falta a tela de perfil', done: false },
  ]);
  const [market, setMarket] = useState([
    { id: 1, text: 'Leite', desc: 'Desnatado', done: false },
  ]);
  const [ideas, setIdeas] = useState([
    { id: 1, text: 'Estudar Rust', desc: 'No final de semana', done: false },
  ]);

  // Inputs Padrão
  const [newTodo, setNewTodo] = useState('');
  const [newMarket, setNewMarket] = useState('');
  const [newIdea, setNewIdea] = useState('');

  // --- METAS (GOALS) COM DESCRIÇÃO ---
  const [goals, setGoals] = useState([
    { 
      id: 1, 
      title: 'Emagrecer 10kg', 
      desc: 'Prazo final: Dezembro/2025', // Nova propriedade
      target: 10, 
      current: 2.5, 
      unit: 'kg',
      logs: [
        { id: 101, value: 1.5, date: '01/10', desc: 'Começo da dieta' },
      ]
    },
    { 
      id: 2, 
      title: 'Juntar R$ 6.000', 
      desc: 'Para a viagem do Japão', // Nova propriedade
      target: 6000, 
      current: 1500, 
      unit: 'R$',
      logs: [
        { id: 201, value: 1500, date: '05/12', desc: '13º Salário' },
      ]
    }
  ]);

  // Inputs para criar nova meta
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalUnit, setNewGoalUnit] = useState('');

  // Inputs para registrar progresso
  const [expandedGoalId, setExpandedGoalId] = useState(null);
  const [progressValue, setProgressValue] = useState('');
  const [progressDesc, setProgressDesc] = useState('');

  // --- HANDLERS ---

  const handleAdd = () => {
    const id = Date.now();
    if (activeTab === 'todo' && newTodo) {
      setTodos([...todos, { id, text: newTodo, desc: '', done: false }]);
      setNewTodo('');
    }
    if (activeTab === 'market' && newMarket) {
      setMarket([...market, { id, text: newMarket, desc: '', done: false }]);
      setNewMarket('');
    }
    if (activeTab === 'idea' && newIdea) {
      setIdeas([...ideas, { id, text: newIdea, desc: '', done: false }]);
      setNewIdea('');
    }
    // Adicionar Meta
    if (activeTab === 'goals' && newGoalTitle && newGoalTarget) {
      setGoals([...goals, { 
        id, 
        title: newGoalTitle, 
        desc: '', // Começa vazio
        target: parseFloat(newGoalTarget), 
        current: 0, 
        unit: newGoalUnit || 'un',
        logs: [] 
      }]);
      setNewGoalTitle('');
      setNewGoalTarget('');
      setNewGoalUnit('');
    }
  };

  const toggleCheck = (id) => {
    if (activeTab === 'todo') setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
    if (activeTab === 'market') setMarket(market.map(m => m.id === id ? { ...m, done: !m.done } : m));
    if (activeTab === 'idea') setIdeas(ideas.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  const remove = (id) => {
    if (activeTab === 'todo') setTodos(todos.filter(t => t.id !== id));
    if (activeTab === 'market') setMarket(market.filter(m => m.id !== id));
    if (activeTab === 'idea') setIdeas(ideas.filter(i => i.id !== id));
    if (activeTab === 'goals') setGoals(goals.filter(g => g.id !== id));
  };

  const updateDesc = (id, val) => {
    if (activeTab === 'todo') setTodos(todos.map(t => t.id === id ? { ...t, desc: val } : t));
    if (activeTab === 'market') setMarket(market.map(m => m.id === id ? { ...m, desc: val } : m));
    if (activeTab === 'idea') setIdeas(ideas.map(i => i.id === id ? { ...i, desc: val } : i));
  };

  // --- HANDLERS DE METAS (GOALS) ---

  // Nova função para atualizar a descrição da Meta
  const updateGoalDesc = (id, val) => {
    setGoals(goals.map(g => g.id === id ? { ...g, desc: val } : g));
  };

  const toggleGoalExpand = (id) => {
    setExpandedGoalId(expandedGoalId === id ? null : id);
    setProgressValue('');
    setProgressDesc('');
  };

  const addProgress = (goalId) => {
    if (!progressValue) return;
    const val = parseFloat(progressValue);
    if (isNaN(val)) return;

    setGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      
      const newLog = {
        id: Date.now(),
        value: val,
        date: new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}),
        desc: progressDesc || 'Progresso registrado'
      };

      return {
        ...g,
        current: g.current + val,
        logs: [newLog, ...g.logs]
      };
    }));

    setProgressValue('');
    setProgressDesc('');
  };

  const removeLog = (goalId, logId) => {
    setGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      const logToRemove = g.logs.find(l => l.id === logId);
      if (!logToRemove) return g;

      return {
        ...g,
        current: g.current - logToRemove.value,
        logs: g.logs.filter(l => l.id !== logId)
      };
    }));
  };

  // --- CONFIGURAÇÃO DAS ABAS ---
  const tabs = [
    { id: 'todo', label: 'To-Do List', icon: <ListTodo size={18}/> },
    { id: 'market', label: 'Mercado', icon: <ShoppingCart size={18}/> },
    { id: 'idea', label: 'Ideias', icon: <Lightbulb size={18}/> },
    { id: 'goals', label: 'Metas', icon: <Target size={18}/> },
  ];

  const currentTabInfo = tabs.find(t => t.id === activeTab);

  const getCurrentList = () => {
    if (activeTab === 'todo') return todos;
    if (activeTab === 'market') return market;
    if (activeTab === 'idea') return ideas;
    return [];
  };

  const renderTopInputs = () => {
    if (activeTab === 'goals') {
      return (
        <>
          <input 
            className="input-main"
            placeholder="Título (ex: Juntar dinheiro)"
            value={newGoalTitle}
            onChange={e => setNewGoalTitle(e.target.value)}
          />
          <input 
            className="input-small"
            type="number"
            placeholder="Meta (ex: 6000)"
            value={newGoalTarget}
            onChange={e => setNewGoalTarget(e.target.value)}
          />
          <input 
            className="input-mini"
            placeholder="Un (kg)"
            value={newGoalUnit}
            onChange={e => setNewGoalUnit(e.target.value)}
          />
        </>
      );
    }
    
    const val = activeTab === 'todo' ? newTodo : activeTab === 'market' ? newMarket : newIdea;
    const setVal = activeTab === 'todo' ? setNewTodo : activeTab === 'market' ? setNewMarket : setNewIdea;
    const ph = activeTab === 'todo' ? 'Nova tarefa...' : activeTab === 'market' ? 'Item do mercado...' : 'Nova ideia...';
    
    return (
      <input 
        className="input-full"
        placeholder={ph}
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
      />
    );
  };

  return (
    <div className={`tasks-page-wrapper fade-in ${isSidebarOpen ? 'open' : 'closed'}`}>
      
      <header className="page-header center-text">
        <h1>Minhas Listas</h1>
        <p>Gerencie tarefas, compras, ideias e seus objetivos de vida.</p>
      </header>

      <div className="tasks-central-container">
        <div className="tabs-navigation">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id !== 'goals' && (
                <span className="tab-badge">
                  {tab.id === 'todo' ? todos.filter(t=>!t.done).length : 
                   tab.id === 'market' ? market.filter(t=>!t.done).length : ideas.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="big-list-card">
          <div className="big-card-header">
            <div className="icon-badge-lg">
              {currentTabInfo.icon}
            </div>
            <div className="header-info">
              <h2>{currentTabInfo.label}</h2>
              <p>
                {activeTab === 'goals' 
                  ? `${goals.length} Metas em andamento` 
                  : `${getCurrentList().filter(i => !i.done).length} Pendentes`}
              </p>
            </div>
          </div>

          <div className="big-card-body">
            <div className="big-add-row">
              {renderTopInputs()}
              <button className="btn-add-big" onClick={handleAdd}>
                <Plus size={24}/>
              </button>
            </div>

            <div className="big-list-scroll">
              
              {/* CASO: METAS (GOALS) */}
              {activeTab === 'goals' ? (
                goals.map(goal => {
                  const isOpen = expandedGoalId === goal.id;
                  const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                  
                  return (
                    <div key={goal.id} className={`goal-card ${isOpen ? 'open' : ''}`}>
                      {/* Cabeçalho da Meta */}
                      <div className="goal-header" onClick={() => toggleGoalExpand(goal.id)}>
                        <div className="goal-info">
                          <div className="goal-title-row">
                            <strong>{goal.title}</strong>
                            <span className="goal-values">
                              {goal.current} / {goal.target} <small>{goal.unit}</small>
                            </span>
                          </div>
                          <div className="progress-track">
                            <div className="progress-fill" style={{width: `${percent}%`}}></div>
                          </div>
                        </div>
                        <div className="goal-arrow">
                          {isOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                        </div>
                      </div>

                      {/* Corpo Expandido */}
                      {isOpen && (
                        <div className="goal-body">
                          
                          {/* CAMPO DE DESCRIÇÃO/DATA DA META */}
                          <div className="goal-desc-block">
                             <Calendar size={14} className="desc-icon"/>
                             <input 
                               className="goal-desc-input"
                               placeholder="Adicionar prazo ou detalhes..."
                               value={goal.desc}
                               onChange={(e) => updateGoalDesc(goal.id, e.target.value)}
                             />
                          </div>

                          {/* Inputs de Progresso */}
                          <div className="log-input-row">
                            <div className="input-group">
                              <label>Quanto avançou?</label>
                              <input 
                                type="number"
                                placeholder="0.0"
                                value={progressValue}
                                onChange={e => setProgressValue(e.target.value)}
                              />
                            </div>
                            <div className="input-group grow">
                              <label>Nota (Opcional)</label>
                              <input 
                                type="text"
                                placeholder="Ex: Hoje foi pago..."
                                value={progressDesc}
                                onChange={e => setProgressDesc(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addProgress(goal.id)}
                              />
                            </div>
                            <button className="btn-save-log" onClick={() => addProgress(goal.id)}>
                              Registrar
                            </button>
                          </div>

                          <div className="logs-list">
                            <h4 className="logs-title">Histórico</h4>
                            {goal.logs.length === 0 && <p className="no-logs">Nenhum registro ainda.</p>}
                            
                            {goal.logs.map(log => (
                              <div key={log.id} className="log-item">
                                <div className="log-left">
                                  <span className="log-val">+{log.value} {goal.unit}</span>
                                  <span className="log-desc">{log.desc}</span>
                                </div>
                                <div className="log-right">
                                  <span className="log-date">{log.date}</span>
                                  <button className="btn-del-log" onClick={() => removeLog(goal.id, log.id)}>
                                    <Trash2 size={14}/>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="goal-footer">
                             <button className="btn-del-goal" onClick={() => remove(goal.id)}>Excluir Meta</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                /* OUTRAS LISTAS */
                getCurrentList().map(item => (
                  <ListItem 
                    key={item.id} 
                    item={item}
                    toggleCheck={toggleCheck}
                    updateDesc={updateDesc}
                    remove={remove}
                  />
                ))
              )}

              {((activeTab !== 'goals' && getCurrentList().length === 0) || (activeTab === 'goals' && goals.length === 0)) && (
                 <div className="empty-state">
                    <Layout size={40} color="#cbd5e1"/>
                    <p>Tudo limpo por aqui.</p>
                 </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TasksPage;