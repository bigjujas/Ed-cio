import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  login: (email, senha) => api.post('/auth/login', { email, senha }),
  cadastro: (dados) => api.post('/auth/cadastro', dados),
  adminLogin: (email, senha) => api.post('/auth/admin/login', { email, senha }),
};

// Produtos
export const produtosAPI = {
  listar: (params) => api.get('/produtos', { params }),
  destaques: () => api.get('/produtos/destaques'),
  ultimos: () => api.get('/produtos/ultimos'),
  melhoresAvaliados: () => api.get('/produtos/melhores-avaliados'),
  detalhes: (id) => api.get(`/produtos/${id}`),
};

// Interações
export const interacoesAPI = {
  criar: (dados) => api.post('/interacoes', dados),
  minhas: () => api.get('/interacoes/minhas'),
};

// Admin
export const adminAPI = {
  dashboard: () => api.get('/admin/dashboard'),
  produtos: () => api.get('/admin/produtos'),
  criarProduto: (dados) => api.post('/admin/produtos', dados),
  atualizarProduto: (id, dados) => api.put(`/admin/produtos/${id}`, dados),
  deletarProduto: (id) => api.delete(`/admin/produtos/${id}`),
  interacoes: () => api.get('/admin/interacoes'),
  responderInteracao: (id, dados) => api.put(`/admin/interacoes/${id}/responder`, dados),
  deletarInteracao: (id) => api.delete(`/admin/interacoes/${id}`),
};

export default api;