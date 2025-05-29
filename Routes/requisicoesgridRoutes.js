import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 📝 Criar um novo item de requisição com ordem sequencial
router.post('/', async (req, res) => {
  const { descricao, qtde, observacao, num_requisicao, unidade_medida } = req.body;

  console.log('Dados recebidos:', req.body);

  const quantidadeInt = parseInt(qtde);
  if (isNaN(quantidadeInt) || !descricao || !observacao || !num_requisicao || !unidade_medida) {
    return res.status(400).json({ error: 'Dados inválidos, por favor verifique os campos.' });
  }

  try {
    console.log('Buscando quantidade atual de itens para a requisição', num_requisicao);

    const quantidadeItens = await prisma.item_requisicao.count({
      where: {
        num_requisicao: parseInt(num_requisicao),
      },
    });

    const ordem_item = quantidadeItens + 1;

    console.log(`Será atribuída a ordem: ${ordem_item}`);

    const novoItem = await prisma.item_requisicao.create({
      data: {
        descricao,
        qtde: quantidadeInt,
        observacao,
        ordem_item,
        unidade_medida,
        requisicao: {
          connect: { num_requisicao: parseInt(num_requisicao) },
        },
      },
    });

    console.log('Item de requisição criado com sucesso:', novoItem);

    return res.status(201).json({
      message: 'Item de requisição criado com sucesso!',
      item: novoItem,
    });
  } catch (error) {
    console.error('Erro ao cadastrar o item de requisição:', error.message);
    return res.status(500).json({ error: `Erro ao cadastrar o item de requisição: ${error.message}` });
  }
});

// ✅ Atualizado: incluir num_item_req no retorno
router.get('/', async (req, res) => {
  try {
    const itensRequisicao = await prisma.item_requisicao.findMany();

    res.json({
      grid: itensRequisicao.map(item => ({
        num_item_req: item.num_item_req, // IMPORTANTE
        num_requisicao: item.num_requisicao,
        observacao: item.observacao,
        qtde: item.qtde,
        descricao: item.descricao,
        unidade_medida: item.unidade_medida,
      }))
    });

  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ error: 'Erro ao buscar itens' });
  }
});

// 🗑️ Remover um item específico
router.delete('/remover/:num_item_req', async (req, res) => {
  const { num_item_req } = req.params;

  try {
    const itemParaRemover = await prisma.item_requisicao.findUnique({
      where: {
        num_item_req: parseInt(num_item_req),
      },
    });

    if (!itemParaRemover) {
      return res.status(404).json({ error: 'Item não encontrado.' });
    }

    await prisma.item_requisicao.delete({
      where: { num_item_req: parseInt(num_item_req) },
    });

    res.json({ message: 'Item removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir item:', error);
    res.status(500).json({ error: 'Erro ao excluir item do banco de dados.' });
  }
});

// 🔍 Buscar itens de uma requisição específica
router.get('/:num_requisicao', async (req, res) => {
  const { num_requisicao } = req.params;

  try {
    const itens = await prisma.item_requisicao.findMany({
      where: {
        num_requisicao: parseInt(num_requisicao),
      },
      select: {
        descricao: true,
        qtde: true,
        observacao: true,
        unidade_medida: true,
      },
    });

    if (itens.length === 0) {
      return res.status(404).json({ message: 'Nenhum item encontrado.' });
    }

    res.json({ itens });


  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

export default router;
