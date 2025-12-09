import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { 
  Plus, Trash2, CheckCircle2, Circle, Calendar as CalendarIcon, 
  TrendingUp, TrendingDown, Menu, Wallet, ShoppingCart, Lightbulb, 
  BookOpen, Clock, MapPin, AlertCircle, ArrowRight
} from 'lucide-react';

// Importando Serviços
import { getFinanceReport, getTransactionsList } from '../../services/financeService';
import { getMarketList, addMarketItem, removeMarketItem } from '../../services/marketService';
import { getIdeasList, addIdea, removeIdea } from '../../services/ideasService';
import { getGoalsList } from '../../services/goalsService';
import { getCalendarEvents } from '../../services/calendarService';
import { getTodoList, createTodo, toggleTodoStatus, removeTodo } from '../../services/todoService';

const Dashboard = ({ toggleSidebar, isSidebarOpen }) => {
  
  // --- ESTADOS DINÂMICOS ---
  const [financeData, setFinanceData] = useState({ 
    balance: 0, 
    income: 0, 
    expense: 0,
    monthlyGoal: { limit: 0, spent: 0, percent: 0 } // Agora reflete limite_estipulado/gastos
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  const [marketList, setMarketList] = useState([]);
  const [ideasList, setIdeasList] = useState([]);
  const [goalsList, setGoalsList] = useState([]);
  const [agendaEvents, setAgendaEvents] = useState([]);
  const [todoList, setTodoList] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);

  // --- ESTADOS DE INTERFACE ---
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  
  // Inputs
  const [newMarketItem, setNewMarketItem] = useState('');
  const [newIdeaItem, setNewIdeaItem] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // --- MOCKS ---
  const [subjects] = useState([
    { 
      id: 1, name: 'Cálculo II', 
      infos: [ { icon: <Clock size={14}/>, text: 'Seg/Qua 19:00' }, { icon: <MapPin size={14}/>, text: 'Sala 304' } ],
      tasks: ['Lista 04', 'Revisar Integrais']
    },
    { 
      id: 2, name: 'Eng. Software', 
      infos: [ { icon: <Clock size={14}/>, text: 'Ter/Qui 21:00' }, { icon: <MapPin size={14}/>, text: 'Lab 02' } ],
      tasks: ['Diagrama de Classes']
    }
  ]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(1);
  const activeSubject = subjects.find(s => s.id === selectedSubjectId);
  const [expandedGoalId, setExpandedGoalId] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Executa todas as requisições em paralelo
      const [finReport, finTrans, mktData, ideaData, goalsData, calendarData, todoData] = await Promise.all([
        getFinanceReport(),
        getTransactionsList(3),
        getMarketList(),
        getIdeasList(),
        getGoalsList(),
        getCalendarEvents(),
        getTodoList()
      ]);

      // 1. Processar Finanças
      const resumo = finReport.resumo_mes || {};
      const config = finReport.config || {};
      const meta = finReport.meta || {};

      setFinanceData({
        balance: Number(finReport.saldo_atual_conta || 0),
        income: Number(resumo.ganhos || 0),
        expense: Number(resumo.gastos || 0),
        monthlyGoal: {
          // Utilizando limite_estipulado e gastos, conforme solicitado
          limit: Number(config.limite_estipulado || 0), 
          spent: Number(resumo.gastos || 0),           
          percent: Number(meta.percentual_gasto || 0) // Mantendo o cálculo de percentual do backend
        }
      });

      // 2. Processar Transações
      setRecentTransactions(finTrans.map((t, i) => ({
        ...t,
        id: t.id || `tr-${i}`,
        amount: Number(t.amount)
      })));
      
      // 3. Outros Dados
      setMarketList(Array.isArray(mktData) ? mktData : mktData.items || []);
      setIdeasList(Array.isArray(ideaData) ? ideaData : ideaData.ideas || []);
      setGoalsList(Array.isArray(goalsData) ? goalsData : goalsData.goals || []); 
      setAgendaEvents(Array.isArray(calendarData) ? calendarData : calendarData.events || []);
      setTodoList(Array.isArray(todoData) ? todoData : []);

    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLERS (Mantidos iguais) ---
  const handleAddMarket = async () => {
    if (!newMarketItem) return;
    try {
      await addMarketItem(newMarketItem, 1);
      setNewMarketItem('');
      const data = await getMarketList();
      setMarketList(Array.isArray(data) ? data : data.items || []);
    } catch (e) {}
  };

  const handleRemoveMarket = async (id) => {
    try { await removeMarketItem(id); setMarketList(prev => prev.filter(i => (i.id || i._id) !== id)); } catch (e) {}
  };

  const handleAddIdea = async () => {
    if (!newIdeaItem) return;
    try {
      await addIdea(newIdeaItem);
      setNewIdeaItem('');
      const data = await getIdeasList();
      setIdeasList(Array.isArray(data) ? data : data.ideas || []);
    } catch (e) {}
  };

  const handleRemoveIdea = async (id) => {
    try { await removeIdea(id); setIdeasList(prev => prev.filter(i => (i.id || i._id) !== id)); } catch (e) {}
  };

  const handleAddTask = async () => {
    if(!newTaskTitle) return;
    try {
      const newTask = await createTodo(newTaskTitle);
      setTodoList([newTask, ...todoList]);
      setNewTaskTitle('');
    } catch (e) {}
  };

  const handleToggleTask = async (id, currentStatus) => {
    try {
      setTodoList(prev => prev.map(t => t.id === id ? {...t, done: !currentStatus} : t));
      await toggleTodoStatus(id, !currentStatus);
    } catch (e) {
      setTodoList(prev => prev.map(t => t.id === id ? {...t, done: currentStatus} : t));
    }
  };

  const handleDeleteTask = async (e, id) => {
    e.stopPropagation();
    try {
      await removeTodo(id);
      setTodoList(prev => prev.filter(t => t.id !== id));
    } catch (e) {}
  }

  const toggleGoal = (id) => setExpandedGoalId(expandedGoalId === id ? null : id);

  // --- HELPERS ---
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  const daysArray = Array.from({length: getDaysInMonth(currentYear, currentMonth)}, (_, i) => i + 1);

  const selectedEvents = agendaEvents.filter(evt => {
    const d = new Date(evt.start);
    return d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth();
  });

  const monthEventsCount = agendaEvents.filter(evt => {
    const d = new Date(evt.start);
    return d.getMonth() === currentMonth;
  }).length;

  const hasEventOnDay = (day) => agendaEvents.some(evt => {
    const d = new Date(evt.start);
    return d.getDate() === day && d.getMonth() === currentMonth;
  });

  const formatTime = (iso) => iso ? new Date(iso).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) : '--:--';
  const formatMoney = (val) => Number(val).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

  // --- SKELETON ---
  const LoadingCard = () => <div className="skeleton-wrapper"><div className="skeleton-header"/><div className="skeleton-body"/></div>;

  return (
    <div className={`dsh-wrapper fade-in ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      
      <header className="dsh-header">
        <div className="header-left">
          <button className="menu-btn-mobile" onClick={toggleSidebar}><Menu size={24}/></button>
          <div>
            <h1>Dashboard</h1>
            <p>Visão geral do sistema.</p>
          </div>
        </div>
        <div className="dsh-date">
          <CalendarIcon size={16} /> {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </header>

      <div className="dsh-grid-container">

        {/* 1. AGENDA */}
        <div className="dsh-card area-agenda">
          <div className="card-header"><h3><CalendarIcon size={16}/> Agenda</h3></div>
          {isLoading ? <LoadingCard /> : (
            <div className="agenda-layout">
              <div className="calendar-grid-wrapper">
                <div className="month-label-row">
                  <span className="month-name">{selectedDate.toLocaleDateString('pt-BR', {month:'long'})}</span>
                  <span className="month-count-badge">{monthEventsCount} evts</span>
                </div>
                <div className="days-grid">
                  {daysArray.map(day => (
                    <div key={day} 
                      className={`cal-day-cell ${selectedDate.getDate()===day?'active':''} ${hasEventOnDay(day)?'has-event':''}`}
                      onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                    >
                      {day}
                      {hasEventOnDay(day) && <div className="event-dot"></div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="day-events-list">
                <h4 className="day-title-sticky">Dia {selectedDate.getDate()} <span className="day-count-small">({selectedEvents.length})</span></h4>
                <div className="events-scroll">
                  {selectedEvents.length === 0 ? <p className="no-events-text">Livre</p> : selectedEvents.map((evt, i) => (
                    <div key={i} className="agenda-row compact">
                      <div className="time-col">{formatTime(evt.start)}</div>
                      <div className="info-col">{evt.summary}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. FINANÇAS (INTEGRADO) */}
        <div className="dsh-card area-finance">
           <div className="card-header">
             <h3><Wallet size={16} color="#10b981"/> Finanças</h3>
           </div>
           {isLoading ? <LoadingCard /> : (
             <div className="fin-content">
                {/* Saldo Principal */}
                <div className="fin-big-val">
                  <small>Saldo Disponível</small>
                  <h2 style={{color: financeData.balance < 0 ? '#ef4444' : '#10b981'}}>{formatMoney(financeData.balance)}</h2>
                </div>

                {/* Meta Mensal (Mini Barra) */}
                <div className="fin-mini-goal">
                   <div style={{display:'flex', justifyContent:'space-between', fontSize:'10px', color:'#64748b', marginBottom:'4px'}}>
                      <span>Gasto: {formatMoney(financeData.monthlyGoal.spent)} / Limite: {formatMoney(financeData.monthlyGoal.limit)}</span>
                      <span>{financeData.monthlyGoal.percent.toFixed(0)}%</span>
                   </div>
                   <div className="progress-track" style={{height:'6px'}}>
                      <div className="progress-fill" style={{
                        width: `${Math.min(financeData.monthlyGoal.percent, 100)}%`,
                        background: financeData.monthlyGoal.percent > 90 ? '#ef4444' : '#3b82f6'
                      }}></div>
                   </div>
                </div>

                {/* Lista de Transações Recentes */}
                <div className="fin-mini-list">
                   {recentTransactions.length === 0 ? (
                     <p className="empty-text-small">Sem movimentos recentes</p>
                   ) : (
                     recentTransactions.map((t, idx) => (
                       <div key={t.id} className="mini-trans">
                          {t.type === 'income' ? 
                            <TrendingUp size={14} color="#10b981"/> : 
                            <TrendingDown size={14} color="#ef4444"/>
                          }
                          <span className="t-desc">{t.description || t.category}</span>
                          <span className={`t-val ${t.type}`}>{t.type === 'income' ? '+' : '-'} {Number(t.amount).toLocaleString('pt-BR', {minimumFractionDigits:0})}</span>
                       </div>
                     ))
                   )}
                </div>
             </div>
           )}
        </div>

        {/* 3. TO-DO LIST */}
        <div className="dsh-card area-todo">
          <div className="card-header">
            <h3>Tarefas</h3>
            <span className="badge">{todoList.filter(t => !t.done).length}</span>
          </div>
          <div className="input-row-clean">
             <input placeholder="Nova tarefa..." value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} onKeyDown={e => e.key==='Enter' && handleAddTask()}/>
             <button onClick={handleAddTask}><Plus size={18}/></button>
          </div>
          <div className="list-scroll">
             {todoList.map(task => (
               <div key={task.id} className="item-row" onClick={() => handleToggleTask(task.id, task.done)}>
                  <div className={`check-circle ${task.done ? 'checked' : ''}`}>{task.done && <CheckCircle2 size={16} color="white"/>}</div>
                  <span className={task.done ? 'risked' : ''} style={{flex:1}}>{task.task}</span>
                  <button className="icon-btn-small" onClick={(e) => handleDeleteTask(e, task.id)}><Trash2 size={14}/></button>
               </div>
             ))}
          </div>
        </div>

        {/* 4. MERCADO */}
        <div className="dsh-card area-market">
          <div className="card-header"><h3><ShoppingCart size={16} color="#10b981"/> Mercado</h3></div>
          <div className="input-row-clean">
             <input placeholder="Item..." value={newMarketItem} onChange={e => setNewMarketItem(e.target.value)} onKeyDown={e => e.key==='Enter' && handleAddMarket()}/>
             <button onClick={handleAddMarket}><Plus size={18}/></button>
          </div>
          <div className="list-scroll">
             {marketList.map((item, idx) => (
               <div key={item.id || idx} className="item-row">
                  <div className={`checkbox-sq ${item.checked?'checked':''}`}>{item.checked && <CheckCircle2 size={14} color="white"/>}</div>
                  <span style={{flex:1}}><b>{item.quantity}x</b> {item.item_name}</span>
                  <button className="icon-btn-small" onClick={() => handleRemoveMarket(item.id)}><Trash2 size={14}/></button>
               </div>
             ))}
          </div>
        </div>

        {/* 5. IDEIAS */}
        <div className="dsh-card area-ideas">
           <div className="card-header"><h3><Lightbulb size={16} color="#f59e0b"/> Ideias</h3></div>
           <div className="input-row-clean">
             <input placeholder="Ideia..." value={newIdeaItem} onChange={e => setNewIdeaItem(e.target.value)} onKeyDown={e => e.key==='Enter' && handleAddIdea()}/>
             <button onClick={handleAddIdea}><Plus size={18}/></button>
          </div>
           <div className="list-scroll">
             {ideasList.map((idea, idx) => (
               <div key={idea.id||idx} className="idea-row-simple">
                 <span>{idea.idea_content}</span>
                 <button className="icon-btn-small" onClick={() => handleRemoveIdea(idea.id)}><Trash2 size={14}/></button>
               </div>
             ))}
          </div>
        </div>

        {/* 6. ESTUDOS (MOCK) */}
        <div className="dsh-card area-study">
           <div className="card-header"><h3><BookOpen size={16}/> Estudos</h3></div>
           <div className="study-container">
             <div className="study-tabs">
               {subjects.map(sub => (
                 <button key={sub.id} className={`tab-btn ${selectedSubjectId===sub.id?'active':''}`} onClick={() => setSelectedSubjectId(sub.id)}>{sub.name}</button>
               ))}
             </div>
             <div className="study-content-cols">
                <div className="study-col">
                   <h4 className="col-title">Infos</h4>
                   <div className="simple-list">{activeSubject.infos.map((info, i) => <div key={i} className="simple-list-item">{info.icon} <span>{info.text}</span></div>)}</div>
                </div>
                <div className="study-col">
                   <h4 className="col-title">Tarefas</h4>
                   <div className="simple-list">{activeSubject.tasks.map((t, i) => <div key={i} className="simple-list-item"><Circle size={14}/> <span>{t}</span></div>)}</div>
                </div>
             </div>
           </div>
        </div>

        {/* 7. METAS FINANCEIRAS */}
        <div className="dsh-card area-plans">
           <div className="card-header"><h3>Metas</h3></div>
           <div className="plans-scroll">
              {goalsList.length === 0 ? <p className="empty-text-small">Sem metas.</p> : goalsList.map(goal => {
                const current = Number(goal.current_progress||0);
                const target = Number(goal.target_amount||1);
                const percent = Math.min(100, Math.round((current/target)*100));
                return (
                  <div key={goal.id} className="plan-block">
                     <div className="plan-header" onClick={() => toggleGoal(goal.id)}>
                        <div style={{width:'100%'}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px',fontSize:'12px'}}>
                              <strong>{goal.goal_name}</strong>
                              <span style={{color:'#10b981'}}>{percent}%</span>
                          </div>
                          <div className="progress-track"><div className="progress-fill" style={{width:`${percent}%`}}></div></div>
                        </div>
                     </div>
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