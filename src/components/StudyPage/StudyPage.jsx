import React, { useState, useEffect } from 'react';
import './StudyPage.css';
import { 
  BookOpen, Plus, GraduationCap, 
  BrainCircuit, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { 
  getSubjects, createSubject, 
  createStudyPlanDraft, advanceStudyPlan 
} from '../../services/studyService';

const StudyPage = ({ isSidebarOpen }) => {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  
  // Inputs Matéria
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCategory, setNewSubjectCategory] = useState('');

  // Inputs Plano de Estudo
  const [studyContent, setStudyContent] = useState('');
  const [activePlan, setActivePlan] = useState(null); // Armazena o plano criado/ativo
  const [loadingPlan, setLoadingPlan] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const data = await getSubjects();
      // O backend retorna array direto: [{id, name, category}, ...]
      setSubjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar matérias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubjectName) return alert("Digite o nome da matéria.");
    
    try {
      await createSubject(newSubjectName, newSubjectCategory || 'Faculdade');
      setNewSubjectName('');
      setNewSubjectCategory('');
      fetchSubjects(); // Recarrega a lista
    } catch (error) {
      alert("Erro ao criar matéria: " + error.message);
    }
  };

  const handleCreatePlan = async () => {
    if (!studyContent) return alert("O que você vai estudar hoje?");
    
    setLoadingPlan(true);
    try {
      const response = await createStudyPlanDraft(studyContent);
      // Supondo que a resposta seja o objeto do plano ou { message, plan }
      // Ajuste conforme o retorno real do seu backend
      setActivePlan(response.plan || response); 
      setStudyContent('');
    } catch (error) {
      alert("Erro ao gerar plano: " + error.message);
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleAdvanceStep = async () => {
    if (!activePlan?.id) return;

    try {
      const updated = await advanceStudyPlan(activePlan.id);
      // Atualiza o plano com a resposta (novo passo ou status concluído)
      setActivePlan(updated.plan || updated); 
    } catch (error) {
      alert("Erro ao avançar: " + error.message);
    }
  };

  return (
    <div className={`study-wrapper fade-in ${isSidebarOpen ? 'open' : 'closed'}`}>
      
      <header className="page-header">
        <h1>Central de Estudos</h1>
        <p>Gerencie suas matérias e crie planos de estudo inteligentes.</p>
      </header>

      <div className="study-grid-layout">
        
        {/* COLUNA ESQUERDA: MATÉRIAS */}
        <section className="study-column">
          <div className="section-header">
            <BookOpen size={20} color="#10b981"/>
            <h3>Minhas Matérias</h3>
          </div>

          {/* Card de Adicionar */}
          <div className="add-subject-card">
            <div className="input-group-row">
              <input 
                placeholder="Nome (ex: Cálculo I)..." 
                value={newSubjectName}
                onChange={e => setNewSubjectName(e.target.value)}
              />
              <input 
                className="input-sm"
                placeholder="Categoria..." 
                value={newSubjectCategory}
                onChange={e => setNewSubjectCategory(e.target.value)}
              />
              <button className="btn-add-sub" onClick={handleAddSubject}>
                <Plus size={20}/>
              </button>
            </div>
          </div>

          {/* Lista */}
          <div className="subjects-scroll">
            {loading ? <p className="loading-text">Carregando...</p> : (
              subjects.length === 0 ? (
                <div className="empty-subjects">Nenhuma matéria cadastrada.</div>
              ) : (
                subjects.map(sub => (
                  <div key={sub.id} className="subject-item">
                    <div className="sub-icon-box">
                      {sub.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="sub-info">
                      <strong>{sub.name}</strong>
                      <span>{sub.category}</span>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </section>

        {/* COLUNA DIREITA: PLANO DE ESTUDO (IA) */}
        <section className="study-column">
          <div className="section-header">
            <BrainCircuit size={20} color="#8b5cf6"/>
            <h3>Plano de Estudo (IA)</h3>
          </div>

          <div className="plan-card-container">
            {!activePlan ? (
              // ESTADO: CRIAR NOVO PLANO
              <div className="new-plan-box">
                <p>O que vamos estudar hoje?</p>
                <textarea 
                  placeholder="Ex: Preciso aprender Derivadas e Integrais para a prova de amanhã..."
                  value={studyContent}
                  onChange={e => setStudyContent(e.target.value)}
                />
                <button 
                  className="btn-generate-plan" 
                  onClick={handleCreatePlan}
                  disabled={loadingPlan}
                >
                  {loadingPlan ? 'Gerando Roteiro...' : 'Gerar Plano de Estudo'}
                </button>
              </div>
            ) : (
              // ESTADO: PLANO ATIVO
              <div className="active-plan-box">
                <div className="plan-header-active">
                  <h4>Plano Ativo</h4>
                  <span className="status-badge">Em andamento</span>
                </div>
                
                <div className="plan-content-display">
                  {/* Aqui você exibe os dados do plano retornado pelo backend */}
                  {/* Exemplo genérico, ajuste conforme o JSON real do plano */}
                  <p className="plan-topic">
                    <strong>Tópico:</strong> {activePlan.topic || activePlan.title || 'Estudo Personalizado'}
                  </p>
                  
                  {activePlan.current_step && (
                    <div className="current-step-card">
                      <span>Passo Atual:</span>
                      <p>{activePlan.current_step}</p>
                    </div>
                  )}
                </div>

                <div className="plan-actions-footer">
                  <button className="btn-advance" onClick={handleAdvanceStep}>
                    Concluir Passo <ArrowRight size={16}/>
                  </button>
                  <button 
                    className="btn-finish-plan" 
                    onClick={() => setActivePlan(null)}
                  >
                    <CheckCircle2 size={16}/> Finalizar Sessão
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default StudyPage;