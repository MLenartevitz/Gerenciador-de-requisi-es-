import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importação das rotas
import authRoute from './Routes/authRoutes.js';
import clienteRoute  from './Routes/clienteRoutes.js'; 
import empresaRoute  from './Routes/empresaRoutes.js'; 
import projetoRoute  from './Routes/projetoRoutes.js'; 
import requisicoesRoute from './Routes/requisicoesRoutes.js';
import fornecedoresRoute from './Routes/fornecedoresRoutes.js';
import requisicoesgridRoute from './Routes/requisicoesgridRoutes.js';
import produtoRoute from './Routes/produtoRoutes.js';

// Corrige a obtenção do caminho absoluto do diretório
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Rotas da aplicação
app.use('/api/auth', authRoute);
app.use('/api/cliente', clienteRoute); 
app.use('/api/empresa', empresaRoute); 
app.use('/api/projetos', projetoRoute);
app.use('/api/requisicoes', requisicoesRoute);
app.use('/api/fornecedores', fornecedoresRoute);
app.use('/api/requisicoesgrid', requisicoesgridRoute);
app.use('/api/produto', produtoRoute);

// Inicia o servidor
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
