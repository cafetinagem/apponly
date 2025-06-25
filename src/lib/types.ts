// Tipos para o Gestor de Tarefas
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'baixa' | 'media' | 'alta';
  platform?: string;
  assignee: 'executor' | 'modelo';
  timeEstimate?: number; // em horas
  timeType: 'estimate' | 'deadline';
  deadline?: Date;
  elapsedTime: number; // em milliseconds
  timerStatus: 'idle' | 'running' | 'paused';
  timerStartTime?: number;
  checklist: ChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

// Tipos para Gerenciamento de Modelos
export interface Model {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  country?: string;
  gender?: 'female' | 'male' | 'other';
  birthDate?: string;
  cpf?: string;
  rg?: string;
  height?: string;
  weight?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  shoes?: string;
  hair?: string;
  eyes?: string;
  ethnicity?: string;
  notes?: string;
  photos?: string[];
  artisticName?: string;
  bio?: string;
  age?: number;
  status: 'active' | 'inactive' | 'pending';
  platforms: ModelPlatform[];
  portfolioImages: PortfolioImage[];
  // Additional properties for the models page
  description: string;
  category: string;
  contactEmail: string;
  contactPhone: string;
  profileImageUrl?: string;
  likes: number;
  views: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
}

export interface ModelPlatform {
  id: string;
  type: 'instagram' | 'telegram' | 'privacy' | 'onlyfans' | 'chaturbate';
  name: string;
  username?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
}

export interface PortfolioImage {
  id: string;
  url: string;
  title?: string;
  featured: boolean;
}

export interface ModelSession {
  id: string;
  modelId: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime?: string;
  location: string;
  meetingLink?: string;
  sessionType?: string;
  status: 'scheduled' | 'completed' | 'canceled' | 'in-progress';
  clientName?: string;
  clientContact?: string;
  payment?: number;
  rating?: number;
  notes?: string;
  createdAt: Date;
}

// Tipos para Sistema de Notas
export interface Note {
  id: string;
  title: string;
  modelId?: string;
  content: string;
  category: string;
  attachments: NoteAttachment[];
  attachmentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

// Tipos para KPIs e Estatísticas (sem receita total)
export interface TaskKPIs {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  averageCompletionTime: number;
  totalTimeSpent: number;
  productivityScore: number;
}

export interface ModelKPIs {
  totalModels: number;
  activeModels: number;
  totalSessions: number;
  upcomingSessions: number;
  averageRating: number;
}

// Tipos adicionais para o banco de dados
export interface DatabaseBackup {
  tasks: Task[];
  models: Model[];
  sessions: ModelSession[];
  notes: Note[];
  exportDate: Date;
  version: string;
}

export interface SystemMetrics {
  totalUsers: number;
  activeModels: number;
  completedTasks: number;
  totalSessions: number;
  systemUptime: number;
  lastBackup?: Date;
}
