import React, { useState, useEffect } from 'react';
import './FinancePage.css';
import { 
  Wallet, TrendingUp, TrendingDown, Calendar, 
  ArrowUpRight, ArrowDownLeft, 
  Plus, Target, Search, Filter
} from 'lucide-react';
import { getFinanceReport, addTransaction, searchTransactions } from '../../services/financeService';

const FinancePage = ({ isSidebarOpen }) => {
  
  // --- ESTADOS DE DADOS ---
  const [transactions, setTransactions] = useState([]); 
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
  const [goal, setGoal] = useState({ limit: 0, current: 0, available: 0, percent: 0 });
  
  // --- ESTADOS DE CONTROLE (PAGINAÇÃO & FILTRO) ---
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Filtros
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Inputs de Nova Transação
  const [newTransTitle, setNewTransTitle] = useState('');
  const [newTransValue, setNewTransValue] = useState('');
  
  // Mock de Receitas Fixas (Mantido)
  const [fixedIncomes] = useState([
    { id: 1, title: 'Salário Mensal', value: 5500.00, day: '05' },
  ]);

  // Carrega relatório e PRIMEIRA página de transações ao montar
  useEffect(() => {
    fetchReport();
    loadTransactions(1, true); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 1. BUSCA RELATÓRIO (SALDO/META) ---
  const fetchReport = async () => {
    try {
      const reportData = await getFinanceReport();
      const resumo = reportData.resumo_mes || {};
      const config = reportData.config || {};
      const metaApi = reportData.meta || {};

      setSummary({
        balance: reportData.saldo_atual_conta || 0,
        income: resumo.ganhos || 0, 
        expense: resumo.gastos || 0
      });

      // Cálculo de Meta (usando limite_estipulado conforme pedido anterior)
      const limitVal = Number(config.limite_estipulado || 0);
      const spentVal = Number(resumo.gastos || 0);
      let calculatedPercent = 0;
      if (limitVal > 0) calculatedPercent = (spentVal / limitVal) * 100;

      setGoal({
        limit: limitVal,
        current: spentVal,
        available: limitVal - spentVal,
        percent: calculatedPercent
      });
      
    } catch (error) {
      console.error("Erro ao carregar relatório:", error);
    }
  };

  // --- 2. BUSCA TRANSAÇÕES (COM PAGINAÇÃO) ---
  const loadTransactions = async (pageNum, reset = false) => {
    if (reset) {
      setLoading(true);
      setTransactions([]); // Limpa lista visualmente se for reset
    } else {
      setLoadingMore(true);
    }

    try {
      const limit = 20;
      // Chama a nova função do service
      const data = await searchTransactions(pageNum, limit, categoryFilter, searchTerm);
      
      const newItems = data.transactions.map((t, index) => ({
        id: t.id || `hist-${index}-${pageNum}`,
        type: t.type,
        amount: Number(t.amount),
        description: t.description,
        category: t.category,
        date: new Date(t.date).toLocaleDateString('pt-BR')
      }));

      if (reset) {
        setTransactions(newItems);
      } else {
        setTransactions(prev => [...prev, ...newItems]);
      }

      // Verifica se tem mais páginas
      setHasMore(newItems.length === limit);
      setPage(pageNum);

    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // --- HANDLERS DE FILTRO ---
  const handleSearch = () => {
    loadTransactions(1, true); // Reseta e busca página 1 com os filtros atuais
  };

  // --- HANDLER DE NOVA TRANSAÇÃO ---
  const handleAddTransaction = async (type) => {
    if(!newTransTitle || !newTransValue) return alert("Preencha a descrição e o valor.");
    const val = parseFloat(newTransValue.replace(',', '.'));
    if(isNaN(val)) return alert("Valor inválido.");

    try {
      await addTransaction(val, type, newTransTitle, 'Avulso'); 
      setNewTransTitle('');
      setNewTransValue('');
      
      // Atualiza tudo
      fetchReport();
      loadTransactions(1, true); // Recarrega a lista do zero para aparecer o item novo no topo

    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  const formatValue = (value) => Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 2});

  return (
    <div className={`finance-wrapper fade-in ${isSidebarOpen ? 'open' : 'closed'}`}>
      
      <header className="fin-header">
        <div>
          <h1>Gestão Financeira</h1>
          <p>Visão geral do seu fluxo de caixa e metas.</p>
        </div>
        <div className="fin-period-badge">
          <Calendar size={16} /> <span>Visão Mensal</span>
        </div>
      </header>

      {/* CARDS DE RESUMO */}
      <div className="summary-grid">
        <div className="summary-card balance">
          <div className="sum-icon-box blue"><Wallet size={24}/></div>
          <div className="sum-info">
            <span>Saldo Atual</span>
            <h2 style={{color: summary.balance < 0 ? '#ef4444' : '#0f172a'}}>
              R$ {formatValue(summary.balance)}
            </h2>
          </div>
        </div>

        <div className="summary-card income">
          <div className="sum-icon-box green"><TrendingUp size={24}/></div>
          <div className="sum-info">
            <span>Entradas</span>
            <h2 className="pos">+ R$ {formatValue(summary.income)}</h2>
          </div>
        </div>

        <div className="summary-card expense">
          <div className="sum-icon-box red"><TrendingDown size={24}/></div>
          <div className="sum-info">
            <span>Saídas</span>
            <h2 className="neg">- R$ {formatValue(summary.expense)}</h2>
          </div>
        </div>
      </div>

      <div className="finance-content-grid">
        
        {/* ESQUERDA: EXTRATO COMPLETO */}
        <div className="fin-panel main-panel">
          <div className="panel-header">
            <h3><ArrowDownLeft size={18}/> Extrato</h3>
          </div>

          {/* BARRA DE FILTROS (NOVA) */}
          <div className="filter-bar">
             <div className="search-input-wrapper">
               <Search size={14} className="search-icon"/>
               <input 
                 placeholder="Buscar transação..." 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleSearch()}
               />
             </div>
             
             <div className="category-select-wrapper">
               <Filter size={14} className="filter-icon"/>
               <select 
                 value={categoryFilter} 
                 onChange={e => setCategoryFilter(e.target.value)}
               >
                 <option value="">Todas Categorias</option>
                 <option value="Alimentação">Alimentação</option>
                 <option value="Transporte">Transporte</option>
                 <option value="Lazer">Lazer</option>
                 <option value="Saúde">Saúde</option>
                 <option value="Moradia">Moradia</option>
                 <option value="Avulso">Avulso</option>
               </select>
             </div>

             <button className="btn-filter-apply" onClick={handleSearch}>
               Filtrar
             </button>
          </div>

          {/* INPUT RÁPIDO */}
          <div className="quick-add-bar">
            <input 
              placeholder="Novo gasto (ex: Padaria)" 
              value={newTransTitle}
              onChange={e => setNewTransTitle(e.target.value)}
            />
            <input 
              type="number" 
              placeholder="0,00" 
              className="value-input"
              value={newTransValue}
              onChange={e => setNewTransValue(e.target.value)}
            />
            <div className="btn-group">
              <button className="btn-add-inc" onClick={() => handleAddTransaction('income')}>
                <Plus size={16}/>
              </button>
              <button className="btn-add-exp" onClick={() => handleAddTransaction('expense')}>
                <Plus size={16}/>
              </button>
            </div>
          </div>

          {/* LISTA DE TRANSAÇÕES */}
          <div className="transactions-list-scroll">
            {transactions.length === 0 && !loading ? (
                <p style={{textAlign: 'center', color: '#94a3b8', padding: '30px'}}>
                  Nenhuma transação encontrada.
                </p>
            ) : (
                transactions.map((item, idx) => {
                    const isIncome = item.type === 'income';
                    return (
                      <div key={item.id || idx} className="trans-row">
                        <div className={`trans-icon ${item.type}`}>
                          {isIncome ? <ArrowUpRight size={18}/> : <ArrowDownLeft size={18}/>}
                        </div>
                        <div className="trans-details">
                          <strong>{item.description}</strong>
                          <div className="trans-meta">
                            <span className="cat-badge">{item.category || 'Geral'}</span>
                            <span className="dot">•</span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                        <div className={`trans-value ${item.type}`}>
                          {isIncome ? '+' : '-'} R$ {formatValue(item.amount)}
                        </div>
                      </div>
                    )
                })
            )}
            
            {/* Botão Carregar Mais */}
            {hasMore && !loading && transactions.length > 0 && (
              <button 
                className="btn-load-more" 
                onClick={() => loadTransactions(page + 1)}
                disabled={loadingMore}
              >
                {loadingMore ? 'Carregando...' : 'Carregar Mais'}
              </button>
            )}
          </div>
        </div>

        {/* DIREITA: META + MOCK RECEITAS */}
        <div className="fin-sidebar-col">
          
          {/* CARD DE META (INTEGRADO) */}
          <div className="fin-panel side-panel goal-panel">
            <div className="panel-header-sm">
              <h4 style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                <Target size={16}/> Meta de Gastos
              </h4>
              <span className={`badge-meta ${goal.percent > 100 ? 'danger' : ''}`}>
                {goal.percent.toFixed(1)}%
              </span>
            </div>

            <div className="goal-chart-container">
              <div className="progress-bg">
                <div 
                  className={`progress-fill ${goal.percent > 90 ? 'warning' : 'normal'}`} 
                  style={{width: `${Math.min(goal.percent, 100)}%`}}
                ></div>
              </div>
            </div>

            <div className="goal-details-grid">
              <div className="g-item">
                <span>Gasto Atual</span>
                <strong>R$ {formatValue(goal.current)}</strong>
              </div>
              <div className="g-item right">
                <span>Limite</span>
                <strong>R$ {formatValue(goal.limit)}</strong>
              </div>
            </div>

            <div className="goal-footer">
              <span>Disponível:</span>
              <h3 className={goal.available < 0 ? 'neg-text' : 'pos-text'}>
                R$ {formatValue(goal.available)}
              </h3>
            </div>
          </div>

          {/* Receitas Fixas (Mock) */}
          <div className="fin-panel side-panel">
            <div className="panel-header-sm">
              <h4>Receitas Fixas</h4>
              <span className="badge-green">{fixedIncomes.length}</span>
            </div>
            <div className="fixed-list">
              {fixedIncomes.map(inc => (
                <div key={inc.id} className="fixed-row">
                  <div className="fixed-info">
                    <strong>{inc.title}</strong>
                    <small>Dia {inc.day}</small>
                  </div>
                  <span className="fixed-val pos">R$ {formatValue(inc.value)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FinancePage;