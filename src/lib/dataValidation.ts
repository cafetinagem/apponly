
import { Task, Model, Note } from './types';

// Validações para Tasks
export const validateTask = (task: Partial<Task>): string[] => {
  const errors: string[] = [];

  if (!task.title?.trim()) {
    errors.push('Título é obrigatório');
  }

  if (task.title && task.title.length > 200) {
    errors.push('Título deve ter no máximo 200 caracteres');
  }

  if (!task.status) {
    errors.push('Status é obrigatório');
  }

  if (!['todo', 'in-progress', 'done'].includes(task.status as string)) {
    errors.push('Status inválido');
  }

  if (!task.priority) {
    errors.push('Prioridade é obrigatória');
  }

  if (!['baixa', 'media', 'alta'].includes(task.priority as string)) {
    errors.push('Prioridade inválida');
  }

  if (!task.assignee) {
    errors.push('Responsável é obrigatório');
  }

  if (!['executor', 'modelo'].includes(task.assignee as string)) {
    errors.push('Responsável inválido');
  }

  if (task.timeEstimate && (task.timeEstimate < 0 || task.timeEstimate > 1000)) {
    errors.push('Estimativa de tempo deve estar entre 0 e 1000 horas');
  }

  if (task.deadline && task.deadline < new Date()) {
    errors.push('Prazo não pode ser no passado');
  }

  return errors;
};

// Validações para Models
export const validateModel = (model: Partial<Model>): string[] => {
  const errors: string[] = [];

  if (!model.name?.trim()) {
    errors.push('Nome é obrigatório');
  }

  if (model.name && model.name.length > 100) {
    errors.push('Nome deve ter no máximo 100 caracteres');
  }

  if (!model.email?.trim()) {
    errors.push('Email é obrigatório');
  }

  if (model.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(model.email)) {
    errors.push('Email inválido');
  }

  if (!model.phone?.trim()) {
    errors.push('Telefone é obrigatório');
  }

  if (model.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(model.phone)) {
    errors.push('Telefone deve estar no formato (XX) XXXXX-XXXX');
  }

  if (!model.status) {
    errors.push('Status é obrigatório');
  }

  if (!['active', 'inactive', 'pending'].includes(model.status as string)) {
    errors.push('Status inválido');
  }

  if (model.age && (model.age < 18 || model.age > 80)) {
    errors.push('Idade deve estar entre 18 e 80 anos');
  }

  if (model.bio && model.bio.length > 500) {
    errors.push('Bio deve ter no máximo 500 caracteres');
  }

  return errors;
};

// Validações para Notes
export const validateNote = (note: Partial<Note>): string[] => {
  const errors: string[] = [];

  if (!note.title?.trim()) {
    errors.push('Título é obrigatório');
  }

  if (note.title && note.title.length > 200) {
    errors.push('Título deve ter no máximo 200 caracteres');
  }

  if (!note.content?.trim()) {
    errors.push('Conteúdo é obrigatório');
  }

  if (note.content && note.content.length > 10000) {
    errors.push('Conteúdo deve ter no máximo 10.000 caracteres');
  }

  if (!note.category?.trim()) {
    errors.push('Categoria é obrigatória');
  }

  if (note.category && note.category.length > 50) {
    errors.push('Categoria deve ter no máximo 50 caracteres');
  }

  return errors;
};

// Sanitização de dados
export const sanitizeString = (str: string | undefined): string => {
  if (!str) return '';
  return str.trim().replace(/[<>]/g, '');
};

export const sanitizeHtml = (html: string | undefined): string => {
  if (!html) return '';
  // Remove scripts e outras tags perigosas
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
};

// Formatação de dados
export const formatPhone = (phone: string): string => {
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }
  if (numbers.length === 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }
  return phone;
};

export const formatEmail = (email: string): string => {
  return email.toLowerCase().trim();
};
