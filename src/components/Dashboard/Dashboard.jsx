import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { 
  Plus, Trash2, CheckCircle2, Circle, Calendar as CalendarIcon, 
  TrendingUp, TrendingDown, ChevronDown, ChevronUp,
  DownloadCloud, Edit3, ShoppingCart, Clock, Wallet, MapPin, 
  BookOpen, AlertCircle, Lightbulb, Menu, X
} from 'lucide-react';

// Importando Serviços
import { getFinanceReport } from '../../services/financeService';
import { getMarketList, addMarketItem, removeMarketItem } from '../../services/marketService';
import { getIdeasList, addIdea, removeIdea } from '../../services/ideasService';
import { getGoalsList } from '../../services/goalsService';
import { getCalendarEvents } from '../../services/calendarService';

const Dashboard = ({ toggleSidebar, isSidebarOpen }) => {
  
  // --- ESTADOS DINÂMICOS (API) ---
  const [financeSummary, setFinanceSummary] = useState({ balance: 0 });
  const [marketList, setMarketList] = useState([]);
  const [ideasList, setIdeasList] = useState([]);
  const [goalsList, setGoalsList] = useState([]);
  const [agendaEvents, setAgendaEvents] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);

  // --- ESTADOS DE INTERFACE ---
  const [selectedDate, setSelectedDate] = useState(new Date()); // Objeto Date real
  
  // Inputs para Adicionar Rápido
  const [newMarketItem, setNewMarketItem] = useState('');
  const [newIdeaItem, setNewIdeaItem] = useState('');

  // --- ESTADOS ESTÁTICOS ---
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Finalizar Protótipo', done: false },
    { id: 2, title: 'Pagar Internet', done: true },
    { id: 3, title: 'Agendar Médico', done: false },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const [subjects] = useState([
    { 
      id: 1, name: 'Cálculo II', grade: '4.5', 
      infos: [
        { icon: <Clock size={14}/>, text: 'Seg/Qua 19:00' },
        { icon: <MapPin size={14}/>, text: 'Sala 304 - B' },
        { icon: <AlertCircle size={14}/>, text: 'Prova: 12/12' },
      ],
      tasks: ['Lista 04', 'Revisar Integrais']
    },
    { 
      id: 2, name: 'Eng. Software', grade: '9.0', 
      infos: [
        { icon: <Clock size={14}/>, text: 'Ter/Qui 21:00' },
        { icon: <MapPin size={14}/>, text: 'Lab 02' },
      ],
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
      const [finData, mktData, ideaData, goalsData, calendarData] = await Promise.all([
        getFinanceReport(),
        getMarketList(),
        getIdeasList(),
        getGoalsList(),
        getCalendarEvents()
      ]);

      setFinanceSummary({ balance: finData.saldo_atual_conta || 0 });
      setMarketList(Array.isArray(mktData) ? mktData : mktData.items || []);
      setIdeasList(Array.isArray(ideaData) ? ideaData : ideaData.ideas || []);
      setGoalsList(Array.isArray(goalsData) ? goalsData : goalsData.goals || []);
      setAgendaEvents(Array.isArray(calendarData) ? calendarData : calendarData.events || []);

    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLERS (Mercado e Ideias) ---
  const handleAddMarket = async () => {
    if (!newMarketItem) return;
    try {
      await addMarketItem(newMarketItem, 1);
      setNewMarketItem('');
      const data = await getMarketList();
      setMarketList(Array.isArray(data) ? data : data.items || []);
    } catch (e) { alert('Erro ao adicionar'); }
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
    } catch (e) { alert('Erro ao adicionar'); }
  };

  const handleRemoveIdea = async (id) => {
    try { await removeIdea(id); setIdeasList(prev => prev.filter(i => (i.id || i._id) !== id)); } catch (e) {}
  };

  // Handlers Estáticos
  const addTask = () => {
    if(!newTaskTitle) return;
    setTasks([...tasks, {id: Date.now(), title: newTaskTitle, done: false}]);
    setNewTaskTitle('');
  };
  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? {...t, done: !t.done} : t));
  const toggleGoal = (id) => setExpandedGoalId(expandedGoalId === id ? null : id);

  // --- LOGICA DO CALENDARIO ---
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  const daysCount = getDaysInMonth(currentYear, currentMonth);
  const daysArray = Array.from({length: daysCount}, (_, i) => i + 1);

  // Filtra eventos do dia SELECIONADO
  const selectedEvents = agendaEvents.filter(evt => {
    const evtDate = new Date(evt.start);
    return evtDate.getDate() === selectedDate.getDate() &&
           evtDate.getMonth() === selectedDate.getMonth() &&
           evtDate.getFullYear() === selectedDate.getFullYear();
  });

  // Filtra eventos do MÊS ATUAL
  const monthEventsCount = agendaEvents.filter(evt => {
    const evtDate = new Date(evt.start);
    return evtDate.getMonth() === currentMonth && evtDate.getFullYear() === currentYear;
  }).length;

  // Verifica se um dia específico tem eventos (para as bolinhas)
  const hasEventOnDay = (day) => {
    return agendaEvents.some(evt => {
      const evtDate = new Date(evt.start);
      return evtDate.getDate() === day && 
             evtDate.getMonth() === currentMonth && 
             evtDate.getFullYear() === currentYear;
    });
  };

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (val) => Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // --- COMPONENTE LOADING (Skeleton) ---
  const SkeletonLine = () => <div className="skeleton-line"></div>;
  const LoadingCard = () => (
    <div className="skeleton-wrapper">
      <div className="skeleton-header"></div>
      <div className="skeleton-body"></div>
      <div className="skeleton-body"></div>
    </div>
  );

  return (
    <div className={`dsh-wrapper fade-in ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      
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
          <CalendarIcon size={16} /> {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </header>

      <div className="dsh-grid-container">

        {/* 1. AGENDA (Atualizada) */}
        <div className="dsh-card area-agenda">
          <div className="card-header">
             <h3><CalendarIcon size={16}/> Agenda (Google)</h3>
          </div>
          
          {isLoading ? <LoadingCard /> : (
            <div className="agenda-layout">
              {/* Lado Esquerdo: Calendário Grid */}
              <div className="calendar-grid-wrapper">
                <div className="month-label-row">
                  <span className="month-name">
                    {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </span>
                  <span className="month-count-badge">
                    {monthEventsCount} eventos
                  </span>
                </div>
                
                <div className="days-grid">
                  {daysArray.map(day => {
                    const hasEvent = hasEventOnDay(day);
                    const isSelected = selectedDate.getDate() === day;
                    return (
                      <div 
                        key={day} 
                        className={`cal-day-cell ${isSelected ? 'active' : ''} ${hasEvent ? 'has-event' : ''}`}
                        onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                      >
                        {day}
                        {hasEvent && <div className="event-dot"></div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lado Direito: Lista do Dia */}
              <div className="day-events-list">
                <h4 className="day-title-sticky">
                  Dia {selectedDate.getDate()}
                  <span className="day-count-small">({selectedEvents.length})</span>
                </h4>
                <div className="events-scroll">
                  {selectedEvents.length === 0 ? (
                    <p className="no-events-text">Nada marcado.</p>
                  ) : (
                    selectedEvents.map((evt, idx) => (
                      <div key={idx} className="agenda-row compact">
                        <div className="time-col">
                          {formatTime(evt.start)}
                        </div>
                        <div className="info-col">
                          <span className="evt-summary">{evt.summary}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. FINANÇAS */}
        <div className="dsh-card area-finance">
           <div className="card-header">
             <h3><Wallet size={16} color="#10b981"/> Finanças</h3>
           </div>
           {isLoading ? <LoadingCard /> : (
             <div className="fin-content">
                <div className="fin-big-val">
                  <small>Saldo Total</small>
                  <h2>{formatCurrency(financeSummary.balance)}</h2>
                </div>
                <div className="fin-mini-list">
                   <div className="mini-trans"><TrendingDown size={14} color="#ef4444"/> Uber - R$ 24,90</div>
                   <div className="mini-trans"><TrendingUp size={14} color="#10b981"/> Pix + R$ 150,00</div>
                   <div className="mini-trans"><TrendingDown size={14} color="#ef4444"/> Spotify - R$ 21,90</div>
                </div>
             </div>
           )}
        </div>

        {/* 3. TO-DO LIST */}
        <div className="dsh-card area-todo">
          <div className="card-header">
            <h3>To-Do (Local)</h3>
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

        {/* 4. MERCADO */}
        <div className="dsh-card area-market">
          <div className="card-header">
             <h3><ShoppingCart size={16} color="#10b981"/> Mercado</h3>
          </div>
          <div className="input-row-clean">
             <input 
               placeholder="Comprar..." 
               value={newMarketItem}
               onChange={e => setNewMarketItem(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleAddMarket()}
             />
             <button onClick={handleAddMarket}><Plus size={18}/></button>
          </div>
          {isLoading ? <SkeletonLine /> : (
            <div className="list-scroll">
               {marketList.length === 0 && <p className="empty-text-small">Lista vazia</p>}
               {marketList.map((item, idx) => {
                 const itemId = item.id || item._id;
                 return (
                   <div key={itemId || idx} className="item-row">
                      <div className={`checkbox-sq ${item.checked ? 'checked' : ''}`}>
                        {item.checked && <CheckCircle2 size={14} color="white"/>}
                      </div>
                      <span className={item.checked ? 'risked' : ''} style={{flex:1}}>
                        <span style={{color: '#10b981', fontWeight: 'bold', marginRight: '5px'}}>
                          {item.quantity || 1}x
                        </span>
                        {item.item_name}
                      </span>
                      <button className="icon-btn-small" onClick={() => handleRemoveMarket(itemId)}>
                        <Trash2 size={14}/>
                      </button>
                   </div>
                 )
               })}
            </div>
          )}
        </div>

        {/* 5. IDEIAS */}
        <div className="dsh-card area-ideas">
           <div className="card-header">
              <h3><Lightbulb size={16} color="#f59e0b"/> Ideias</h3>
           </div>
           <div className="input-row-clean">
             <input 
               placeholder="Nova ideia..." 
               value={newIdeaItem}
               onChange={e => setNewIdeaItem(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleAddIdea()}
             />
             <button onClick={handleAddIdea}><Plus size={18}/></button>
          </div>
           {isLoading ? <SkeletonLine /> : (
             <div className="list-scroll">
               {ideasList.length === 0 && <p className="empty-text-small">Nenhuma ideia</p>}
               {ideasList.map((idea, idx) => {
                 const itemId = idea.id || idea._id;
                 return (
                   <div key={itemId || idx} className="idea-row-simple">
                     <span>{idea.idea_content || idea.content}</span>
                     <button className="icon-btn-small" onClick={() => handleRemoveIdea(itemId)}>
                        <Trash2 size={14}/>
                      </button>
                   </div>
                 )
               })}
            </div>
           )}
        </div>

        {/* 6. ESTUDOS */}
        <div className="dsh-card area-study">
           <div className="card-header">
             <h3><BookOpen size={16}/> Faculdade (Local)</h3>
           </div>
           <div className="study-container">
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
             <div className="study-content-cols">
                <div className="study-col">
                   <h4 className="col-title">Infos</h4>
                   <div className="simple-list">
                      {activeSubject.infos.map((info, idx) => (
                        <div key={idx} className="simple-list-item">
                           {info.icon} <span>{info.text}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="study-col">
                   <h4 className="col-title">Tarefas</h4>
                   <div className="simple-list">
                      {activeSubject.tasks.map((t, idx) => (
                        <div key={idx} className="simple-list-item">
                           <Circle size={14} color="#cbd5e1"/> <span>{t}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           </div>
        </div>

        {/* 7. METAS */}
        <div className="dsh-card area-plans">
           <div className="card-header">
              <h3>Metas</h3>
           </div>
           {isLoading ? <LoadingCard /> : (
             <div className="plans-scroll">
                {goalsList.length === 0 ? (
                  <p className="empty-text-small">Sem metas ativas.</p>
                ) : (
                  goalsList.map(goal => {
                    const isOpen = expandedGoalId === goal.id;
                    const current = Number(goal.current_progress || 0);
                    const target = Number(goal.target_amount || 1);
                    const percent = Math.min(100, Math.round((current / target) * 100));
                    const unit = goal.metric_unit || 'R$';

                    return (
                      <div key={goal.id} className={`plan-block ${isOpen ? 'open' : ''}`}>
                         <div className="plan-header" onClick={() => toggleGoal(goal.id)}>
                            <div className="plan-meta" style={{width: '100%'}}>
                              <div style={{display:'flex', justifyContent:'space-between', marginBottom: '4px'}}>
                                  <strong>{goal.goal_name}</strong>
                                  <span style={{fontSize: '11px', fontWeight: 'bold', color: '#10b981'}}>
                                    {current} / {target} {unit}
                                  </span>
                              </div>
                              <div className="progress-track" style={{width: '100%'}}>
                                  <div className="progress-fill" style={{width: `${percent}%`}}></div>
                              </div>
                            </div>
                         </div>
                      </div>
                    )
                  })
                )}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;