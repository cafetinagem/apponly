# 🔧 Configuração de Variáveis de Ambiente

## Arquivo `.env` necessário

Para executar o projeto, você precisa criar um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# ==============================================
# OnlyCat Command Center - Environment Variables
# ==============================================

# Supabase Configuration
# --------------------------------------------
VITE_SUPABASE_URL=https://upgfoemhrqwvonboduao.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZ2ZvZW1ocnF3dm9uYm9kdWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMTM3NDYsImV4cCI6MjA2NTg4OTc0Nn0.36oAbqRcoKrxshag9H2zq0LzfMBm0Tu0UE44YYiEttw

# Environment Configuration
# --------------------------------------------
VITE_APP_ENV=development
VITE_APP_NAME="OnlyCat Command Center"
VITE_APP_VERSION=1.0.0

# API Configuration  
# --------------------------------------------
VITE_API_URL=https://upgfoemhrqwvonboduao.supabase.co/rest/v1
VITE_API_TIMEOUT=30000

# Upload Configuration
# --------------------------------------------
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=image/*,application/pdf,text/*,video/*
VITE_MAX_FILES_PER_UPLOAD=5

# Feature Flags
# --------------------------------------------
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_REALTIME=true
VITE_ENABLE_FILE_UPLOAD=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ADMIN_PANEL=true

# UI Configuration
# --------------------------------------------
VITE_DEFAULT_THEME=system
VITE_DEFAULT_LANGUAGE=pt-BR
VITE_SIDEBAR_DEFAULT_OPEN=false

# Performance Configuration
# --------------------------------------------
VITE_QUERY_STALE_TIME=300000
VITE_QUERY_CACHE_TIME=600000
VITE_PAGINATION_DEFAULT_SIZE=20
VITE_SEARCH_DEBOUNCE_MS=300

# Security Configuration
# --------------------------------------------
VITE_SESSION_TIMEOUT=3600000
VITE_AUTO_LOGOUT_WARNING=300000
VITE_MAX_LOGIN_ATTEMPTS=5

# Development Configuration
# --------------------------------------------
VITE_DEV_TOOLS=true
VITE_CONSOLE_LOGS=true
VITE_ERROR_REPORTING=true

# Notification Configuration
# --------------------------------------------
VITE_TOAST_DURATION=5000
VITE_NOTIFICATION_POSITION=bottom-right

# Timer Configuration
# --------------------------------------------
VITE_TIMER_UPDATE_INTERVAL=1000
VITE_TIMER_AUTO_SAVE_INTERVAL=30000

# Search Configuration
# --------------------------------------------
VITE_SEARCH_MIN_CHARS=2
VITE_SEARCH_MAX_RESULTS=50

# Backup Configuration
# --------------------------------------------
VITE_AUTO_SAVE_INTERVAL=60000
VITE_BACKUP_RETENTION_DAYS=30

# ==============================================
# Production Overrides (uncomment for production)
# ==============================================

# VITE_APP_ENV=production
# VITE_ENABLE_DEBUG=false
# VITE_CONSOLE_LOGS=false
# VITE_DEV_TOOLS=false
# VITE_ENABLE_ANALYTICS=true

# ==============================================
# Local Development Overrides
# ==============================================

# VITE_API_URL=http://localhost:54321/rest/v1
# VITE_SUPABASE_URL=http://localhost:54321
```

## 📋 Descrição das Variáveis

### 🔗 Supabase
- `VITE_SUPABASE_URL`: URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY`: Chave pública do Supabase

### 🎯 Aplicação
- `VITE_APP_ENV`: Ambiente da aplicação (development/production)
- `VITE_APP_NAME`: Nome da aplicação
- `VITE_APP_VERSION`: Versão atual

### 🌐 API
- `VITE_API_URL`: URL base da API REST
- `VITE_API_TIMEOUT`: Timeout das requisições (ms)

### 📤 Upload
- `VITE_MAX_FILE_SIZE`: Tamanho máximo de arquivo (bytes)
- `VITE_ALLOWED_FILE_TYPES`: Tipos de arquivo permitidos
- `VITE_MAX_FILES_PER_UPLOAD`: Máximo de arquivos por upload

### 🎛️ Feature Flags
- `VITE_ENABLE_DEBUG`: Ativa logs de debug
- `VITE_ENABLE_ANALYTICS`: Ativa analytics
- `VITE_ENABLE_REALTIME`: Ativa atualizações em tempo real
- `VITE_ENABLE_FILE_UPLOAD`: Ativa upload de arquivos
- `VITE_ENABLE_NOTIFICATIONS`: Ativa notificações
- `VITE_ENABLE_ADMIN_PANEL`: Ativa painel administrativo

### 🎨 Interface
- `VITE_DEFAULT_THEME`: Tema padrão (light/dark/system)
- `VITE_DEFAULT_LANGUAGE`: Idioma padrão
- `VITE_SIDEBAR_DEFAULT_OPEN`: Sidebar aberta por padrão

### ⚡ Performance
- `VITE_QUERY_STALE_TIME`: Tempo de cache (ms)
- `VITE_QUERY_CACHE_TIME`: Tempo de retenção em cache (ms)
- `VITE_PAGINATION_DEFAULT_SIZE`: Itens por página
- `VITE_SEARCH_DEBOUNCE_MS`: Delay da busca (ms)

### 🔐 Segurança
- `VITE_SESSION_TIMEOUT`: Timeout da sessão (ms)
- `VITE_AUTO_LOGOUT_WARNING`: Aviso antes do logout (ms)
- `VITE_MAX_LOGIN_ATTEMPTS`: Tentativas máximas de login

### 🔧 Desenvolvimento
- `VITE_DEV_TOOLS`: Ativa ferramentas de desenvolvimento
- `VITE_CONSOLE_LOGS`: Ativa logs no console
- `VITE_ERROR_REPORTING`: Ativa relatório de erros

### 🔔 Notificações
- `VITE_TOAST_DURATION`: Duração das notificações (ms)
- `VITE_NOTIFICATION_POSITION`: Posição das notificações

### ⏱️ Timer
- `VITE_TIMER_UPDATE_INTERVAL`: Intervalo de atualização do timer (ms)
- `VITE_TIMER_AUTO_SAVE_INTERVAL`: Intervalo do auto-save (ms)

### 🔍 Busca
- `VITE_SEARCH_MIN_CHARS`: Caracteres mínimos para busca
- `VITE_SEARCH_MAX_RESULTS`: Resultados máximos da busca

### 💾 Backup
- `VITE_AUTO_SAVE_INTERVAL`: Intervalo do auto-save (ms)
- `VITE_BACKUP_RETENTION_DAYS`: Dias de retenção do backup

## 🚀 Como criar o arquivo

1. Crie um arquivo chamado `.env` na raiz do projeto
2. Copie o conteúdo acima
3. Ajuste os valores conforme necessário
4. Salve o arquivo

## ⚠️ Importante

- O arquivo `.env` não deve ser commitado no Git
- Para produção, altere `VITE_APP_ENV=production`
- Para desenvolvimento local com Supabase local, use as URLs localhost comentadas 