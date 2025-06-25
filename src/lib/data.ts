
import { Task, Model, Note, ModelSession } from './types';

// Dados Mock para Tarefas
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Criar conteúdo para Instagram',
    description: 'Desenvolver posts para a semana com foco em engagement',
    status: 'todo',
    priority: 'alta',
    platform: 'Instagram',
    assignee: 'executor',
    timeEstimate: 4,
    timeType: 'estimate',
    deadline: new Date('2024-06-25'),
    elapsedTime: 0,
    timerStatus: 'idle',
    checklist: [
      { id: '1', text: 'Definir tema dos posts', completed: false },
      { id: '2', text: 'Criar design', completed: false },
      { id: '3', text: 'Escrever legendas', completed: false }
    ],
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-06-20')
  },
  {
    id: '2',
    title: 'Sessão de fotos - Maria Silva',
    description: 'Sessão para portfólio no Privacy',
    status: 'in-progress',
    priority: 'alta',
    platform: 'Privacy',
    assignee: 'modelo',
    timeEstimate: 2,
    timeType: 'deadline',
    deadline: new Date('2024-06-21'),
    elapsedTime: 3600000, // 1 hora
    timerStatus: 'running',
    timerStartTime: Date.now() - 1800000, // 30 min atrás
    checklist: [
      { id: '1', text: 'Preparar equipamentos', completed: true },
      { id: '2', text: 'Realizar sessão', completed: false },
      { id: '3', text: 'Editar fotos', completed: false }
    ],
    createdAt: new Date('2024-06-19'),
    updatedAt: new Date('2024-06-21')
  },
  {
    id: '3',
    title: 'Análise de performance - Telegram',
    description: 'Revisar métricas e ajustar estratégia',
    status: 'done',
    priority: 'media',
    platform: 'Telegram',
    assignee: 'executor',
    timeEstimate: 3,
    timeType: 'estimate',
    elapsedTime: 7200000, // 2 horas
    timerStatus: 'idle',
    checklist: [
      { id: '1', text: 'Coletar dados', completed: true },
      { id: '2', text: 'Criar relatório', completed: true },
      { id: '3', text: 'Apresentar resultados', completed: true }
    ],
    createdAt: new Date('2024-06-18'),
    updatedAt: new Date('2024-06-20'),
    completedAt: new Date('2024-06-20')
  }
];

// Dados Mock para Modelos
export const mockModels: Model[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@example.com',
    phone: '+55 11 99999-9999',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    gender: 'female',
    birthDate: '1999-05-15',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    height: '1.70',
    weight: '55',
    bust: '90',
    waist: '60',
    hips: '90',
    shoes: '37',
    hair: 'Castanho',
    eyes: 'Castanhos',
    ethnicity: 'Branca',
    notes: 'Modelo experiente',
    photos: [],
    artisticName: 'Mari Beauty',
    bio: 'Modelo profissional especializada em conteúdo lifestyle e fashion',
    age: 25,
    status: 'active',
    platforms: [
      {
        id: '1',
        type: 'instagram',
        name: 'Mari Beauty Instagram',
        username: '@maribeauty',
        email: 'mari.beauty@gmail.com'
      },
      {
        id: '2',
        type: 'privacy',
        name: 'Mari Privacy',
        username: 'marisilva',
        email: 'mari@privacy.com'
      }
    ],
    portfolioImages: [
      {
        id: '1',
        url: '/placeholder.svg',
        title: 'Sessão Fashion',
        featured: true
      },
      {
        id: '2',
        url: '/placeholder.svg',
        title: 'Lifestyle',
        featured: false
      }
    ],
    description: 'Modelo profissional especializada em conteúdo lifestyle e fashion',
    category: 'Influencer',
    contactEmail: 'maria@example.com',
    contactPhone: '+55 11 99999-9999',
    profileImageUrl: '/placeholder.svg',
    likes: 150,
    views: 1250,
    comments: [],
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-06-20')
  },
  {
    id: '2',
    name: 'Ana Costa',
    email: 'ana@example.com',
    phone: '+55 11 88888-8888',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'Brasil',
    gender: 'female',
    birthDate: '1996-03-10',
    cpf: '987.654.321-00',
    rg: '98.765.432-1',
    height: '1.65',
    weight: '52',
    bust: '85',
    waist: '58',
    hips: '88',
    shoes: '36',
    hair: 'Loiro',
    eyes: 'Azuis',
    ethnicity: 'Branca',
    notes: 'Especialista em beauty',
    photos: [],
    artisticName: 'Ana Luxe',
    bio: 'Criadora de conteúdo focada em beleza e wellness',
    age: 28,
    status: 'active',
    platforms: [
      {
        id: '3',
        type: 'telegram',
        name: 'Ana Luxe Channel',
        username: '@analuxe'
      }
    ],
    portfolioImages: [
      {
        id: '3',
        url: '/placeholder.svg',
        title: 'Beauty Session',
        featured: true
      }
    ],
    description: 'Criadora de conteúdo focada em beleza e wellness',
    category: 'Streamer',
    contactEmail: 'ana@example.com',
    contactPhone: '+55 11 88888-8888',
    profileImageUrl: '/placeholder.svg',
    likes: 89,
    views: 750,
    comments: [],
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-06-19')
  }
];

