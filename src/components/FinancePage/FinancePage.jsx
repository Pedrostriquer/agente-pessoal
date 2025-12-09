import React, { useState, useEffect } from 'react';
import './FinancePage.css';
import { 
  Wallet, TrendingUp, TrendingDown, Calendar, 
  ArrowUpRight, ArrowDownLeft, 
  Plus, MoreHorizontal, Bell 
} from 'lucide-react';
// Importando os serviços de finanças
import { getFinanceReport, addTransaction } from '../../services/financeService';

const FinancePage = ({ isSidebarOpen }) => {
  
  // --- ESTADOS DO RELATÓRIO E TRANSAÇÕES (Dados Vivos/Locais) ---
  const [transactions, setTransactions] = useState([]); // Será populada apenas localmente via addTransaction
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DE INPUTS ---
  const [newTransTitle, setNewTransTitle] = useState('');
  const [newTransValue, setNewTransValue] = useState('');
  
  // --- DADOS FIXOS (Mockados) ---
  const [fixedItems] = useState({
    incomes: [
      { id: 1, title: 'Salário Mensal', value: 5500.00, day: '05' },
      { id: 2, title: 'Aluguel Garagem', value: 200.00, day: '10' },
    ],
    expenses: [
      { id: 101, title: 'Aluguel Apt', value: 1800.00, day: '10', reminder: true }, 
      { id: 102, title: 'Internet Fibra', value: 120.00, day: '15', reminder: false },
      { id: 103, title: 'Spotify', value: 21.90, day: '20', reminder: false },
      { id: 104, title: 'Academia', value: 99.90, day: '01', reminder: false },
    ]
  });

  useEffect(() => {
    fetchFinanceData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- HANDLER DE FETCH ---
  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const data = await getFinanceReport();
      
      // Mapeamento CORRIGIDO para a NOVA estrutura da API
      const resumo = data.resumo_mes || {};
      setSummary({
        // saldo_atual_conta -> balance
        balance: data.saldo_atual_conta || 0,
        // resumo_mes.ganhos -> income
        income: resumo.ganhos || 0, 
        // resumo_mes.gastos -> expense
        expense: resumo.gastos || 0
      });
      
      // Não tentamos mais buscar data.history, a lista será populada pelo addTransaction
      // Se você tiver uma API para listar transações, adicione-a aqui
      
    } catch (error) {
      console.error("Erro ao carregar dados financeiros:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER DE ADICIONAR TRANSAÇÃO ---
  const handleAddTransaction = async (type) => {
    if(!newTransTitle || !newTransValue) return alert("Preencha a descrição e o valor.");

    const val = parseFloat(newTransValue.replace(',', '.'));
    if(isNaN(val)) return alert("Valor inválido.");

    try {
      // Chamada à API
      const result = await addTransaction(val, type, newTransTitle, 'Avulso'); 

      // Se a API retornar a transação criada, adicionamos ela no estado LOCAL
      setTransactions(prev => [{
        id: result.id || Date.now(),
        type: type,
        description: newTransTitle,
        amount: val,
        category: 'Avulso',
        date: 'Hoje'
      }, ...prev]);

      // Limpa os inputs
      setNewTransTitle('');
      setNewTransValue('');
      
      // Recarrega os dados para atualizar o resumo (que vem da API)
      fetchFinanceData();

    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      alert(`Erro ao adicionar transação: ${error.message}`);
    }
  };

  // --- HELPER DE FORMATAÇÃO ---
  const formatValue = (value) => {
    return Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 2});
  };

  return (
    <div className={`finance-wrapper fade-in ${isSidebarOpen ? 'open' : 'closed'}`}>
      
      <header className="fin-header">
        <div>
          <h1>Gestão Financeira</h1>
          <p>Acompanhe seu fluxo de caixa e obrigações mensais.</p>
        </div>
        <div className="fin-period-badge">
          <Calendar size={16} /> <span>{loading ? 'Atualizando...' : 'Dados Vivos'}</span>
        </div>
      </header>

      {/* 1. CARDS DE RESUMO (Dados CORRIGIDOS da API) */}
      <div className="summary-grid">
        <div className="summary-card balance">
          <div className="sum-icon-box blue"><Wallet size={24}/></div>
          <div className="sum-info">
            <span>Saldo Total</span>
            <h2>R$ {formatValue(summary.balance)}</h2>
          </div>
        </div>

        <div className="summary-card income">
          <div className="sum-icon-box green"><TrendingUp size={24}/></div>
          <div className="sum-info">
            <span>Entradas (Mês)</span>
            <h2 className="pos">+ R$ {formatValue(summary.income)}</h2>
          </div>
        </div>

        <div className="summary-card expense">
          <div className="sum-icon-box red"><TrendingDown size={24}/></div>
          <div className="sum-info">
            <span>Saídas (Mês)</span>
            <h2 className="neg">- R$ {formatValue(summary.expense)}</h2>
          </div>
        </div>
      </div>

      {/* 2. CONTEÚDO PRINCIPAL (Split View) */}
      <div className="finance-content-grid">
        
        {/* ESQUERDA: EXTRATO / MOVIMENTAÇÕES */}
        <div className="fin-panel main-panel">
          <div className="panel-header">
            <h3><ArrowDownLeft size={18}/> Movimentações Recentes</h3>
            <button className="icon-btn"><MoreHorizontal size={18}/></button>
          </div>

          {/* Input Rápido */}
          <div className="quick-add-bar">
            <input 
              placeholder="Descrição (ex: Almoço)" 
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
                <Plus size={16}/> Entrada
              </button>
              <button className="btn-add-exp" onClick={() => handleAddTransaction('expense')}>
                <Plus size={16}/> Gasto
              </button>
            </div>
          </div>

          {/* Lista de Transações */}
          <div className="transactions-list-scroll">
            {transactions.length === 0 && !loading ? (
                <p style={{textAlign: 'center', color: '#94a3b8', padding: '30px'}}>Adicione sua primeira transação.</p>
            ) : (
                transactions.map((item, idx) => {
                    // Mapeando campos (amount, type, description)
                    const type = item.type;
                    const isIncome = type === 'income';
                    const value = Number(item.amount);
                    
                    return (
                      <div key={item.id || idx} className="trans-row">
                        <div className={`trans-icon ${type}`}>
                          {isIncome ? <ArrowUpRight size={18}/> : <ArrowDownLeft size={18}/>}
                        </div>
                        <div className="trans-details">
                          <strong>{item.description}</strong>
                          <div className="trans-meta">
                            <span>{item.category || 'Avulso'}</span>
                            <span className="dot">•</span>
                            <span>{item.date || 'Hoje'}</span>
                          </div>
                        </div>
                        <div className={`trans-value ${type}`}>
                          {isIncome ? '+' : '-'} R$ {formatValue(value)}
                        </div>
                      </div>
                    )
                })
            )}
          </div>
        </div>

        {/* DIREITA: FIXOS (Mockados) */}
        <div className="fin-sidebar-col">
          
          {/* Receitas Fixas */}
          <div className="fin-panel side-panel">
            <div className="panel-header-sm">
              <h4>Receitas Fixas (Mock)</h4>
              <span className="badge-green">{fixedItems.incomes.length}</span>
            </div>
            <div className="fixed-list">
              {fixedItems.incomes.map(inc => (
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

          {/* Gastos Fixos */}
          <div className="fin-panel side-panel">
            <div className="panel-header-sm">
              <h4>Gastos Fixos (Mock)</h4>
              <span className="badge-red">{fixedItems.expenses.length}</span>
            </div>
            <div className="fixed-list">
              {fixedItems.expenses.map(exp => (
                <div key={exp.id} className="fixed-row">
                  <div className="fixed-info">
                    <div className="title-row">
                      <strong>{exp.title}</strong>
                      {exp.reminder && (
                        <span className="reminder-tag">
                          <Bell size={10} /> Lembrete
                        </span>
                      )}
                    </div>
                    <small>Vence dia {exp.day}</small>
                  </div>
                  <span className="fixed-val neg">- R$ {formatValue(exp.value)}</span>
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