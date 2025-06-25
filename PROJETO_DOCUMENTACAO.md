# 📋 OnlyCat Command Center - Documentação Completa

## 🎯 Visão Geral do Projeto

O **OnlyCat Command Center** é uma aplicação web completa desenvolvida para gerenciar modelos, tarefas, notas e agendamentos para a plataforma OnlyFans. O sistema foi construído com foco em produtividade, organização e facilidade de uso.

### 🏗️ Arquitetura do Sistema

- **Frontend**: React 18 + TypeScript
- **Framework**: Vite (desenvolvimento rápido)
- **Backend**: Supabase (BaaS - Backend as a Service)
- **Banco de Dados**: PostgreSQL (via Supabase)
- **Autenticação**: Supabase Auth
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Estado Global**: React Query (@tanstack/react-query)
- **Roteamento**: React Router DOM v6

## 📁 Estrutura do Projeto

```
only-cat-command-center-main/
├── 📦 Configurações
│   ├── package.json              # Dependências e scripts
│   ├── vite.config.ts            # Configuração do Vite
│   ├── tailwind.config.ts        # Configuração do Tailwind CSS
│   ├── tsconfig.json             # Configuração TypeScript
│   ├── components.json           # Configuração shadcn/ui
│   └── eslint.config.js          # Configuração ESLint
│
├── 🌐 Frontend (src/)
│   ├── 📱 Páginas Principais
│   │   ├── Dashboard.tsx         # Dashboard principal
│   │   ├── auth/page.tsx         # Autenticação
│   │   ├── tasks/                # Módulo de Tarefas
│   │   ├── models/               # Módulo de Modelos
│   │   ├── notes/                # Módulo de Notas
│   │   └── admin/                # Painel Administrativo
│   │
│   ├── 🧩 Componentes
│   │   ├── layout/               # Layout principal
│   │   ├── ui/                   # Componentes UI base
│   │   ├── auth/                 # Componentes de autenticação
│   │   ├── tasks/                # Componentes de tarefas
│   │   ├── models/               # Componentes de modelos
│   │   ├── notes/                # Componentes de notas
│   │   ├── admin/                # Componentes administrativos
│   │   └── sidebar/              # Navegação lateral
│   │
│   ├── 🎣 Hooks Customizados
│   │   ├── auth/                 # Hooks de autenticação
│   │   ├── tasks/                # Hooks de tarefas
│   │   ├── models/               # Hooks de modelos
│   │   ├── notes/                # Hooks de notas
│   │   ├── sessions/             # Hooks de sessões
│   │   └── admin/                # Hooks administrativos
│   │
│   ├── 🔗 Integrações
│   │   └── supabase/
│   │       ├── client.ts         # Cliente Supabase
│   │       └── types.ts          # Tipos do banco de dados
│   │
│   └── 🛠️ Utilitários
│       └── lib/
│           ├── utils.ts          # Funções utilitárias
│           ├── database.ts       # Operações de banco
│           ├── queries.ts        # Queries otimizadas
│           └── types.ts          # Tipos compartilhados
│
└── 🗄️ Backend (supabase/)
    ├── config.toml               # Configuração Supabase
    ├── migrations/               # Migrações do banco
    └── functions/                # Funções serverless
        ├── log-admin-access/     # Log de acesso admin
        └── send-approval-notification/ # Notificações
```

## 🎨 Módulos Principais

### 1. 📊 Dashboard
- **Arquivo**: `src/pages/Dashboard.tsx`
- **Funcionalidades**:
  - Visão geral de KPIs
  - Estatísticas de tarefas, modelos e notas
  - Links rápidos para criação
  - Métricas de produtividade
  - Próximas sessões agendadas

### 2. 👤 Sistema de Autenticação
- **Pasta**: `src/components/auth/` e `src/hooks/auth/`
- **Funcionalidades**:
  - Login/Registro seguro
  - Sistema de aprovação de usuários
  - Controle de roles (admin/usuário)
  - Proteção de rotas
  - Cleanup automático de sessões

