import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Criar uma requisição
router.post('/', async (req, res) => {
  try {
    const { cod_proj, data_requisicao, cod_user, rev_req } = req.body;

    // Verificando se os valores são válidos
    if (isNaN(cod_proj) || isNaN(cod_user) || !rev_req || !data_requisicao) {
      return res.status(400).json({ error: 'Dados inválidos, por favor verifique os campos' });
    }

    // Convertendo para inteiros e certificando-se de que são números válidos
    const codProjInt = parseInt(cod_proj);
    const codUserInt = parseInt(cod_user);

    // Verificando se os valores são números válidos
    if (isNaN(codProjInt) || isNaN(codUserInt)) {
      return res.status(400).json({ error: 'Campos cod_proj ou cod_user são inválidos' });
    }

    // Certificando-se de que o campo 'rev_req' é uma string válida
    if (typeof rev_req !== 'string' || !rev_req.trim()) {
      return res.status(400).json({ error: 'O campo rev_req está inválido' });
    }

    // Verificando a validade da data
    const dataRequisicao = new Date(data_requisicao);
    if (isNaN(dataRequisicao.getTime())) {
      return res.status(400).json({ error: 'Data de requisição inválida' });
    }

    // Criando a requisição
    const novaRequisicao = await prisma.requisicoes.create({
      data: {
        cod_proj: codProjInt,
        data_requisicao: dataRequisicao,
        cod_user: codUserInt,
        rev_req: rev_req,
      },
    });

    res.status(201).json(novaRequisicao);
  } catch (error) {
    console.error('Erro ao cadastrar a requisição:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar requisição.' });
  }
});

// 📌 Listar todas as requisições
router.get('/', async (req, res) => {
  try {
    const requisicoes = await prisma.requisicoes.findMany();
    res.json(requisicoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar requisições' });
  }
});

// 📌 Editar uma requisição existente
router.put('/:num_requisicao', async (req, res) => {
  const { num_requisicao } = req.params;
  const { cod_proj, data_requisicao, cod_user, rev_req } = req.body;

  try {
    const requisicaoExiste = await prisma.requisicoes.findUnique({
      where: { num_requisicao: Number(num_requisicao) }
    });

    if (!requisicaoExiste) {
      return res.status(404).json({ error: "Requisição não encontrado!" });
    }

    const requisicaoAtualizado = await prisma.requisicoes.update({
      where: { num_requisicao: Number(num_requisicao) },
      data: { cod_proj, data_requisicao, cod_user, rev_req }
    });

    res.json({ message: "Requisição atualizada com sucesso!", projeto: requisicaoAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar requisição:', error);
    res.status(500).json({ error: "Erro ao atualizar requisição" });
  }
});

// 📌 Excluir uma requisição
router.delete('/:num_requisicao', async (req, res) => {
  const { num_requisicao } = req.params;

  try {
    const requisicaoExiste = await prisma.requisicoes.findUnique({
      where: { num_requisicao: Number(num_requisicao) }
    });

    if (!requisicaoExiste) {
      return res.status(404).json({ error: "Requisição não encontrada!" });
    }

    await prisma.requisicoes.delete({
      where: { num_requisicao: Number(num_requisicao) }
    });

    res.json({ message: "Requisição excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir requisição:", error);
    res.status(500).json({ error: "Erro no servidor ao excluir requisição." });
  }
});

export default router;
