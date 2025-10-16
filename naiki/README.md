# NAIKI - Sistema de Loja de Tênis

Sistema completo de e-commerce de tênis inspirado na Nike, desenvolvido com Node.js (backend) e React (frontend).

## 🚀 Funcionalidades

### Para Clientes:
- ✅ Visualização de produtos em destaque, últimos cadastrados e melhores avaliados
- ✅ Sistema de busca e filtros por categoria, preço e avaliação
- ✅ Cadastro e login de clientes com UUID salvo no localStorage
- ✅ Detalhes completos do produto com interações (apenas para usuários logados)
- ✅ Sistema de avaliações, propostas, agendamentos e reservas
- ✅ Área do cliente para visualizar suas interações e respostas

### Para Administradores:
- ✅ Área restrita com login administrativo
- ✅ Dashboard com gráficos e visão geral do sistema
- ✅ Gerenciamento completo de produtos (cadastro, edição, listagem)
- ✅ Gerenciamento de interações dos clientes (responder, confirmar, excluir)

## 🛠️ Tecnologias Utilizadas

### Backend:
- Node.js + Express
- MySQL com mysql2
- JWT para autenticação
- bcryptjs para criptografia
- UUID para identificadores únicos
- CORS para comunicação frontend/backend

### Frontend:
- React 18
- React Router DOM para roteamento
- Axios para requisições HTTP
- Chart.js + react-chartjs-2 para gráficos
- Context API para gerenciamento de estado

## 📊 Estrutura do Banco de Dados

### Tabelas:
1. **administradores** - Usuários administrativos
2. **clientes** - Clientes do sistema
3. **produtos** - Catálogo de tênis (tabela principal)
4. **interacoes** - Avaliações, propostas, agendamentos e reservas

## 🚀 Como Executar

### Pré-requisitos:
- Node.js (v14+)
- MySQL
- npm ou yarn

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm start
```

### Configuração do Banco:
1. Crie um banco MySQL chamado `naiki_db`
2. O sistema criará as tabelas automaticamente na primeira execução
3. Admin padrão: `admin@naiki.com` / `admin123`

## 📱 Páginas e Rotas

### Públicas:
- `/` - Home com produtos em destaque
- `/produtos` - Catálogo com filtros
- `/produto/:id` - Detalhes do produto
- `/login` - Login de cliente
- `/cadastro` - Cadastro de cliente

### Área do Cliente (autenticado):
- `/minhas-interacoes` - Histórico de interações

### Área Administrativa:
- `/admin/login` - Login administrativo
- `/admin/dashboard` - Dashboard com gráficos
- `/admin/produtos` - Gerenciar produtos
- `/admin/interacoes` - Gerenciar interações

## 🎨 Características do Design

- Design responsivo inspirado na Nike
- Cores principais: Laranja (#ff6b35) e Preto
- Interface moderna com cards e modais
- Gráficos interativos no dashboard
- Sistema de avaliação com estrelas

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT
- Middleware de proteção de rotas
- Validação de dados no frontend e backend

## 📈 Dashboard Administrativo

- Estatísticas gerais (produtos, clientes, interações)
- Gráfico de interações por tipo (Doughnut)
- Gráfico de produtos mais avaliados (Bar)
- Ações rápidas para gerenciamento

## 🛒 Sistema de Interações

Os clientes podem:
- **Avaliar** produtos com nota e comentário
- **Fazer propostas** de preço
- **Agendar visitas** para experimentar
- **Reservar** produtos

Os administradores podem:
- Responder todas as interações
- Alterar status (pendente, respondida, confirmada, cancelada)
- Enviar emails de resposta (estrutura preparada)

## 🎯 Diferenciais

- Sistema UUID para identificação única
- LocalStorage para manter sessão
- Filtros avançados de produtos
- Dashboard com gráficos em tempo real
- Interface administrativa completa
- Sistema de interações robusto