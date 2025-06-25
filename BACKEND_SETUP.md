# 🚀 OnlyCat Command Center - Backend Setup

## 📋 CONFIGURAÇÃO COMPLETA DO BACKEND

### 🎯 **STATUS DO SISTEMA**
- ✅ **Supabase**: Totalmente configurado e conectado
- ✅ **Banco de Dados**: 13 migrações aplicadas
- ✅ **Realtime**: Habilitado em todas as tabelas
- ✅ **Edge Functions**: 2 funções implementadas
- ✅ **RLS (Row Level Security)**: Implementado
- ✅ **Autenticação**: Sistema completo
- ✅ **Admin System**: Sistema administrativo funcional

---

## 🗃️ **ESTRUTURA DO BANCO DE DADOS**

### **Tabelas Principais**
1. **`tasks`** - Gerenciamento de tarefas
2. **`models`** - Cadastro de modelos
3. **`model_sessions`** - Sessões e agendamentos
4. **`notes`** - Sistema de notas
5. **`note_categories`** - Categorias de notas
6. **`note_favorites`** - Favoritos
7. **`categories`** - Categorias gerais
8. **`settings`** - Configurações do usuário
9. **`user_profiles`** - Perfis e aprovação de usuários
10. **`audit_logs`** - Logs de auditoria

### **Funcionalidades Avançadas**
- **RLS completo** em todas as tabelas
- **Índices otimizados** para performance
- **Triggers** para updated_at automático
- **Full-text search** em português
- **JSON fields** para dados complexos
- **Políticas de segurança** robustas

---

## ⚡ **EDGE FUNCTIONS**

### **1. log-admin-access**
```typescript
// Logs de auditoria para acesso administrativo
supabase.functions.invoke('log-admin-access', {
  body: { email, userId, timestamp, userAgent, ip }
});
```

### **2. send-approval-notification**
```typescript
// Notificações de aprovação de usuários
supabase.functions.invoke('send-approval-notification', {
  body: { email, name }
});
```

---

## 🔐 **SISTEMA DE AUTENTICAÇÃO**

### **Fluxo de Usuários**
1. **Cadastro** → Status "pendente"
2. **Aprovação Admin** → Status "aprovado"
3. **Acesso Total** → Todas as funcionalidades

### **Níveis de Acesso**
- **👤 Usuário Regular**: CRUD próprios dados
- **👑 Admin** (`onlycatbrasil@gmail.com`): Acesso total
- **🔒 Rejeitado**: Acesso negado

### **Políticas RLS**
```sql
-- Exemplo de política
CREATE POLICY "Users can view their own tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (auth.uid() = user_id);
```

---

## 📡 **REALTIME & SUBSCRIPTIONS**

### **Tabelas com Realtime**
- ✅ tasks, models, model_sessions
- ✅ notes, note_categories, note_favorites
- ✅ categories, settings, user_profiles

### **Configuração Automática**
```javascript
// Configuração no ConnectionManager
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
```

---

## 🛠️ **COMANDOS DE CONFIGURAÇÃO**

### **1. Configurar Backend Completo**
```bash
node setup-backend.js
```

### **2. Verificar Status**
```bash
npm run dev
# Abrir: http://localhost:8080
```

### **3. Desenvolver**
```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run preview  # Preview build
```

---

## 🔧 **CONFIGURAÇÕES IMPORTANTES**

### **URLs do Sistema**
- **Frontend**: http://localhost:8080
- **Dashboard**: http://localhost:8080/
- **Admin Panel**: http://localhost:8080/admin
- **Autenticação**: http://localhost:8080/auth
- **Supabase Dashboard**: https://supabase.com/dashboard/project/upgfoemhrqwvonboduao

### **Credenciais**
- **Supabase URL**: https://upgfoemhrqwvonboduao.supabase.co
- **Admin Email**: onlycatbrasil@gmail.com
- **Project ID**: upgfoemhrqwvonboduao

---

## 📊 **OTIMIZAÇÕES DE PERFORMANCE**

### **Índices Implementados**
```sql
-- Consultas por usuário
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_user_status ON public.tasks(user_id, status);

-- Full-text search
CREATE INDEX idx_notes_content_search 
  ON public.notes USING gin(to_tsvector('portuguese', content));

-- Consultas compostas
CREATE INDEX idx_tasks_user_status_created 
  ON public.tasks(user_id, status, created_at DESC);
```

### **Query Optimization**
- **React Query** com cache de 5 minutos
- **Debounced search** com 300ms delay
- **Pagination** com limite de 50 registros
- **Lazy loading** em componentes pesados

---

## 🔍 **MONITORAMENTO & DEBUG**

### **Logs do Sistema**
```javascript
// Logger configurado
logger.info('Component', 'Message');
logger.warn('Component', 'Warning');
logger.error('Component', 'Error');
```

### **Performance Monitor**
```javascript
// Monitora renders lentos
const monitor = usePerformanceMonitor('ComponentName', true);
```

### **Realtime Debug**
```javascript
// Console do navegador
window.realtimeDebug(); // Ver conexões ativas
```

---

## ⚠️ **TROUBLESHOOTING**

### **Problemas Comuns**

**1. Erro de Conexão**
```bash
# Verificar conexão
node setup-backend.js
```

**2. RLS Negando Acesso**
```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'tasks';
```

**3. Realtime Não Funcionando**
```javascript
// Verificar subscription
const channel = supabase.channel('test');
```

**4. Performance Lenta**
```sql
-- Verificar índices
SELECT * FROM pg_indexes WHERE tablename = 'tasks';
```

---

## 🎉 **PRÓXIMOS PASSOS**

### **Para Desenvolvimento**
1. ✅ Backend totalmente configurado
2. ✅ Execute `npm run dev`
3. ✅ Acesse http://localhost:8080
4. ✅ Faça login ou cadastre-se
5. ✅ Admin: use onlycatbrasil@gmail.com

### **Para Produção**
1. Configure variáveis de ambiente
2. Execute `npm run build`
3. Deploy para hosting (Vercel/Netlify)
4. Configure domínio personalizado

---

## 📞 **SUPORTE TÉCNICO**

### **Arquivos Importantes**
- `setup-backend.js` - Script de configuração
- `src/integrations/supabase/client.ts` - Cliente Supabase
- `supabase/migrations/` - Todas as migrações
- `src/hooks/` - Hooks de integração

### **Comandos de Emergência**
```bash
# Reset completo
node setup-backend.js

# Verificar logs
npm run dev

# Build de produção
npm run build
```

---

**🎯 STATUS: ✅ BACKEND 100% OPERACIONAL**

O sistema está completamente configurado e pronto para uso imediato! 