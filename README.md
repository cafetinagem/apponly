# 🐱 OnlyCat Command Center

> **Sistema de Gestão Empresarial Ultra-Profissional**
> 
> Plataforma completa para gerenciamento de modelos, tarefas, notas e usuários com design clean e elegante.

![OnlyCat Command Center](https://img.shields.io/badge/OnlyCat-Command%20Center-F97316?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)

## ✨ **Características Principais**

### 🎯 **Módulos Completos**
- **📊 Dashboard**: Métricas em tempo real e visão geral do sistema
- **👥 Gestão de Modelos**: Cadastro, edição e acompanhamento de modelos
- **✅ Sistema de Tarefas**: Organização com fluxo A Fazer → Em Execução → Finalizadas
- **📝 Base de Conhecimento**: Sistema de notas com categorização e busca avançada
- **🛡️ Painel Administrativo**: Gestão de usuários, relatórios e configurações

### 🎨 **Design Ultra-Profissional**
- **Paleta Restrita**: Apenas 3 cores (#FFFFFF, #F3F5F7, #F97316)
- **Typography Refinada**: Inter font com peso otimizado
- **Dark Mode**: Ultra-minimalista sem poluição visual
- **Animações Elegantes**: Transições cubic-bezier profissionais
- **Responsivo**: Experiência perfeita em todos os dispositivos

### 🚀 **Tecnologias de Ponta**
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Shadcn/ui + Tailwind CSS + Lucide Icons
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Estado**: React Query + Custom Hooks
- **Formulários**: React Hook Form + Zod validation

## 🛠️ **Instalação e Configuração**

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta Supabase

### **1. Clone o Repositório**
```bash
git clone https://github.com/cafetinagem/onlyprojet.git
cd onlyprojet
```

### **2. Instale as Dependências**
```bash
npm install
```

### **3. Configure as Variáveis de Ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Configure suas credenciais Supabase
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### **4. Execute o Projeto**
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📱 **Funcionalidades Detalhadas**

### **🏠 Dashboard Principal**
- Cards de estatísticas em tempo real
- Fluxo de trabalho visual
- Lista de tarefas recentes
- Progresso de projetos

### **👥 Gerenciamento de Modelos**
- Cadastro completo com múltiplas plataformas
- Status tracking (Ativo, Pendente, Inativo)
- Estatísticas detalhadas
- Sistema de edição inline

### **✅ Sistema de Tarefas**
- Criação com prioridades e assignees
- Navegação por status
- Timer integrado
- Checklist de subtarefas

### **📝 Sistema de Notas**
- Editor rich text
- Categorização por cores
- Sistema de tags
- Busca avançada e filtros
- Anexos de arquivos

### **🛡️ Administração**
- Aprovação de usuários
- Relatórios avançados
- Analytics com gráficos
- Configurações de segurança

## 🎨 **Design System**

### **Cores Principais**
```css
--primary: #F97316    /* Laranja OnlyCat */
--background: #FFFFFF /* Branco puro */
--secondary: #F3F5F7  /* Cinza muito claro */
```

### **Classes Utilitárias**
```css
.card-elegant     /* Cards com hover e shadow refinados */
.btn-elegant      /* Botões com transições suaves */
.heading-elegant  /* Typography com spacing otimizado */
```

## 🔐 **Segurança**

- **Autenticação**: Supabase Auth com RLS
- **Autorização**: Role-based access control
- **Validação**: Zod schemas em todas as entradas
- **Sanitização**: DOMPurify para conteúdo HTML
- **Logs**: Auditoria completa de ações admin

## 📊 **Performance**

- **Bundle Size**: ~389KB gzipped
- **First Load**: < 2s
- **Lighthouse Score**: 95+ em todas as métricas
- **Real-time**: WebSocket com Supabase
- **Cache**: React Query com 5min stale time

## 🚀 **Deploy**

### **Vercel (Recomendado)**
```bash
# Conecte seu repositório GitHub
# Configure as variáveis de ambiente
# Deploy automático a cada push
```

### **Netlify**
```bash
npm run build
# Upload da pasta dist/
```

### **Docker**
```dockerfile
# Dockerfile incluído para containerização
docker build -t onlycat-command-center .
docker run -p 3000:3000 onlycat-command-center
```

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📝 **Roadmap**

### **v2.0 - Q1 2025**
- [ ] PWA completa com offline mode
- [ ] Push notifications
- [ ] Drag & drop interface
- [ ] Templates de tarefas
- [ ] Integração com calendários

### **v3.0 - Q2 2025**
- [ ] Multi-tenancy
- [ ] API pública
- [ ] White-label solution
- [ ] Advanced analytics
- [ ] Mobile app nativo

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙋‍♂️ **Suporte**

- **Documentação**: [Wiki do projeto](https://github.com/cafetinagem/onlyprojet/wiki)
- **Issues**: [GitHub Issues](https://github.com/cafetinagem/onlyprojet/issues)
- **Email**: cafetinagem@github.com

---

<div align="center">

**Feito com ❤️ pela equipe OnlyCat Brasil**

[🌐 Website](https://onlycat.com.br) • [📧 Email](mailto:cafetinagem@github.com) • [🐱 GitHub](https://github.com/cafetinagem)

</div>