### 3. ✅ Gerenciamento de Tarefas
- **Pasta**: `src/components/tasks/` e `src/hooks/tasks/`
- **Funcionalidades**:
  - CRUD completo de tarefas
  - Estados: Todo, Em Progresso, Concluído
  - Sistema de timer integrado
  - Prioridades e deadlines
  - Checklist para subtarefas
  - Filtros e busca avançada

### 4. 👥 Gerenciamento de Modelos
- **Pasta**: `src/components/models/` e `src/hooks/models/`
- **Funcionalidades**:
  - Cadastro completo de modelos
  - Informações pessoais e profissionais
  - Upload de fotos e portfolio
  - Gerenciamento de plataformas
  - Sistema de agendamento
  - Estatísticas e avaliações

### 5. 📝 Sistema de Notas
- **Pasta**: `src/components/notes/` e `src/hooks/notes/`
- **Funcionalidades**:
  - Editor rich text
  - Categorização automática
  - Sistema de tags
  - Anexos e uploads
  - Busca full-text
  - Favoritos e organização

### 6. 🗓️ Agendamento de Sessões
- **Pasta**: `src/components/appointments/`
- **Funcionalidades**:
  - Agendamento de sessões
  - Recorrência de eventos
  - Notificações automáticas
  - Integração com modelos
  - Controle de pagamentos

### 7. 👨‍💼 Painel Administrativo
- **Pasta**: `src/components/admin/` e `src/hooks/admin/`
- **Funcionalidades**:
  - Aprovação de usuários
  - Relatórios e analytics
  - Configurações do sistema
  - Logs de auditoria
  - Notificações por email

## 🗃️ Estrutura do Banco de Dados

### Tabelas Principais

#### 👤 user_profiles
```sql
- id: string (PK)
- user_id: string (FK auth.users)
- email: string
- nome: string
- role: string ('admin' | 'user')
- status_conta: string ('aprovado' | 'pendente' | 'rejeitado')
- data_cadastro: timestamp
- data_aprovacao: timestamp
- aprovado_por: string
```

#### 👥 models
```sql
- id: string (PK)
- user_id: string (FK user_profiles)
- name: string
- artistic_name: string
- email: string
- phone: string
- bio: text
- age: integer
- status: string ('active' | 'inactive' | 'pending')
- photos: json
- platforms: json
- portfolio_images: json
- measurements: json (bust, waist, hips, height, weight, etc.)
- location: json (city, state, country)
- documents: json (cpf, rg)
```

#### ✅ tasks
```sql
- id: string (PK)
- user_id: string (FK user_profiles)
- title: string
- description: text
- status: string ('todo' | 'in_progress' | 'completed')
- priority: string ('low' | 'medium' | 'high')
- assignee: string
- platform: string
- deadline: timestamp
- time_estimate: integer (minutes)
- elapsed_time: integer (minutes)
- timer_status: string ('stopped' | 'running' | 'paused')
- timer_start_time: bigint
- checklist: json
```

#### 📝 notes
```sql
- id: string (PK)
- user_id: string (FK user_profiles)
- title: string
- content: text
- category: string
- model_id: string (FK models) [opcional]
- attachments: json
- attachment_url: string
```

#### 🗓️ model_sessions
```sql
- id: string (PK)
- user_id: string (FK user_profiles)
- model_id: string (FK models)
- title: string
- description: text
- date: date
- start_time: time
- end_time: time
- location: string
- meeting_link: string
- client_name: string
- client_contact: string
- payment: decimal
- status: string ('scheduled' | 'completed' | 'cancelled')
- rating: integer (1-5)
- notes: text
```

#### 🗓️ model_appointments
```sql
- id: string (PK)
- user_id: string (FK user_profiles)
- model_id: string (FK models)
- title: string
- date: date
- start_time: time
- end_time: time
- notes: text
- is_recurring: boolean
- recurrence_type: string
- recurrence_end: date
- attachment_url: string
```

