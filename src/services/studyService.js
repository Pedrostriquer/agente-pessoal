import { apiRequest } from './api';

// --- MATÉRIAS ---

export const getSubjects = async () => {
  // GET /study/subjects
  return apiRequest('/study/subjects', { method: 'GET' });
};

export const createSubject = async (name, category = 'Geral') => {
  // POST /study/subjects
  return apiRequest('/study/subjects', {
    method: 'POST',
    body: JSON.stringify({ name, category })
  });
};

// --- PLANOS DE ESTUDO ---

export const createStudyPlanDraft = async (content) => {
  // POST /study/plans/draft
  // Envia o conteúdo para a IA gerar o plano/rascunho
  return apiRequest('/study/plans/draft', {
    method: 'POST',
    body: JSON.stringify({ content })
  });
};

export const advanceStudyPlan = async (planId) => {
  // PATCH /study/plans/{planId}/advance
  return apiRequest(`/study/plans/${planId}/advance`, {
    method: 'PATCH'
  });
};