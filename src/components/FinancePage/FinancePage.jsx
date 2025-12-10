import React, { useState, useEffect } from 'react';
import './FinancePage.css';
import { 
  Wallet, TrendingUp, TrendingDown, Calendar, 
  ArrowUpRight, ArrowDownLeft, 
  Plus, Target, Search, Filter, 
  ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { getFinanceReport, addTransaction, searchTransactions } from '../../services/financeService';

const FinancePage = ({ isSidebarOpen }) => {
  
  // --- ESTADOS DE DADOS ---
  const [transactions, setTransactions] = useState([]); 
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
  const [goal, setGoal] = useState({ limit: 0, current: 0, available: 0, percent: 0 });
  
  // --- ESTADOS DE CONTROLE ---
  const [loading, setLoading] = useState(false);
  
  // Paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 5; // Deve bater com o limit da API ou ser ajustável

  // Filtros
  const [availableCategories, setAvailableCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Inputs de Nova Transação
  const [newTransTitle, setNewTransTitle] = useState('');
  const [newTransValue, setNewTransValue] = useState('');
  
  // Mock de Receitas Fixas
  const [fixedIncomes] = useState([
    { id: 1, title: 'Salário Mensal', value: 5500.00, day: '05' },
  ]);

  // Carrega dados iniciais
  useEffect(() => {
    fetchReport();
    loadTransactions(1); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 1. BUSCA RELATÓRIO ---
  const fetchReport = async () => {
    try {
      const reportData = await getFinanceReport();
      const resumo = reportData.resumo_mes || {};
      const config = reportData.config || {};
      // const metaApi = reportData.meta || {}; // Se precisar

      setSummary({
        balance: reportData.saldo_atual_conta || 0,
        income: resumo.ganhos || 0, 
        expense: resumo.gastos || 0
      });

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

  // --- 2. BUSCA TRANSAÇÕES (Paginada e Dinâmica) ---
  const loadTransactions = async (pageNum = 1) => {
    setLoading(true);
    try {
      // Passa o filtro de categoria atual e termo de busca
      const data = await searchTransactions(pageNum, ITEMS_PER_PAGE, categoryFilter, searchTerm);
      
      // 1. Atualiza lista de categorias disponíveis (Vindo da API)
      if (data.categories && Array.isArray(data.categories)) {
        setAvailableCategories(data.categories);
      }

      // 2. Calcula paginação
      const total = data.total || 0;
      setTotalItems(total);
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
      setPage(pageNum);

      // 3. Mapeia transações
      const list = data.transactions || [];
      const newItems = list.map((t, index) => ({
        id: t.id || `tr-${index}-${pageNum}`,
        type: t.type, // 'income' ou 'expense'
        amount: Number(t.amount),
        description: t.description,
        category: t.category,
        date: new Date(t.date).toLocaleDateString('pt-BR')
      }));

      setTransactions(newItems);

    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      loadTransactions(1); // Volta para página 1 ao filtrar
    }
  };

  const handleCategorySelect = (cat) => {
    // Se clicar na mesma, desmarca. Se clicar em outra, seleciona.
    const newCat = categoryFilter === cat ? '' : cat;
    setCategoryFilter(newCat);
    // Para garantir que a busca use o valor novo, chamamos a busca após a atualização do estado
    // O useEffect abaixo garante que loadTransactions(1) será chamado quando categoryFilter mudar.
  };
  
  // Recarrega transações para a primeira página sempre que o filtro de categoria mudar
  useEffect(() => {
     loadTransactions(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter]);


  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadTransactions(newPage);
    }
  };

  // Adicionar Transação
  const handleAddTransaction = async (type) => {
    if(!newTransTitle || !newTransValue) return alert("Preencha a descrição e o valor.");
    const val = parseFloat(newTransValue.replace(',', '.'));
    if(isNaN(val)) return alert("Valor inválido.");

    try {
      await addTransaction(val, type, newTransTitle, 'Avulso'); 
      setNewTransTitle('');
      setNewTransValue('');
      
      fetchReport();
      loadTransactions(1); // Recarrega primeira página

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

      {/* CARDS DE RESUMO (Mantido) */}
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
            <span className="total-badge">{totalItems} registros</span>
          </div>

          {/* BARRA DE BUSCA E FILTROS */}
          <div className="filter-section">
             {/* Busca Texto */}
             <div className="search-row">
               <div className="search-input-wrapper">
                 <Search size={14} className="search-icon"/>
                 <input 
                   placeholder="Buscar por descrição..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   onKeyDown={handleSearchKeyDown}
                 />
               </div>
               <button className="btn-filter-apply" onClick={() => loadTransactions(1)}>
                 Buscar
               </button>
             </div>

             {/* Tags de Categoria Dinâmicas */}
             <div className="tags-container">
               <button 
                 className={`tag-chip ${categoryFilter === '' ? 'active' : ''}`}
                 onClick={() => setCategoryFilter('')}
               >
                 Todas
               </button>
               
               {availableCategories.map((cat) => (
                 <button 
                   key={cat} 
                   className={`tag-chip ${categoryFilter === cat ? 'active' : ''}`}
                   onClick={() => handleCategorySelect(cat)}
                 >
                   {cat}
                 </button>
               ))}
             </div>
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
              <button className="btn-add-inc" onClick={() => handleAddTransaction('income')} title="Entrada">
                <Plus size={16}/>
              </button>
              <button className="btn-add-exp" onClick={() => handleAddTransaction('expense')} title="Saída">
                <Plus size={16}/>
              </button>
            </div>
          </div>

          {/* LISTA DE TRANSAÇÕES */}
          <div className="transactions-list-scroll">
            {loading ? (
                <div className="loading-state">Carregando...</div>
            ) : transactions.length === 0 ? (
                <div className="empty-state-fin">
                  <Filter size={24} color="#cbd5e1"/>
                  <p>Nenhuma transação encontrada.</p>
                </div>
            ) : (
                transactions.map((item) => {
                    const isIncome = item.type === 'income';
                    return (
                      <div key={item.id} className="trans-row">
                        <div className={`trans-icon ${item.type}`}>
                          {isIncome ? <ArrowUpRight size={18}/> : <ArrowDownLeft size={18}/>}
                        </div>
                        <div className="trans-details">
                          <strong>{item.description}</strong>
                          <div className="trans-meta">
                            <span className="cat-badge">{item.category}</span>
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
          </div>

          {/* PAGINAÇÃO */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button 
                className="page-btn" 
                onClick={() => changePage(page - 1)}
                disabled={page === 1 || loading}
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="page-info">
                Página <strong>{page}</strong> de {totalPages}
              </span>

              <button 
                className="page-btn" 
                onClick={() => changePage(page + 1)}
                disabled={page === totalPages || loading}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>

        {/* DIREITA: META + MOCK RECEITAS (Mantido igual) */}
        <div className="fin-sidebar-col">
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