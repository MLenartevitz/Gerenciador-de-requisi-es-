import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 📌 Rota para cadastrar um controle de EPI
router.post('/cadastrar', async (req, res) => {
  try {
    const { cod_user, data, quantidadeOculos, quantidadeProtetor, quantidadeLuvas, quantidadeMascara } = req.body;

    if (!cod_user || !data) {
      return res.status(400).json({ error: 'Código do usuário e data são obrigatórios.' });
    }

    const qOculos = parseInt(quantidadeOculos) || 0;
    const qProtetor = parseInt(quantidadeProtetor) || 0;
    const qLuvas = parseInt(quantidadeLuvas) || 0;
    const qMascara = parseInt(quantidadeMascara) || 0;

    const novoControleEpi = await prisma.epi_descartaveis.create({
      data: {
        cod_user: parseInt(cod_user),
        data_retirada: new Date(data),
        quantidadeOculos: qOculos,
        quantidadeProtetor: qProtetor,
        quantidadeLuvas: qLuvas,
        quantidadeMascara: qMascara,
        caOculos: req.body.caOculos || "-",
        caProtetor: req.body.caProtetor || "-",
        caLuvas: req.body.caLuvas || "-",
        caMascara: req.body.caMascara || "-",
      },
    });

    res.status(201).json({
      message: 'Controle de EPI cadastrado com sucesso!',
      epi_descartaveis: novoControleEpi
    });

  } catch (error) {
    console.error('Erro ao cadastrar controle de EPI:', error);
    res.status(500).json({ error: 'Erro interno ao cadastrar controle de EPI.' });
  }
});

// 📌 Rota para listar os EPIs cadastrados, ordenando da data mais recente para a mais antiga
router.get('/', async (req, res) => {
  try {
    const epiRecords = await prisma.epi_descartaveis.findMany({
      include: {
        usuario: true,
      },
      orderBy: [
        { data_retirada: 'asc' }  
      ]
    });

    const resultado = epiRecords.map(record => ({
      id: record.cod_epid,
      cod_user: record.cod_user,
      nome_user: record.usuario?.nome_user || 'Desconhecido',
      data_retirada: record.data_retirada,
      quantidadeOculos: record.quantidadeOculos,
      quantidadeProtetor: record.quantidadeProtetor,
      quantidadeLuvas: record.quantidadeLuvas,
      quantidadeMascara: record.quantidadeMascara,
      caOculos: record.caOculos,
      caProtetor: record.caProtetor,
      caLuvas: record.caLuvas,
      caMascara: record.caMascara
    }));

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar registros de EPI:', error);
    res.status(500).json({ error: 'Erro ao buscar registros de EPI.' });
  }
});

// 📌 Rota para editar um controle de EPI existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { quantidadeOculos, quantidadeProtetor, quantidadeLuvas, quantidadeMascara } = req.body;

  try {
    const epi = await prisma.epi_descartaveis.findUnique({
      where: { cod_epid: Number(id) },
    });

    if (!epi) {
      return res.status(404).json({ error: 'Registro de EPI não encontrado.' });
    }

    const epiAtualizado = await prisma.epi_descartaveis.update({
      where: { cod_epid: Number(id) },
      data: {
        quantidadeOculos: Number(quantidadeOculos) || 0,
        quantidadeProtetor: Number(quantidadeProtetor) || 0,
        quantidadeLuvas: Number(quantidadeLuvas) || 0,
        quantidadeMascara: Number(quantidadeMascara) || 0,
      },
    });

    res.json({
      message: 'Controle de EPI atualizado com sucesso!',
      epi_descartaveis: epiAtualizado
    });

  } catch (error) {
    console.error('Erro ao atualizar controle de EPI:', error);
    res.status(500).json({ error: 'Erro ao atualizar controle de EPI.' });
  }
});

// 📌 Rota para excluir um controle de EPI
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const epi = await prisma.epi_descartaveis.findUnique({
      where: { cod_epid: Number(id) },
    });

    if (!epi) {
      return res.status(404).json({ error: 'Registro de EPI não encontrado.' });
    }

    await prisma.epi_descartaveis.delete({
      where: { cod_epid: Number(id) },
    });

    res.json({ message: 'Controle de EPI excluído com sucesso!' });

  } catch (error) {
    console.error('Erro ao excluir controle de EPI:', error);
    res.status(500).json({ error: 'Erro no servidor ao excluir controle de EPI.' });
  }
});

export default router;
