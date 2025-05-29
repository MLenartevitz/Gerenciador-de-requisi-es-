import express from 'express';
import multer from 'multer';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const prisma = new PrismaClient();

const uploadPath = path.join(__dirname, '..', 'uploads', 'pendentes');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/upload', upload.single('arquivoCotacao'), async (req, res) => {
  try {
    const {
      nomeFornecedor,
      localCotacao,
      cod_proj,
      cod_requisicao,
      cod_proj_from_requisicao
    } = req.body;

    if (!req.file || !nomeFornecedor || !localCotacao || (!cod_proj && !cod_requisicao)) {
      return res.status(400).json({
        message: 'Preencha todos os campos obrigatórios e envie um arquivo.'
      });
    }

    // Pega projeto direto ou via requisição
    const projetoId = cod_proj
      ? Number(cod_proj)
      : cod_proj_from_requisicao
        ? Number(cod_proj_from_requisicao)
        : null;

    const requisicaoId = cod_requisicao ? Number(cod_requisicao) : null;

    if (projetoId && isNaN(projetoId)) {
      return res.status(400).json({ message: 'ID do projeto inválido.' });
    }

    if (requisicaoId && isNaN(requisicaoId)) {
      return res.status(400).json({ message: 'Número da requisição inválido.' });
    }

    const cotacao = await prisma.cotacoes.create({
      data: {
        nomeFornecedor,
        localCotacao,
        nomeArquivo: req.file.filename,
        status: 'pendente',
        projetoId,       // pode ser null
        requisicaoId,    // pode ser null
      },
    });

    res.status(200).json({ message: 'Cotação enviada com sucesso.', cotacao });

  } catch (error) {
    console.error('Erro ao enviar cotação:', error);
    res.status(500).json({ message: 'Erro ao enviar cotação.', error: error.message });
  }
});

router.put('/aprovar/:id', async (req, res) => {
  const { usuario } = req.body;
  const { id } = req.params;

  if (!usuario) {
    return res.status(400).json({ message: 'Nome do usuário não fornecido.' });
  }

  try {
    const cotacao = await prisma.cotacoes.update({
      where: { id: Number(id) },
      data: {
        status: 'aprovado',
        aprovadoPor: usuario,
        dataAprovacao: new Date(),
      },
    });

    res.status(200).json({ message: 'Cotação aprovada.', cotacao });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao aprovar.', error: error.message });
  }
});

router.put('/recusar/:id', async (req, res) => {
  const { usuario, motivoRecusa } = req.body;
  const { id } = req.params;

  if (!usuario || !motivoRecusa) {
    return res.status(400).json({ message: 'Usuário e motivo da recusa são obrigatórios.' });
  }

  try {
    const cotacao = await prisma.cotacoes.update({
      where: { id: Number(id) },
      data: {
        status: 'recusado',
        recusadoPor: usuario,
        dataRecusa: new Date(),
        motivorec: motivoRecusa,
      },
    });

    res.status(200).json({ message: 'Cotação recusada.', cotacao });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao recusar.', error: error.message });
  }
});

router.get('/listar', async (req, res) => {
  const { cod_proj, num_requisicao, status } = req.query;

  try {
    let filtro = {};

    if (cod_proj) filtro.projetoId = Number(cod_proj);
    if (num_requisicao) filtro.requisicaoId = Number(num_requisicao);
    if (status) filtro.status = status;  // Filtro pelo status, se fornecido

    const cotacoes = await prisma.cotacoes.findMany({
      where: filtro,
      include: { projeto: true, requisicoes: true },
      orderBy: { dataEnvio: 'desc' },
    });

    res.status(200).json(cotacoes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar cotações.', error: error.message });
  }
});

export default router;