#### 📂 categories & note_categories
```sql
- id: string (PK)
- user_id: string (FK user_profiles)
- name: string
- color: string
- description: text
- type: string
```

#### 🏷️ note_tags & note_tag_relations
```sql
note_tags:
- id: string (PK)
- user_id: string (FK user_profiles)
- name: string
- color: string

note_tag_relations:
- id: string (PK)
- user_id: string (FK user_profiles)
- note_id: string (FK notes)
- tag_id: string (FK note_tags)
```

#### ⭐ note_favorites
```sql
- id: string (PK)
- user_id: string (FK user_profiles)
- note_id: string (FK notes)
```

#### ⚙️ settings
```sql
- id: string (PK)
- user_id: string (FK user_profiles)
- theme: string ('light' | 'dark' | 'system')
- language: string
- notifications: boolean
- auto_save: boolean
- backup_frequency: string
```

#### 📋 audit_logs
```sql
- id: string (PK)
- actor_id: string
- actor_email: string
- action: string
- entity_type: string
- entity_id: string
- details: json
- created_at: timestamp
```

## 🔧 Tecnologias e Dependências

### 🎯 Frontend Core
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.5.3",
  "vite": "^5.4.1"
}
```

### 🎨 UI e Styling
```json
{
  "tailwindcss": "^3.4.11",
  "@radix-ui/react-*": "^1.x.x", // Componentes base
  "lucide-react": "^0.462.0",     // Ícones
  "class-variance-authority": "^0.7.1",
  "tailwind-merge": "^2.5.2",
  "tailwindcss-animate": "^1.0.7"
}
```

### 🌐 Backend e Estado
```json
{
  "@supabase/supabase-js": "^2.50.0",
  "@tanstack/react-query": "^5.56.2",
  "swr": "^2.3.3"
}
```

### 📝 Formulários e Validação
```json
{
  "react-hook-form": "^7.53.0",
  "@hookform/resolvers": "^3.9.0",
  "zod": "^3.23.8"
}
```

### 🛣️ Roteamento e Navegação
```json
{
  "react-router-dom": "^6.26.2"
}
```

### 📅 Utilitários
```json
{
  "date-fns": "^3.6.0",
  "lodash": "^4.17.21",
  "react-day-picker": "^8.10.1"
}
```

## 🔐 Sistema de Segurança

### Autenticação
- **Supabase Auth** para login/registro
- **Row Level Security (RLS)** no banco
- **JWT tokens** para sessões
- **Refresh tokens** automáticos

### Autorização
- **Sistema de roles**: admin, user
- **Proteção de rotas** baseada em roles
- **Aprovação manual** de novos usuários
- **Logs de auditoria** para ações sensíveis

### Validação
- **Schemas Zod** para validação client-side
- **Constraints** de banco para validação server-side
- **Sanitização** de inputs
- **Rate limiting** via Supabase

## 🚀 Funcionalidades Avançadas

### ⚡ Performance
- **React Query** para cache inteligente
- **Memoização** de componentes pesados
- **Lazy loading** de rotas
- **Índices otimizados** no banco
- **Paginação virtual** para listas grandes

### 📱 Responsividade
- **Mobile-first design**
- **Touch-friendly** interfaces
- **Adaptive layouts** para diferentes telas
- **Safe areas** para dispositivos móveis

### 🎨 UX/UI
- **Dark/Light mode** automático
- **Loading states** em todas as operações
- **Error boundaries** para recuperação
- **Toast notifications** para feedback
- **Skeleton loaders** durante carregamento

### 🔄 Tempo Real
- **Supabase Realtime** para atualizações live
- **Connection status** monitoring
- **Automatic reconnection**
- **Optimistic updates**

## 🏃‍♂️ Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ 
- npm ou bun
- Conta no Supabase

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd only-cat-command-center-main

# Instale as dependências
npm install
# ou
bun install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Execute as migrações (opcional - já aplicadas)
npx supabase db push

# Inicie o servidor de desenvolvimento
npm run dev
# ou
bun dev
```

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run build:dev # Build para desenvolvimento
npm run preview  # Preview do build
npm run lint     # Verificação de código
```

## 🔧 Configuração do Ambiente

O arquivo `.env` deve conter as seguintes variáveis:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://upgfoemhrqwvonboduao.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZ2ZvZW1ocnF3dm9uYm9kdWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMTM3NDYsImV4cCI6MjA2NTg4OTc0Nn0.36oAbqRcoKrxshag9H2zq0LzfMBm0Tu0UE44YYiEttw

# Environment
VITE_APP_ENV=development

# API Configuration  
VITE_API_URL=https://upgfoemhrqwvonboduao.supabase.co/rest/v1

# Upload Configuration
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=image/*,application/pdf,text/*

# Feature Flags
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_REALTIME=true

# UI Configuration
VITE_DEFAULT_THEME=system
VITE_DEFAULT_LANGUAGE=pt-BR
```

