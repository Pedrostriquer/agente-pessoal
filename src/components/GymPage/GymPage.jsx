import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './GymPage.css';
import { 
  Dumbbell, Activity, Edit3, Save, User, Scale, Ruler, 
  Plus, Trash2, X
} from 'lucide-react';
import { getGymProfile, updateGymProfile, getWeeklyPlan, saveWorkoutDay } from '../../services/gymService';

// --- MODAL DE EDIÇÃO DE TREINO ---
const WorkoutModal = ({ isOpen, onClose, day, initialData, onSave }) => {
  const [focus, setFocus] = useState(initialData.focus || '');
  const [exercises, setExercises] = useState(initialData.exercises || []);

  // Se initialData mudar (ao abrir modal), atualiza estados
  useEffect(() => {
    if (isOpen) {
      setFocus(initialData.focus || '');
      // Garante que exercises seja um array, mesmo se vier vazio ou undefined
      setExercises(Array.isArray(initialData.exercises) ? initialData.exercises : []);
    }
  }, [initialData, isOpen]);

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', load: '' }]);
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  };

  const handleSave = () => {
    onSave(day, focus, exercises);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content gym-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Editar Treino: <span className="highlight-day">{day}</span></h3>
          <button className="btn-close" onClick={onClose}><X size={20}/></button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Foco do Dia</label>
            <input 
              className="gym-input-lg"
              placeholder="Ex: Peito e Tríceps, Leg Day..." 
              value={focus}
              onChange={e => setFocus(e.target.value)}
            />
          </div>

          <div className="exercises-manager">
            <div className="ex-header">
              <label>Exercícios</label>
              <button className="btn-add-ex" onClick={handleAddExercise}>
                <Plus size={14}/> Adicionar
              </button>
            </div>

            <div className="exercises-list-scroll">
              {exercises.length === 0 ? (
                <p className="empty-msg">Nenhum exercício adicionado.</p>
              ) : (
                exercises.map((ex, idx) => (
                  <div key={idx} className="exercise-row-edit">
                    <input 
                      className="ex-input name" 
                      placeholder="Nome do Exercício"
                      value={ex.name}
                      onChange={e => updateExercise(idx, 'name', e.target.value)}
                    />
                    <div className="ex-meta-inputs">
                      <input placeholder="Séries" value={ex.sets} onChange={e => updateExercise(idx, 'sets', e.target.value)} />
                      <input placeholder="Reps" value={ex.reps} onChange={e => updateExercise(idx, 'reps', e.target.value)} />
                      <input placeholder="Kg" value={ex.load} onChange={e => updateExercise(idx, 'load', e.target.value)} />
                    </div>
                    <button className="btn-remove-ex" onClick={() => handleRemoveExercise(idx)}>
                      <Trash2 size={16}/>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-confirm" onClick={handleSave}>Salvar Treino</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- PÁGINA PRINCIPAL ---
const GymPage = ({ isSidebarOpen }) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ weight: '', height: '', age: '', goal: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Estrutura base da semana
  const daysOrder = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const [weeklyPlan, setWeeklyPlan] = useState(
    daysOrder.map(day => ({ day, focus: '', exercises: [] }))
  );

  // Estados do Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDayData, setEditingDayData] = useState({ day: '', focus: '', exercises: [] });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileData, planData] = await Promise.all([
        getGymProfile(),
        getWeeklyPlan()
      ]);

      if (profileData) {
        setProfile({
          weight: profileData.weight || '',
          height: profileData.height || '',
          age: profileData.age || '',
          goal: profileData.goal || ''
        });
      }

      if (planData && Array.isArray(planData)) {
        // Mapeia os dados do backend para a estrutura visual fixa da semana
        const mergedPlan = daysOrder.map(dayName => {
          // Tenta encontrar pelo nome em PT ou conversão simples se necessário
          const dayMap = {
            'monday': 'Segunda', 'tuesday': 'Terça', 'wednesday': 'Quarta',
            'thursday': 'Quinta', 'friday': 'Sexta', 'saturday': 'Sábado', 'sunday': 'Domingo'
          };
          
          const found = planData.find(p => {
            const apiDay = p.day_of_week ? p.day_of_week.toLowerCase() : '';
            return apiDay === dayName.toLowerCase() || dayMap[apiDay] === dayName;
          });

          return found ? { 
            day: dayName, 
            focus: found.focus, 
            exercises: Array.isArray(found.exercises) ? found.exercises : (found.exercises_json ? JSON.parse(found.exercises_json) : []) 
          } : { day: dayName, focus: '', exercises: [] };
        });
        setWeeklyPlan(mergedPlan);
      }
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (dayItem) => {
    setEditingDayData(dayItem);
    setModalOpen(true);
  };

  const handleSaveWorkoutFromModal = async (day, focus, exercises) => {
    // Mapeamento inverso para inglês, pois o backend usa para ordenação
    const dayMapReverse = {
      'Segunda': 'monday', 'Terça': 'tuesday', 'Quarta': 'wednesday',
      'Quinta': 'thursday', 'Sexta': 'friday', 'Sábado': 'saturday', 'Domingo': 'sunday'
    };
    
    const backendDay = dayMapReverse[day] || day;

    try {
      // Atualiza visualmente instantâneo (Optimistic UI)
      setWeeklyPlan(prev => prev.map(p => 
        p.day === day ? { ...p, focus, exercises } : p
      ));

      await saveWorkoutDay(backendDay, focus, exercises);
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar no servidor.');
      fetchData(); // Reverte em caso de erro
    }
  };

  const handleSaveProfile = async () => {
    // 1. Tratamento de dados: converte string vazia para null e números para float/int
    // Isso evita o erro 500 no PostgreSQL que não aceita string vazia em campos numéricos
    const payload = {
      weight: profile.weight ? Number(profile.weight) : null,
      height: profile.height ? Number(profile.height) : null,
      age: profile.age ? Number(profile.age) : null,
      goal: profile.goal || null
    };

    try {
      await updateGymProfile(payload);
      setIsEditingProfile(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar perfil.');
    }
  };

  return (
    <div className={`gym-wrapper fade-in ${isSidebarOpen ? 'open' : 'closed'}`}>
      <WorkoutModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        day={editingDayData.day}
        initialData={editingDayData}
        onSave={handleSaveWorkoutFromModal}
      />

      <header className="page-header">
        <h1>Academia & Saúde</h1>
        <p>Painel de evolução e periodização de treino.</p>
      </header>

      {/* PERFIL */}
      <section className="gym-stats-grid">
        <div className="gym-card profile-card">
          <div className="card-header-row">
            <h3><User size={18}/> Biometria</h3>
            <button className="btn-icon" onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}>
              {isEditingProfile ? <Save size={18} color="#10b981"/> : <Edit3 size={18}/>}
            </button>
          </div>
          <div className="stats-row">
            <div className="stat-item">
              <span className="label"><Scale size={14}/> Peso (kg)</span>
              {isEditingProfile ? (
                <input 
                  type="number" 
                  value={profile.weight} 
                  onChange={e => setProfile({...profile, weight: e.target.value})} 
                  className="gym-input-sm"
                />
              ) : (
                <span className="value">{profile.weight || '--'}</span>
              )}
            </div>
            <div className="stat-item">
              <span className="label"><Ruler size={14}/> Altura (cm)</span>
              {isEditingProfile ? (
                <input 
                  type="number" 
                  value={profile.height} 
                  onChange={e => setProfile({...profile, height: e.target.value})} 
                  className="gym-input-sm"
                />
              ) : (
                <span className="value">{profile.height || '--'}</span>
              )}
            </div>
            <div className="stat-item wide">
              <span className="label"><Activity size={14}/> Objetivo</span>
              {isEditingProfile ? (
                <input 
                  type="text" 
                  value={profile.goal} 
                  onChange={e => setProfile({...profile, goal: e.target.value})} 
                  className="gym-input-sm full"
                />
              ) : (
                <span className="value">{profile.goal || 'Definir'}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* GRADE DE TREINOS */}
      <section className="workout-section">
        <div className="section-title">
          <Dumbbell size={20} color="#10b981"/>
          <h3>Cronograma Semanal</h3>
        </div>

        <div className="workout-grid">
          {weeklyPlan.map((item, index) => (
            <div key={index} className="workout-card" onClick={() => openModal(item)}>
              <div className="workout-header">
                <span className="day-name">{item.day}</span>
                <button className="btn-edit-mini">
                  <Edit3 size={14}/>
                </button>
              </div>
              
              <div className="workout-body">
                <div className={`focus-badge ${!item.focus ? 'empty' : ''}`}>
                  {item.focus || 'Descanso'}
                </div>
                
                <div className="exercise-preview-list">
                  {item.exercises && item.exercises.length > 0 ? (
                     item.exercises.map((ex, i) => (
                       <div key={i} className="ex-preview-item">
                         <span className="ex-name">{ex.name || ex}</span>
                         {ex.sets && <span className="ex-details">{ex.sets}x{ex.reps} {ex.load && `(${ex.load})`}</span>}
                       </div>
                     ))
                  ) : (
                    <span className="empty-text">Toque para adicionar</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GymPage;