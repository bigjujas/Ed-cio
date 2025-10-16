# 🚀 Como Executar o Sistema NAIKI

## Pré-requisitos
1. **MySQL** instalado e rodando
2. **Node.js** instalado
3. Criar banco `naiki_db` no MySQL

## Passos para Executar:

### 1. Configurar Banco de Dados
```sql
-- Execute o arquivo database.sql no MySQL
-- Ou crie manualmente:
CREATE DATABASE naiki_db;
```

### 2. Executar Backend e Frontend

**Opção 1 - Scripts Separados (Recomendado):**
```bash
# Terminal 1 - Backend
start-backend.bat

# Terminal 2 - Frontend  
start-frontend.bat
```

**Opção 2 - Manual:**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend  
npm start
```

### 3. Acessar o Sistema
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Admin:** admin@naiki.com / admin123

## ⚠️ Importante
- Execute SEMPRE o backend primeiro
- Aguarde o backend inicializar antes do frontend
- O banco será criado automaticamente na primeira execução