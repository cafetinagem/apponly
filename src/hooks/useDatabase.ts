
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/database';
import { Task, Model, ModelSession, Note, TaskKPIs, ModelKPIs } from '@/lib/types';

// Hook para gerenciar tarefas
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(() => {
    setLoading(true);
    const allTasks = db.getAllTasks();
    setTasks(allTasks);
    setLoading(false);
  }, []);

  const createTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'elapsedTime' | 'timerStatus' | 'checklist'>) => {
    const newTask = db.createTask(taskData);
    loadTasks();
    return newTask;
  }, [loadTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const updatedTask = db.updateTask(id, updates);
    if (updatedTask) {
      loadTasks();
    }
    return updatedTask;
  }, [loadTasks]);

  const deleteTask = useCallback((id: string) => {
    const success = db.deleteTask(id);
    if (success) {
      loadTasks();
    }
    return success;
  }, [loadTasks]);

  const getTaskStatistics = useCallback((): TaskKPIs => {
    return db.getTaskStatistics();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    getTaskStatistics,
    refreshTasks: loadTasks
  };
}

// Hook para gerenciar modelos
export function useModels() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  const loadModels = useCallback(() => {
    setLoading(true);
    const allModels = db.getAllModels();
    setModels(allModels);
    setLoading(false);
  }, []);

  const createModel = useCallback((modelData: Omit<Model, 'id' | 'createdAt' | 'updatedAt' | 'platforms' | 'portfolioImages'>) => {
    const newModel = db.createModel(modelData);
    loadModels();
    return newModel;
  }, [loadModels]);

  const updateModel = useCallback((id: string, updates: Partial<Model>) => {
    const updatedModel = db.updateModel(id, updates);
    if (updatedModel) {
      loadModels();
    }
    return updatedModel;
  }, [loadModels]);

  const deleteModel = useCallback((id: string) => {
    const success = db.deleteModel(id);
    if (success) {
      loadModels();
    }
    return success;
  }, [loadModels]);

  const getModelStatistics = useCallback((): ModelKPIs => {
    return db.getModelStatistics();
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  return {
    models,
    loading,
    createModel,
    updateModel,
    deleteModel,
    getModelStatistics,
    refreshModels: loadModels
  };
}

// Hook para gerenciar sessões
export function useSessions() {
  const [sessions, setSessions] = useState<ModelSession[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = useCallback(() => {
    setLoading(true);
    const allSessions = db.getAllSessions();
    setSessions(allSessions);
    setLoading(false);
  }, []);

  const createSession = useCallback((sessionData: Omit<ModelSession, 'id' | 'createdAt'>) => {
    const newSession = db.createSession(sessionData);
    loadSessions();
    return newSession;
  }, [loadSessions]);

  const updateSession = useCallback((id: string, updates: Partial<ModelSession>) => {
    const updatedSession = db.updateSession(id, updates);
    if (updatedSession) {
      loadSessions();
    }
    return updatedSession;
  }, [loadSessions]);

  const deleteSession = useCallback((id: string) => {
    const success = db.deleteSession(id);
    if (success) {
      loadSessions();
    }
    return success;
  }, [loadSessions]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return {
    sessions,
    loading,
    createSession,
    updateSession,
    deleteSession,
    refreshSessions: loadSessions
  };
}

// Hook para gerenciar notas
export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(() => {
    setLoading(true);
    const allNotes = db.getAllNotes();
    setNotes(allNotes);
    setLoading(false);
  }, []);

  const createNote = useCallback((noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'attachments'>) => {
    const newNote = db.createNote(noteData);
    loadNotes();
    return newNote;
  }, [loadNotes]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    const updatedNote = db.updateNote(id, updates);
    if (updatedNote) {
      loadNotes();
    }
    return updatedNote;
  }, [loadNotes]);

  const deleteNote = useCallback((id: string) => {
    const success = db.deleteNote(id);
    if (success) {
      loadNotes();
    }
    return success;
  }, [loadNotes]);

  const searchNotes = useCallback((searchTerm: string) => {
    return db.searchNotes(searchTerm);
  }, []);

  const getNoteStatistics = useCallback(() => {
    return db.getNoteStatistics();
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    getNoteStatistics,
    refreshNotes: loadNotes
  };
}

// Hook para backup e sincronização
export function useBackup() {
  const exportData = useCallback(() => {
    return db.exportData();
  }, []);

  const importData = useCallback((jsonData: string) => {
    return db.importData(jsonData);
  }, []);

  const clearAllData = useCallback(() => {
    db.clearAllData();
  }, []);

  return {
    exportData,
    importData,
    clearAllData
  };
}

// Hook principal para dashboard
export function useDashboard() {
  const { getTaskStatistics } = useTasks();
  const { getModelStatistics } = useModels();
  const { getNoteStatistics } = useNotes();

  const [dashboardData, setDashboardData] = useState({
    taskKPIs: {
      totalTasks: 0,
      todoTasks: 0,
      inProgressTasks: 0,
      completedTasks: 0,
      averageCompletionTime: 0,
      totalTimeSpent: 0,
      productivityScore: 0
    },
    modelKPIs: {
      totalModels: 0,
      activeModels: 0,
      totalSessions: 0,
      upcomingSessions: 0,
      averageRating: 0
    },
    noteStats: {
      totalNotes: 0,
      totalCategories: 0,
      totalAttachments: 0,
      todayNotes: 0
    }
  });

  const refreshDashboard = useCallback(() => {
    const taskKPIs = getTaskStatistics();
    const modelKPIs = getModelStatistics();
    const noteStats = getNoteStatistics();

    setDashboardData({
      taskKPIs,
      modelKPIs,
      noteStats
    });
  }, [getTaskStatistics, getModelStatistics, getNoteStatistics]);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  return {
    ...dashboardData,
    refreshDashboard
  };
}