## 📊 Métricas e KPIs

### Dashboard Principal
- **Tarefas Ativas**: Todo + Em Progresso
- **Produtividade**: Taxa de conclusão
- **Tempo Investido**: Horas trabalhadas
- **Modelos Ativos**: Por status
- **Notas Criadas**: Por período
- **Próximas Sessões**: Agendamentos

### Relatórios Administrativos
- **Usuários por Status**: Aprovados/Pendentes
- **Atividade por Período**: Criações/Atualizações
- **Performance de Modelos**: Ratings/Sessões
- **Uso de Plataformas**: Distribuição
- **Logs de Auditoria**: Ações realizadas

## 🐛 Debugging e Logs

### Console Logs
O sistema utiliza logs estruturados:
```typescript
console.log('🎯 [Componente] Mensagem', dados);
console.error('❌ [Componente] Erro:', error);
console.warn('⚠️ [Componente] Aviso:', warning);
```

### Error Boundaries
Componentes protegidos por boundaries:
- `ErrorBoundary`: Captura erros React
- `TaskErrorBoundary`: Específico para tarefas
- `ErrorBoundaryWrapper`: Wrapper global

### Monitoring
- **Connection Status**: Status da conexão
- **Performance Monitor**: Métricas de performance
- **Realtime Status**: Status do realtime

## 🔄 Atualizações e Manutenção

### Versionamento
- **Semantic Versioning** (SemVer)
- **Changelog** detalhado
- **Migration scripts** para atualizações de banco

### Backup
- **Backup automático** via Supabase
- **Export/Import** de dados
- **Restore points** configuráveis

### Deploy
- **Build otimizado** para produção
- **Variáveis de ambiente** por ambiente
- **Health checks** automáticos

## 📞 Suporte e Contribuição

### Estrutura de Arquivos para Novos Recursos
1. Criar pasta no `components/` para UI
2. Criar hooks correspondentes em `hooks/`
3. Adicionar tipos em `lib/types.ts`
4. Criar migração se necessário
5. Atualizar documentação

### Convenções de Código
- **TypeScript** para type safety
- **Functional components** com hooks
- **Composition over inheritance**
- **Single responsibility principle**
- **Consistent naming conventions**

### Testes
- **Jest** para testes unitários
- **React Testing Library** para componentes
- **Cypress** para testes E2E (futuro)

---

## 📈 Roadmap Futuro

### Próximas Funcionalidades
- [ ] Sistema de notificações push
- [ ] Integração com calendários externos
- [ ] API para integrações externas
- [ ] Dashboard de analytics avançado
- [ ] Sistema de chat interno
- [ ] Automações personalizáveis

### Melhorias Técnicas
- [ ] PWA support
- [ ] Offline capabilities
- [ ] Advanced caching strategies
- [ ] Performance optimizations
- [ ] Accessibility improvements
- [ ] Internationalization (i18n)

---

*Documentação atualizada em: {{ new Date().toLocaleDateString('pt-BR') }}*
*Versão do projeto: 1.0.0* 