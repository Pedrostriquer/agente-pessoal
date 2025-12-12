import React, { useState, useEffect } from 'react';
import './TasksPage.css';
import { 
  Plus, Trash2, CheckCircle2, Circle, 
  Lightbulb, ShoppingCart, ListTodo, 
  Target, ChevronDown, ChevronUp, Layout
} from 'lucide-react';

// Importando os serviços
import { getMarketList, addMarketItem, removeMarketItem } from '../../services/marketService';
import { getIdeasList, addIdea, removeIdea } from '../../services/ideasService';
import { getGoalsList, createGoal, updateGoalProgress, removeGoal } from '../../services/goalsService';
// Importando o serviço de To-Do
import { getTodoList, createTodo, toggleTodoStatus, removeTodo } from '../../services/todoService';

const TasksPage = ({ isSidebarOpen }) => {
  
  const [activeTab, setActiveTab] = useState('todo'); // Começa no To-Do para testar
  const [isLoading, setIsLoading] = useState(false);

  // --- ESTADOS DE DADOS ---
  const [market, setMarket] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [goals, setGoals] = useState([]);
  const [todos, setTodos] = useState([]); // Agora inicia vazio para receber da API

  // --- INPUTS GERAIS ---
  const [inputValue, setInputValue] = useState(''); 
  
  // --- INPUTS DE METAS ---
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalUnit, setNewGoalUnit] = useState('');

  // --- INPUTS DE PROGRESSO (METAS) ---
  const [expandedGoalId, setExpandedGoalId] = useState(null);
  const [progressValue, setProgressValue] = useState('');
  const [progressDesc, setProgressDesc] = useState('');

  // --- FETCH DATA ---
  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'market') {
        const data = await getMarketList();
        setMarket(Array.isArray(data) ? data : data.items || []);
      }
      else if (activeTab === 'idea') {
        const data = await getIdeasList();
        setIdeas(Array.isArray(data) ? data : data.ideas || []);
      }
      else if (activeTab === 'goals') {
        const data = await getGoalsList();
        setGoals(Array.isArray(data) ? data : data.goals || []);
      }
      // Integração do To-Do
      else if (activeTab === 'todo') {
        const data = await getTodoList();
        // Ajuste conforme o retorno do seu backend (array direto ou objeto { todos: [] })
        setTodos(Array.isArray(data) ? data : data.todos || []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLERS DE ADIÇÃO ---
  const handleAdd = async () => {
    if (!inputValue && activeTab !== 'goals') return;

    try {
      if (activeTab === 'market') {
        await addMarketItem(inputValue, 1);
        setInputValue('');
        loadData();
      }
      else if (activeTab === 'idea') {
        await addIdea(inputValue);
        setInputValue('');
        loadData();
      }
      // Integração To-Do
      else if (activeTab === 'todo') {
        const newTodo = await createTodo(inputValue);
        // Atualiza a lista localmente adicionando o novo item no topo
        setTodos([newTodo, ...todos]);
        setInputValue('');
      }
      else if (activeTab === 'goals') {
        if (!newGoalTitle || !newGoalTarget) return alert("Preencha título e meta");
        await createGoal(newGoalTitle, newGoalTarget, newGoalUnit || 'un');
        setNewGoalTitle('');
        setNewGoalTarget('');
        setNewGoalUnit('');
        loadData();
      }
    } catch (error) {
      alert("Erro ao adicionar: " + error.message);
    }
  };

  // --- HANDLERS DE REMOÇÃO ---
  const handleRemove = async (id) => {
    if (!window.confirm("Deseja realmente excluir?")) return;

    try {
      if (activeTab === 'market') {
        await removeMarketItem(id);
        loadData();
      }
      else if (activeTab === 'idea') {
        await removeIdea(id);
        loadData();
      }
      else if (activeTab === 'goals') {
        await removeGoal(id);
        loadData();
      }
      // Integração To-Do
      else if (activeTab === 'todo') {
        await removeTodo(id);
        setTodos(todos.filter(t => (t.id || t._id) !== id));
      }
    } catch (error) {
      console.error("Erro ao remover:", error);
      alert("Erro ao remover item.");
    }
  };

  // --- HANDLER DE TOGGLE (Check/Uncheck) ---
  const handleToggleTodo = async (id, currentStatus) => {
    try {
      // Atualização Otimista (altera na tela antes do backend responder)
      setTodos(prev => prev.map(t => 
        (t.id === id || t._id === id) ? { ...t, done: !currentStatus } : t
      ));
      
      await toggleTodoStatus(id, !currentStatus);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      loadData(); // Recarrega dados reais em caso de erro
    }
  };

  // --- HANDLERS ESPECÍFICOS DE METAS ---
  const handleAddProgress = async (goalName) => {
    if (!progressValue) return;
    try {
      await updateGoalProgress(goalName, progressValue, progressDesc || 'Atualização manual');
      setProgressValue('');
      setProgressDesc('');
      loadData();
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar progresso: " + error.message);
    }
  };

  // --- CONFIGURAÇÃO DAS ABAS ---
  const tabs = [
    { id: 'todo', label: 'To-Do', icon: <ListTodo size={18}/> },
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
          <input className="input-main" placeholder="Título (ex: Carro Novo)" value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)} />
          <input className="input-small" type="number" placeholder="Meta" value={newGoalTarget} onChange={e => setNewGoalTarget(e.target.value)} />
          <input className="input-mini" placeholder="Un (BRL)" value={newGoalUnit} onChange={e => setNewGoalUnit(e.target.value)} />
        </>
      );
    }
    return (
      <input 
        className="input-full"
        placeholder={`Adicionar em ${currentTabInfo.label}...`}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
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
            </button>
          ))}
        </div>

        <div className="big-list-card">
          <div className="big-card-header">
            <div className="icon-badge-lg">{currentTabInfo.icon}</div>
            <div className="header-info">
              <h2>{currentTabInfo.label}</h2>
              <p>{isLoading ? 'Sincronizando...' : 'Atualizado via API'}</p>
            </div>
          </div>

          <div className="big-card-body">
            
            <div className="big-add-row">
              {renderTopInputs()}
              <button className="btn-add-big" onClick={handleAdd} disabled={isLoading}>
                <Plus size={24}/>
              </button>
            </div>

            <div className="big-list-scroll">
              
              {/* === METAS (GOALS) === */}
              {activeTab === 'goals' ? (
                goals.length === 0 && !isLoading ? (
                  <div className="empty-state"><p>Nenhuma meta encontrada.</p></div>
                ) : (
                  goals.map(goal => {
                    const isOpen = expandedGoalId === goal.id || expandedGoalId === goal._id;
                    const goalId = goal.id || goal._id;
                    
                    const title = goal.goal_name || goal.title || 'Sem título';
                    const current = Number(goal.current_progress || goal.current_amount || goal.current || 0);
                    const target = Number(goal.target_amount || goal.target || 1);
                    const unit = goal.metric_unit || goal.unit || 'R$';
                    
                    const percent = Math.min(100, Math.round((current / target) * 100));

                    return (
                      <div key={goalId} className={`goal-card ${isOpen ? 'open' : ''}`}>
                        <div className="goal-header" onClick={() => setExpandedGoalId(isOpen ? null : goalId)}>
                          <div className="goal-info">
                            <div className="goal-title-row">
                              <strong>{title}</strong>
                              <span className="goal-values">{current.toLocaleString()} / {target.toLocaleString()} <small>{unit}</small></span>
                            </div>
                            <div className="progress-track">
                              <div className="progress-fill" style={{width: `${percent}%`}}></div>
                            </div>
                          </div>
                          <div className="goal-arrow">{isOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}</div>
                        </div>

                        {isOpen && (
                          <div className="goal-body">
                            <div className="log-input-row">
                              <div className="input-group">
                                <label>Adicionar Valor</label>
                                <input type="number" placeholder="0.00" value={progressValue} onChange={e => setProgressValue(e.target.value)} />
                              </div>
                              <div className="input-group grow">
                                <label>Descrição</label>
                                <input placeholder="Ex: Economia mensal" value={progressDesc} onChange={e => setProgressDesc(e.target.value)} />
                              </div>
                              <button className="btn-save-log" onClick={() => handleAddProgress(title)}>Salvar</button>
                            </div>
                            
                            <div className="goal-footer">
                               <button className="btn-del-goal" onClick={() => handleRemove(goalId)}>Excluir Meta</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )
              ) : (
                /* === LISTAS PADRÃO (MERCADO, IDEIAS, TODO) === */
                getCurrentList().length === 0 && !isLoading ? (
                  <div className="empty-state">
                    <Layout size={40} color="#cbd5e1"/>
                    <p>Lista vazia.</p>
                  </div>
                ) : (
                  getCurrentList().map(item => {
                    const itemId = item.id || item._id;
                    
                    // Mapeamento dos campos
                    // Mercado: item_name, quantity
                    // Ideia: idea_content
                    // Todo: task, done
                    const text = item.task || item.idea_content || item.item_name || item.text || 'Sem texto';
                    const isDone = item.done || item.checked || false;
                    const quantity = item.quantity || 1;

                    return (
                      <div key={itemId} className={`universal-item ${isDone ? 'done' : ''}`}>
                         
                         {/* Botão de Check - Ativo apenas para To-Do e Mercado se necessário */}
                         <button 
                            className="check-btn" 
                            style={{cursor: activeTab === 'todo' ? 'pointer' : 'default'}}
                            onClick={() => {
                              if (activeTab === 'todo') handleToggleTodo(itemId, isDone);
                            }}
                         >
                            {isDone ? <CheckCircle2 size={22} className="check-icon done"/> : <Circle size={22} className="check-icon"/>}
                         </button>
  
                         <div className="item-content">
                           <span className="item-text">
                              {activeTab === 'market' && (
                                <span style={{color: '#10b981', marginRight: '8px', fontWeight: '800'}}>
                                  {quantity}x
                                </span>
                              )}
                              {text}
                           </span>
                         </div>
                         
                         <button className="btn-remove" onClick={() => handleRemove(itemId)}>
                           <Trash2 size={18}/>
                         </button>
                      </div>
                    )
                  })
                )
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;