// Dados Mock para Sessões
export const mockSessions: ModelSession[] = [
  {
    id: '1',
    modelId: '1',
    title: 'Sessão Fotográfica Privacy',
    description: 'Sessão especial para conteúdo premium',
    date: new Date('2024-06-22'),
    startTime: '14:00',
    endTime: '16:00',
    location: 'Estúdio Central',
    meetingLink: 'https://meet.google.com/abc-def-ghi',
    sessionType: 'Fotografia',
    status: 'scheduled',
    clientName: 'Cliente Premium',
    clientContact: 'cliente@example.com',
    payment: 500,
    createdAt: new Date('2024-06-20')
  },
  {
    id: '2',
    modelId: '2',
    title: 'Call de Planejamento',
    description: 'Discussão sobre próximas campanhas',
    date: new Date('2024-06-21'),
    startTime: '10:00',
    endTime: '11:00',
    location: 'Online',
    meetingLink: 'https://zoom.us/j/123456789',
    sessionType: 'Reunião',
    status: 'scheduled',
    createdAt: new Date('2024-06-19')
  }
];

// Dados Mock para Notas
export const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Performance no Instagram',
    modelId: '1',
    content: 'Observações sobre a performance no Instagram: engagement crescendo 15% na última semana. Focar em conteúdo de stories.',
    category: 'Performance',
    attachments: [],
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-06-20')
  },
  {
    id: '2',
    title: 'Ideias para Campanha de Verão',
    modelId: '1',
    content: 'Ideias para próxima campanha:\n\n• Tema: Verão e lifestyle\n• Cores: tons pastéis\n• Local: praia ou piscina\n• Props: óculos, chapéu, bebidas tropicais',
    category: 'Ideias',
    attachments: [
      {
        id: '1',
        name: 'referencias-verao.pdf',
        url: '/placeholder.svg',
        type: 'application/pdf',
        size: 1024000,
        uploadedAt: new Date('2024-06-20')
      }
    ],
    createdAt: new Date('2024-06-19'),
    updatedAt: new Date('2024-06-20')
  },
  {
    id: '3',
    title: 'Briefing Sessão Privacy',
    content: 'Briefing da sessão de amanhã:\n\n**Objetivo:** Conteúdo para Privacy\n**Estilo:** Elegante e sofisticado\n**Roupas:** Lingerie preta e branca\n**Iluminação:** Soft e dramática',
    category: 'Briefing',
    attachments: [],
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-06-20')
  }
];
