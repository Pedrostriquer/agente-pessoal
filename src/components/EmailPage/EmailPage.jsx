import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './EmailPage.css';
import { 
  Mail, Search, RefreshCw, X, User, 
  Star, Inbox, AlertCircle, ChevronRight,
  Filter
} from 'lucide-react';
import { listEmails, readEmail } from '../../services/gmailService';

// --- MODAL DE LEITURA (Estilo Moderno) ---
const EmailReaderModal = ({ isOpen, onClose, emailData, loading }) => {
  if (!isOpen) return null;

  // Extrai apenas o nome do remetente (remove o <email@...>)
  const senderName = emailData?.from?.split('<')[0]?.trim() || 'Desconhecido';
  const senderEmail = emailData?.from?.match(/<([^>]+)>/)?.[1] || '';

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="email-modal-container" onClick={e => e.stopPropagation()}>
        
        {/* Header do Modal */}
        <div className="email-modal-header">
          <div className="modal-actions">
            <button className="btn-close-modal" onClick={onClose}>
              <X size={20}/>
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="email-modal-content">
          {loading ? (
            <div className="email-loading-state">
              <RefreshCw size={24} className="spin"/>
              <p>Carregando mensagem...</p>
            </div>
          ) : emailData ? (
            <>
              <h1 className="email-title-lg">{emailData.subject}</h1>
              
              <div className="email-sender-card">
                <div className="sender-avatar-lg">
                  {senderName.charAt(0).toUpperCase()}
                </div>
                <div className="sender-details">
                  <span className="sender-name-lg">{senderName}</span>
                  <span className="sender-email-sm">{senderEmail}</span>
                </div>
                <div className="email-date-badge">Hoje</div> {/* Mock data, API não retorna data na lista */}
              </div>

              <div className="email-body-text">
                {/* whiteSpace: 'pre-wrap' preserva as quebras de linha do email texto puro */}
                {emailData.body}
              </div>
            </>
          ) : (
            <div className="email-error-state">
              <AlertCircle size={32}/>
              <p>Erro ao carregar e-mail.</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const EmailPage = ({ isSidebarOpen }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Estados de Filtro
  const [activeFilter, setActiveFilter] = useState('unread'); // 'unread', 'all', 'starred', 'important'
  const [searchText, setSearchText] = useState('');

  // Leitura
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [readingEmailData, setReadingEmailData] = useState(null);
  const [loadingBody, setLoadingBody] = useState(false);

  // Lista de filtros rápidos
  const filters = [
    { id: 'unread', label: 'Não Lidos', icon: <Mail size={14}/>, query: 'is:unread' },
    { id: 'all', label: 'Todos', icon: <Inbox size={14}/>, query: '' }, // Vazio = todos
    { id: 'starred', label: 'Com Estrela', icon: <Star size={14}/>, query: 'is:starred' },
    { id: 'important', label: 'Importantes', icon: <AlertCircle size={14}/>, query: 'is:important' },
  ];

  useEffect(() => {
    handleFetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]); // Recarrega quando troca o filtro

  const handleFetch = async () => {
    setLoading(true);
    try {
      // Combina o filtro selecionado com o texto da busca
      const currentFilterQuery = filters.find(f => f.id === activeFilter)?.query || '';
      
      // Se tiver busca digitada, usa ela. Se não, usa o filtro dos botões.
      // Se tiver os dois, o Gmail aceita concatenar: "is:unread amazon"
      let finalQuery = currentFilterQuery;
      if (searchText) {
        finalQuery = `${currentFilterQuery} ${searchText}`.trim();
      }

      const data = await listEmails(finalQuery);
      if (Array.isArray(data)) {
        setEmails(data);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') handleFetch();
  };

  const openEmail = async (id) => {
    setSelectedEmailId(id);
    setLoadingBody(true);
    try {
      const data = await readEmail(id);
      setReadingEmailData(data);
    } catch (error) {
      console.error("Erro leitura:", error);
    } finally {
      setLoadingBody(false);
    }
  };

  const closeEmail = () => {
    setSelectedEmailId(null);
    setReadingEmailData(null);
  };

  // Helper para extrair nome limpo na lista
  const getSenderName = (rawFrom) => {
    if (!rawFrom) return 'Desconhecido';
    return rawFrom.split('<')[0].trim();
  };

  return (
    <div className={`email-page-wrapper fade-in ${isSidebarOpen ? 'open' : 'closed'}`}>
      
      <EmailReaderModal 
        isOpen={!!selectedEmailId}
        onClose={closeEmail}
        emailData={readingEmailData}
        loading={loadingBody}
      />

      <header className="page-header">
        <h1>Caixa de Entrada</h1>
        <p>Acompanhe suas mensagens importantes.</p>
      </header>

      <div className="email-main-card">
        
        {/* TOOLBAR SUPERIOR */}
        <div className="email-toolbar">
          
          <div className="search-wrapper">
            <Search size={16} className="search-ico"/>
            <input 
              placeholder="Pesquisar e-mail..." 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </div>

          <div className="filters-row">
            {filters.map(f => (
              <button 
                key={f.id}
                className={`filter-chip ${activeFilter === f.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(f.id)}
              >
                {f.icon} <span>{f.label}</span>
              </button>
            ))}
          </div>

          <button className="btn-refresh-icon" onClick={handleFetch} title="Atualizar">
            <RefreshCw size={18} className={loading ? 'spin' : ''}/>
          </button>
        </div>

        {/* LISTAGEM */}
        <div className="email-list-container">
          {loading ? (
            <div className="list-loading">
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
            </div>
          ) : emails.length === 0 ? (
            <div className="list-empty">
              <div className="empty-icon-bg"><Filter size={24}/></div>
              <p>Nenhum e-mail encontrado para este filtro.</p>
            </div>
          ) : (
            <div className="email-items-scroll">
              {emails.map((email) => {
                const name = getSenderName(email.from);
                return (
                  <div key={email.id} className="email-item-row" onClick={() => openEmail(email.id)}>
                    
                    <div className="email-left-col">
                      <div className="avatar-circle">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="email-center-col">
                      <div className="row-top-info">
                        <span className="row-sender">{name}</span>
                        {/* Como a API de lista não retorna data ainda, podemos omitir ou por placeholder */}
                        {/* <span className="row-date">10:42</span> */}
                      </div>
                      <span className="row-subject">{email.subject || '(Sem assunto)'}</span>
                      <span className="row-snippet">
                        {email.snippet ? email.snippet.replace(/&#39;/g, "'") : ''}
                      </span>
                    </div>

                    <div className="email-right-arrow">
                      <ChevronRight size={16}/>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EmailPage;