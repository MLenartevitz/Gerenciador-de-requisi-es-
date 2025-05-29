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

// Crie o diretório 'uploads/controle' se não existir
const pastaDestino = path.join(__dirname, '..', 'uploads', 'controle');
if (!fs.existsSync(pastaDestino)) {
  fs.mkdirSync(pastaDestino, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, pastaDestino),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// Criar uma saída
router.post('/saida', upload.single('arquivoCotacao'), async (req, res) => {
  try {
    let { data_controle, placa, cod_user, km, observacao } = req.body;

    // Limpeza e validação
    placa = String(placa).trim().toUpperCase();

    if (!data_controle || !placa || !cod_user || !km || !observacao) {
      return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
    }

    const carroExistente = await prisma.carro.findUnique({
      where: { placa }
    });

    if (!carroExistente) {
      return res.status(400).json({ erro: `Placa '${placa}' não está cadastrada.` });
    }

    const parsedDate = new Date(data_controle);
    const parsedKm = parseInt(km);
    const parsedUser = parseInt(cod_user);

    if (isNaN(parsedDate.getTime()) || isNaN(parsedKm) || isNaN(parsedUser)) {
      return res.status(400).json({ erro: 'Dados inválidos.' });
    }

    const novaSaida = await prisma.controle_saida_retorno.create({
      data: {
        tipo_evento: true,
        data_controle: parsedDate,
        placa,
        cod_user: parsedUser,
        km: parsedKm,
        nomeArquivo: req.file?.filename || null,
        observacao
      }
    });

    await prisma.carro.update({
      where: { placa },
      data: { status: 'em uso' }
    });

    res.status(201).json(novaSaida);
  } catch (error) {
    console.error('Erro ao cadastrar saída:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar saída.', detalhes: error.message });
  }
});


// Criar um retorno
router.post('/retorno', upload.single('arquivoCotacao'), async (req, res) => {
  try {
    let { data_controle, placa, cod_user, km, observacao } = req.body;

    // Preencher observacao com '-' se não for enviado
    if (!observacao || observacao.trim() === '') {
      observacao = '-';
    }

    // Verificação de campos obrigatórios
    if (!data_controle || !placa || !cod_user || !km) {
      return res.status(400).json({
        erro: 'Campos obrigatórios faltando: data_controle, placa, cod_user e km são obrigatórios.'
      });
    }

    // Validação de dados
    const parsedDate = new Date(data_controle);
    const parsedKm = parseInt(km);
    const parsedUser = parseInt(cod_user);

    if (isNaN(parsedUser)) {
      return res.status(400).json({ erro: 'O código do usuário (cod_user) é inválido.' });
    }

    if (isNaN(parsedKm)) {
      return res.status(400).json({ erro: 'O valor de quilometragem (km) é inválido.' });
    }

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ erro: 'A data (data_controle) está inválida.' });
    }

    // Criação do evento de retorno
    const novoRetorno = await prisma.controle_saida_retorno.create({
      data: {
        tipo_evento: false,
        data_controle: parsedDate,
        placa: String(placa),
        cod_user: parsedUser,
        km: parsedKm,
        nomeArquivo: req.file?.filename || null,
        observacao: observacao
      }
    });

    // Atualiza o status do carro
    await prisma.carro.update({
      where: { placa: String(placa) },
      data: { status: 'ativo' }
    });

    res.status(201).json(novoRetorno);
  } catch (error) {
    console.error('Erro ao cadastrar retorno:', error.message);
    res.status(500).json({ erro: 'Erro ao cadastrar retorno.', detalhes: error.message });
  }
});


// Listar todos os eventos
router.get('/', async (req, res) => {
  try {
    const dados = await prisma.controle_saida_retorno.findMany({
      include: {
        usuario: {
          select: { nome_user: true }
        },
        carro: {
          select: { modelo: true }
        }
      },
      orderBy: [
        { data_controle: 'asc' }
      ]

    });

    // Mapear os dados para incluir nome_user e modelo no nível superior
    const formatado = dados.map(item => ({
      ...item,
      nome_user: item.usuario?.nome_user || '',
      modelo: item.carro?.modelo || ''
    }));

    res.json(formatado);
  } catch (err) {
    console.error('Erro ao buscar dados:', err);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

// Editar evento
router.put('/:cod_evento', async (req, res) => {
  const { cod_evento } = req.params;
  const { tipo_evento, data_controle, cod_user, km, nomeArquivo, observacao } = req.body;

  try {
    const evento = await prisma.controle_saida_retorno.findUnique({
      where: { cod_evento: parseInt(cod_evento) }
    });

    if (!evento) {
      return res.status(404).json({ error: "Evento não encontrado!" });
    }

    const eventoAtualizado = await prisma.controle_saida_retorno.update({
      where: { cod_evento: parseInt(cod_evento) },
      data: {
        tipo_evento,
        data_controle: new Date(data_controle),
        cod_user: parseInt(cod_user),
        km: parseInt(km),
        nomeArquivo,
        observacao
      }
    });

    res.json({ message: "Evento atualizado com sucesso!", evento: eventoAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ error: "Erro ao atualizar evento" });
  }
});

// Excluir evento
router.delete('/:cod_evento', async (req, res) => {
  const { cod_evento } = req.params;

  try {
    const evento = await prisma.controle_saida_retorno.findUnique({
      where: { cod_evento: parseInt(cod_evento) }
    });

    if (!evento) {
      return res.status(404).json({ error: "Evento não encontrado!" });
    }

    await prisma.controle_saida_retorno.delete({
      where: { cod_evento: parseInt(cod_evento) }
    });

    res.json({ message: "Evento excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    res.status(500).json({ error: "Erro no servidor ao excluir evento." });
  }
});

export default router;
