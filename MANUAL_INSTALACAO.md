# 🚀 Manual de Instalação - OnlyCat Command Center

## 📋 Pré-requisitos

### Sistema Operacional
- **Windows 10/11**, **macOS 10.15+** ou **Linux Ubuntu 18.04+**

### Software Necessário
- **Node.js 18.0+** ([Download](https://nodejs.org/))
- **npm** (incluído com Node.js) ou **Bun** ([Download](https://bun.sh/))
- **Git** ([Download](https://git-scm.com/))
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Contas Necessárias
- **Conta no Supabase** ([Criar conta](https://supabase.com/))

## 📥 Instalação

### 1. Clone o Repositório
```bash
# Clone o projeto
git clone <repository-url>
cd only-cat-command-center-main
```

### 2. Instale as Dependências
```bash
# Usando npm
npm install

# OU usando Bun (mais rápido)
bun install
```

### 3. Configure as Variáveis de Ambiente
```bash
# Copie o arquivo de configuração
cp env-config.md .env

# Edite o arquivo .env com suas credenciais
# Use seu editor favorito (VSCode, Sublime, etc.)
code .env
```

**Configuração mínima necessária:**
```env
VITE_SUPABASE_URL=https://upgfoemhrqwvonboduao.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZ2ZvZW1ocnF3dm9uYm9kdWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMTM3NDYsImV4cCI6MjA2NTg4OTc0Nn0.36oAbqRcoKrxshag9H2zq0LzfMBm0Tu0UE44YYiEttw
VITE_APP_ENV=development
```

### 4. Inicie o Servidor de Desenvolvimento
```bash
# Usando npm
npm run dev

# OU usando Bun
bun dev
```

### 5. Acesse a Aplicação
Abra seu navegador e acesse: `http://localhost:8080`

## 🎯 Primeiro Uso

### 1. Criar Conta de Usuário
1. Acesse a aplicação
2. Clique em "Criar Conta"
3. Preencha seus dados (email e senha)
4. Aguarde aprovação do administrador

### 2. Login de Administrador
**Usuário padrão do sistema:**
- Email: `admin@onlycat.com.br`
- Senha: `OnlyCat2024!`

### 3. Aprovação de Usuários
1. Faça login como administrador
2. Acesse "Admin" → "Usuários"
3. Aprove novos usuários

## 🔧 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build:dev    # Build para desenvolvimento
npm run preview      # Preview do build
```

### Produção
```bash
npm run build        # Build otimizado para produção
npm run lint         # Verificação de código
```

### Utilitários
```bash
# Limpar cache
rm -rf node_modules .vite
npm install

# Verificar dependências outdated
npm outdated

# Atualizar dependências
npm update
```

## 🗄️ Configuração do Banco de Dados

### Opção 1: Usar Supabase Hospedado (Recomendado)
As migrações já estão aplicadas no banco configurado.

### Opção 2: Supabase Local (Desenvolvimento)
```bash
# Instalar Supabase CLI
npm install -g @supabase/cli

# Iniciar Supabase local
supabase start

# Aplicar migrações
supabase db push

# Atualizar .env com URLs locais
# VITE_SUPABASE_URL=http://localhost:54321
# VITE_API_URL=http://localhost:54321/rest/v1
```

## 🎨 Funcionalidades Principais

### 📊 Dashboard
- **URL**: `/`
- **Funcionalidades**: Visão geral, KPIs, estatísticas

### 👥 Gerenciamento de Modelos
- **URL**: `/models`
- **Funcionalidades**: 
  - Cadastrar novo modelo
  - Editar informações
  - Upload de fotos
  - Gerenciar plataformas

### ✅ Gerenciamento de Tarefas
- **URL**: `/tasks`
- **Funcionalidades**:
  - Criar/editar tarefas
  - Sistema de timer
  - Categorias por status
  - Filtros e busca

### 📝 Sistema de Notas
- **URL**: `/notes`
- **Funcionalidades**:
  - Editor rich text
  - Categorização
  - Sistema de tags
  - Upload de anexos

### 🗓️ Agendamento
- **URL**: `/models/scheduling`
- **Funcionalidades**:
  - Agendar sessões
  - Eventos recorrentes
  - Notificações

### 👨‍💼 Painel Admin
- **URL**: `/admin`
- **Funcionalidades**:
  - Aprovar usuários
  - Relatórios
  - Configurações
  - Logs de auditoria

## 🔐 Sistema de Permissões

### Níveis de Acesso
1. **Usuário Regular**: Acesso a funcionalidades básicas
2. **Administrador**: Acesso completo + painel admin

### Fluxo de Aprovação
1. Usuário se registra
2. Status inicial: "Pendente"
3. Admin aprova/rejeita
4. Status atualizado: "Aprovado"/"Rejeitado"

## 📱 Responsividade

### Dispositivos Suportados
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 375px - 767px

### Funcionalidades Mobile
- Menu lateral colapsável
- Touch-friendly interfaces
- Otimização para telas pequenas

## 🔧 Solução de Problemas

### Erro de Conexão com Supabase
```bash
# Verificar variáveis de ambiente
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Verificar conectividade
ping upgfoemhrqwvonboduao.supabase.co
```

### Problemas de Performance
```bash
# Limpar cache do Vite
rm -rf .vite

# Reiniciar servidor
npm run dev
```

### Erro de Dependências
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Problemas de CORS
- Verificar configuração do Supabase
- Adicionar domínio nas configurações do projeto

## 📊 Monitoramento

### Logs de Desenvolvimento
```bash
# Logs em tempo real
npm run dev

# Verificar logs do browser
F12 → Console
```

### Métricas de Performance
- **Lighthouse** para auditoria
- **React DevTools** para debugging
- **Supabase Dashboard** para métricas de DB

## 🚀 Deploy para Produção

### Preparação
```bash
# Build para produção
npm run build

# Testar build local
npm run preview
```

### Variáveis de Produção
```env
VITE_APP_ENV=production
VITE_ENABLE_DEBUG=false
VITE_CONSOLE_LOGS=false
VITE_ENABLE_ANALYTICS=true
```

### Plataformas Recomendadas
- **Vercel**: Deploy automático com Git
- **Netlify**: Deploy simples e rápido
- **AWS S3 + CloudFront**: Para escala enterprise

## 📞 Suporte

### Documentação
- **Técnica**: `PROJETO_DOCUMENTACAO.md`
- **Ambiente**: `env-config.md`
- **Este manual**: `MANUAL_INSTALACAO.md`

### Logs Importantes
```bash
# Verificar status da aplicação
npm run dev

# Logs do Supabase
# Acesse: https://app.supabase.com/project/upgfoemhrqwvonboduao/logs
```

### Debugging
1. **F12** para abrir DevTools
2. **Console** para verificar erros
3. **Network** para verificar requisições
4. **Application** para verificar localStorage

## ✅ Checklist de Instalação

- [ ] Node.js 18+ instalado
- [ ] Projeto clonado
- [ ] Dependências instaladas
- [ ] Arquivo `.env` configurado
- [ ] Servidor iniciado (`npm run dev`)
- [ ] Aplicação acessível em localhost:8080
- [ ] Login funcionando
- [ ] Dashboard carregando

## 🎯 Próximos Passos

Após a instalação:
1. **Explorar o Dashboard** para entender as funcionalidades
2. **Criar alguns modelos** para testar o sistema
3. **Configurar tarefas** para organizar o workflow
4. **Explorar o sistema de notas** para documentação
5. **Usar o agendamento** para marcar sessões

---

*Manual atualizado em: Dezembro 2024*
*Versão: 1.0.0* 