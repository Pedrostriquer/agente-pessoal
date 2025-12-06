import React, { useState } from 'react';
import './FinancePage.css';
import { 
  Wallet, TrendingUp, TrendingDown, Calendar, 
  ArrowUpRight, ArrowDownLeft, 
  Plus, MoreHorizontal, Bell 
} from 'lucide-react';

const FinancePage = ({ isSidebarOpen }) => {
  
  // --- MOCK DATA ---
  
  // 1. Extrato (Movimentações)
  const [transactions, setTransactions] = useState([
    { id: 1, title: 'Supermercado Semanal', type: 'expense', value: 450.50, category: 'Alimentação', date: '05/12' },
    { id: 2, title: 'Freela Design', type: 'income', value: 1200.00, category: 'Serviços', date: '04/12' },
    { id: 3, title: 'Uber', type: 'expense', value: 24.90, category: 'Transporte', date: '03/12' },
    { id: 4, title: 'Cinema + Pipoca', type: 'expense', value: 85.00, category: 'Lazer', date: '02/12' },
    { id: 5, title: 'Reembolso Empresa', type: 'income', value: 150.00, category: 'Outros', date: '01/12' },
  ]);

  // 2. Fixos (Receitas e Gastos)
  const [fixedItems, setFixedItems] = useState({
    incomes: [
      { id: 1, title: 'Salário Mensal', value: 5500.00, day: '05' },
      { id: 2, title: 'Aluguel Garagem', value: 200.00, day: '10' },
    ],
    expenses: [
      // Adicionei a propriedade 'reminder: true' aqui
      { id: 101, title: 'Aluguel Apt', value: 1800.00, day: '10', reminder: true }, 
      { id: 102, title: 'Internet Fibra', value: 120.00, day: '15', reminder: false },
      { id: 103, title: 'Spotify', value: 21.90, day: '20', reminder: false },
      { id: 104, title: 'Academia', value: 99.90, day: '01', reminder: false },
    ]
  });

  const [newTransTitle, setNewTransTitle] = useState('');
  const [newTransValue, setNewTransValue] = useState('');

  // --- CÁLCULOS ---
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.value, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.value, 0);
  const currentBalance = 7450.00 + totalIncome - totalExpense; 

  // --- HANDLERS ---
  const handleAddTransaction = (type) => {
    if(!newTransTitle || !newTransValue) return;
    const val = parseFloat(newTransValue.replace(',', '.'));
    if(isNaN(val)) return;

    const newT = {
      id: Date.now(),
      title: newTransTitle,
      type: type, 
      value: val,
      category: 'Avulso',
      date: 'Hoje'
    };

    setTransactions([newT, ...transactions]);
    setNewTransTitle('');
    setNewTransValue('');
  };

  return (
    <div className={`finance-wrapper fade-in ${isSidebarOpen ? 'open' : 'closed'}`}>
      
      <header className="fin-header">
        <div>
          <h1>Gestão Financeira</h1>
          <p>Acompanhe seu fluxo de caixa e obrigações mensais.</p>
        </div>
        <div className="fin-period-badge">
          <Calendar size={16} /> <span>Dezembro 2025</span>
        </div>
      </header>

      {/* 1. CARDS DE RESUMO */}
      <div className="summary-grid">
        <div className="summary-card balance">
          <div className="sum-icon-box blue"><Wallet size={24}/></div>
          <div className="sum-info">
            <span>Saldo Total</span>
            <h2>R$ {currentBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h2>
          </div>
        </div>

        <div className="summary-card income">
          <div className="sum-icon-box green"><TrendingUp size={24}/></div>
          <div className="sum-info">
            <span>Entradas (Mês)</span>
            <h2 className="pos">+ R$ {totalIncome.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h2>
          </div>
        </div>

        <div className="summary-card expense">
          <div className="sum-icon-box red"><TrendingDown size={24}/></div>
          <div className="sum-info">
            <span>Saídas (Mês)</span>
            <h2 className="neg">- R$ {totalExpense.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h2>
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

          {/* Input Rápido (Branco e Clean) */}
          <div className="quick-add-bar">
            <input 
              placeholder="Descrição (ex: Almoço)" 
              value={newTransTitle}
              onChange={e => setNewTransTitle(e.target.value)}
            />
            <input 
              type="number" 
              placeholder="R$ 0,00" 
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
            {transactions.map(item => (
              <div key={item.id} className="trans-row">
                <div className={`trans-icon ${item.type}`}>
                  {item.type === 'income' ? <ArrowUpRight size={18}/> : <ArrowDownLeft size={18}/>}
                </div>
                <div className="trans-details">
                  <strong>{item.title}</strong>
                  <div className="trans-meta">
                    <span>{item.category}</span>
                    <span className="dot">•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
                <div className={`trans-value ${item.type}`}>
                  {item.type === 'income' ? '+' : '-'} R$ {item.value.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DIREITA: FIXOS */}
        <div className="fin-sidebar-col">
          
          {/* Receitas Fixas */}
          <div className="fin-panel side-panel">
            <div className="panel-header-sm">
              <h4>Receitas Fixas (Salários)</h4>
              <span className="badge-green">{fixedItems.incomes.length}</span>
            </div>
            <div className="fixed-list">
              {fixedItems.incomes.map(inc => (
                <div key={inc.id} className="fixed-row">
                  <div className="fixed-info">
                    <strong>{inc.title}</strong>
                    <small>Dia {inc.day}</small>
                  </div>
                  <span className="fixed-val pos">R$ {inc.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gastos Fixos (Com Tag de Lembrete) */}
          <div className="fin-panel side-panel">
            <div className="panel-header-sm">
              <h4>Gastos Fixos (Assinaturas)</h4>
              <span className="badge-red">{fixedItems.expenses.length}</span>
            </div>
            <div className="fixed-list">
              {fixedItems.expenses.map(exp => (
                <div key={exp.id} className="fixed-row">
                  <div className="fixed-info">
                    <div className="title-row">
                      <strong>{exp.title}</strong>
                      {/* Tag de Lembrete aqui */}
                      {exp.reminder && (
                        <span className="reminder-tag">
                          <Bell size={10} /> Lembrete
                        </span>
                      )}
                    </div>
                    <small>Vence dia {exp.day}</small>
                  </div>
                  <span className="fixed-val neg">- R$ {exp.value}</span>
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