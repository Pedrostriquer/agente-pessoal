import React, { useState } from 'react';
import './TasksPage.css';
import { 
  Plus, Trash2, CheckCircle2, Circle, 
  Lightbulb, ShoppingCart, ListTodo, 
  Map, ChevronDown, ChevronUp 
} from 'lucide-react';

const TasksPage = ({ isSidebarOpen }) => {
  
  // --- ESTADOS ---
  
  // 1. To-Do List
  const [todos, setTodos] = useState([
    { id: 1, text: 'Finalizar design do app', desc: 'Falta a tela de perfil', done: false },
    { id: 2, text: 'Enviar relatório mensal', desc: '', done: true },
  ]);
  const [newTodo, setNewTodo] = useState('');

  // 2. Mercado (Agora com estrutura completa)
  const [market, setMarket] = useState([
    { id: 1, text: 'Leite', desc: 'Desnatado', done: false },
    { id: 2, text: 'Café', desc: 'Solúvel', done: true },
    { id: 3, text: 'Sabão em pó', desc: '', done: false },
  ]);
  const [newMarket, setNewMarket] = useState('');

  // 3. Ideias (Agora igual To-Do)
  const [ideas, setIdeas] = useState([
    { id: 1, text: 'App de delivery de ração', desc: 'Pesquisar concorrentes', done: false },
    { id: 2, text: 'Estudar Rust', desc: 'No final de semana', done: false },
  ]);
  const [newIdea, setNewIdea] = useState('');

  // 4. PLANEJAMENTO
  const [plans, setPlans] = useState([
    { 
      id: 1, title: 'Viagem Japão 🇯🇵', progress: 50, 
      // Etapas agora têm descrição também
      steps: [
        { id: 101, text: 'Tirar Visto', desc: 'Agendar consulado', done: true },
        { id: 102, text: 'Juntar dinheiro', desc: 'Meta: R$ 15k', done: false },
      ]
    }
  ]);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [expandedPlanId, setExpandedPlanId] = useState(null);
  
  // Input para adicionar etapa dentro do projeto (Um estado por projeto seria ideal, mas usaremos um genérico limpo ao trocar)
  const [newStepText, setNewStepText] = useState(''); 

  // --- HANDLERS GENÉRICOS ---

  const handleAdd = (type) => {
    const id = Date.now();
    if (type === 'todo' && newTodo) {
      setTodos([...todos, { id, text: newTodo, desc: '', done: false }]);
      setNewTodo('');
    }
    if (type === 'market' && newMarket) {
      setMarket([...market, { id, text: newMarket, desc: '', done: false }]);
      setNewMarket('');
    }
    if (type === 'idea' && newIdea) {
      setIdeas([...ideas, { id, text: newIdea, desc: '', done: false }]);
      setNewIdea('');
    }
    if (type === 'plan' && newPlanTitle) {
      setPlans([...plans, { id, title: newPlanTitle, progress: 0, steps: [] }]);
      setNewPlanTitle('');
    }
  };

  const toggleCheck = (type, id) => {
    if (type === 'todo') setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
    if (type === 'market') setMarket(market.map(m => m.id === id ? { ...m, done: !m.done } : m));
    if (type === 'idea') setIdeas(ideas.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  const remove = (type, id) => {
    if (type === 'todo') setTodos(todos.filter(t => t.id !== id));
    if (type === 'market') setMarket(market.filter(m => m.id !== id));
    if (type === 'idea') setIdeas(ideas.filter(i => i.id !== id));
    if (type === 'plan') setPlans(plans.filter(p => p.id !== id));
  };

  const updateDesc = (type, id, val) => {
    if (type === 'todo') setTodos(todos.map(t => t.id === id ? { ...t, desc: val } : t));
    if (type === 'market') setMarket(market.map(m => m.id === id ? { ...m, desc: val } : m));
    if (type === 'idea') setIdeas(ideas.map(i => i.id === id ? { ...i, desc: val } : i));
  };

  // --- HANDLERS DE PLANEJAMENTO ---

  const togglePlanExpand = (id) => {
    setExpandedPlanId(expandedPlanId === id ? null : id);
    setNewStepText(''); // Limpa input ao trocar
  };

  const addStep = (planId) => {
    if (!newStepText) return;
    setPlans(plans.map(p => {
      if (p.id !== planId) return p;
      const newSteps = [...p.steps, { id: Date.now(), text: newStepText, desc: '', done: false }];
      // Recalcula progresso
      const progress = Math.round((newSteps.filter(s => s.done).length / newSteps.length) * 100);
      return { ...p, steps: newSteps, progress };
    }));
    setNewStepText('');
  };

  const toggleStepCheck = (planId, stepId) => {
    setPlans(plans.map(p => {
      if (p.id !== planId) return p;
      const newSteps = p.steps.map(s => s.id === stepId ? { ...s, done: !s.done } : s);
      const progress = Math.round((newSteps.filter(s => s.done).length / newSteps.length) * 100);
      return { ...p, steps: newSteps, progress };
    }));
  };

  const removeStep = (planId, stepId) => {
    setPlans(plans.map(p => {
      if (p.id !== planId) return p;
      const newSteps = p.steps.filter(s => s.id !== stepId);
      const progress = newSteps.length > 0 ? Math.round((newSteps.filter(s => s.done).length / newSteps.length) * 100) : 0;
      return { ...p, steps: newSteps, progress };
    }));
  };

  const updateStepDesc = (planId, stepId, val) => {
    setPlans(plans.map(p => {
      if (p.id !== planId) return p;
      const newSteps = p.steps.map(s => s.id === stepId ? { ...s, desc: val } : s);
      return { ...p, steps: newSteps };
    }));
  };

  // Componente Reutilizável de Item de Lista
  const ListItem = ({ item, type }) => (
    <div className={`universal-item ${item.done ? 'done' : ''}`}>
      <button className="check-btn" onClick={() => toggleCheck(type, item.id)}>
        {item.done ? <CheckCircle2 size={20} color="#10b981"/> : <Circle size={20} color="#cbd5e1"/>}
      </button>
      <div className="item-content">
        <span className="item-text">{item.text}</span>
        <input 
          className="item-desc-input" 
          placeholder="Adicionar descrição..."
          defaultValue={item.desc}
          onBlur={(e) => updateDesc(type, item.id, e.target.value)}
        />
      </div>
      <button className="btn-remove" onClick={() => remove(type, item.id)}><Trash2 size={16}/></button>
    </div>
  );

  return (
    <div className={`tasks-page-wrapper fade-in ${isSidebarOpen ? 'open' : 'closed'}`}>
      
      <header className="page-header">
        <h1>Central de Listas</h1>
        <p>Gerencie todas as suas tarefas em um só lugar.</p>
      </header>

      <div className="lists-grid-layout">
        
        {/* 1. TO-DO LIST */}
        <div className="list-card">
          <div className="list-header">
            <div className="icon-badge blue"><ListTodo size={20}/></div>
            <h3>To-Do List</h3>
            <span className="count-pill">{todos.filter(t => !t.done).length}</span>
          </div>
          <div className="add-row">
            <input 
              placeholder="Nova tarefa..." 
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd('todo')}
            />
            <button onClick={() => handleAdd('todo')}><Plus size={20}/></button>
          </div>
          <div className="items-list-scroll">
            {todos.map(item => <ListItem key={item.id} item={item} type="todo" />)}
          </div>
        </div>

        {/* 2. MERCADO (IGUAL TO-DO) */}
        <div className="list-card">
          <div className="list-header">
            <div className="icon-badge green"><ShoppingCart size={20}/></div>
            <h3>Mercado</h3>
            <span className="count-pill">{market.filter(t => !t.done).length}</span>
          </div>
          <div className="add-row">
            <input 
              placeholder="Adicionar item..." 
              value={newMarket}
              onChange={e => setNewMarket(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd('market')}
            />
            <button onClick={() => handleAdd('market')}><Plus size={20}/></button>
          </div>
          <div className="items-list-scroll">
            {market.map(item => <ListItem key={item.id} item={item} type="market" />)}
          </div>
        </div>

        {/* 3. IDEIAS (IGUAL TO-DO) */}
        <div className="list-card">
          <div className="list-header">
            <div className="icon-badge yellow"><Lightbulb size={20}/></div>
            <h3>Ideias</h3>
            <span className="count-pill">{ideas.length}</span>
          </div>
          <div className="add-row">
            <input 
              placeholder="Nova ideia..." 
              value={newIdea}
              onChange={e => setNewIdea(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd('idea')}
            />
            <button onClick={() => handleAdd('idea')}><Plus size={20}/></button>
          </div>
          <div className="items-list-scroll">
            {ideas.map(item => <ListItem key={item.id} item={item} type="idea" />)}
          </div>
        </div>

        {/* 4. PLANEJAMENTO (ESTRUTURA INTERNA IGUAL TO-DO) */}
        <div className="list-card">
          <div className="list-header">
            <div className="icon-badge purple"><Map size={20}/></div>
            <h3>Planejamento</h3>
            <span className="count-pill">{plans.length}</span>
          </div>
          
          {/* Adicionar Projeto */}
          <div className="add-row">
            <input 
              placeholder="Novo Projeto..." 
              value={newPlanTitle}
              onChange={e => setNewPlanTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd('plan')}
            />
            <button onClick={() => handleAdd('plan')}><Plus size={20}/></button>
          </div>

          <div className="items-list-scroll">
            {plans.map(plan => {
              const isOpen = expandedPlanId === plan.id;
              return (
                <div key={plan.id} className={`plan-card-item ${isOpen ? 'open' : ''}`}>
                  <div className="plan-header-row" onClick={() => togglePlanExpand(plan.id)}>
                    <div className="plan-info">
                      <strong>{plan.title}</strong>
                      <div className="progress-mini">
                        <div className="bar" style={{width: `${plan.progress}%`}}></div>
                      </div>
                    </div>
                    <div className="plan-arrow">
                       {isOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="plan-body-expanded">
                      
                      {/* INPUT DE ADICIONAR ETAPA (IGUAL AO TO-DO) */}
                      <div className="add-row small">
                        <input 
                          placeholder="Adicionar etapa..." 
                          value={newStepText}
                          onChange={e => setNewStepText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && addStep(plan.id)}
                        />
                        <button onClick={() => addStep(plan.id)}><Plus size={16}/></button>
                      </div>

                      {/* LISTA DE ETAPAS (ESTILO TO-DO) */}
                      <div className="plan-steps-list">
                        {plan.steps.map(step => (
                          <div key={step.id} className={`universal-item ${step.done ? 'done' : ''}`}>
                            <button className="check-btn" onClick={() => toggleStepCheck(plan.id, step.id)}>
                              {step.done ? <CheckCircle2 size={18} color="#10b981"/> : <Circle size={18} color="#cbd5e1"/>}
                            </button>
                            <div className="item-content">
                              <span className="item-text">{step.text}</span>
                              <input 
                                className="item-desc-input" 
                                placeholder="Descrição..."
                                defaultValue={step.desc}
                                onBlur={(e) => updateStepDesc(plan.id, step.id, e.target.value)}
                              />
                            </div>
                            <button className="btn-remove" onClick={() => removeStep(plan.id, step.id)}>
                              <Trash2 size={14}/>
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="plan-footer">
                         <button className="btn-del-plan" onClick={() => remove('plan', plan.id)}>Excluir Projeto</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TasksPage;