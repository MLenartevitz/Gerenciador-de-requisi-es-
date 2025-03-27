import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 📝 Criar um novo item de requisição
router.post('/', async (req, res) => {
  const { descricao, qtde, observacao, num_requisicao } = req.body;

  console.log('Dados recebidos:', req.body);

  const quantidadeInt = parseInt(qtde);
  if (isNaN(quantidadeInt) || !descricao || !observacao || !num_requisicao) {
    return res.status(400).json({ error: 'Dados inválidos, por favor verifique os campos.' });
  }

  try {
    console.log('Tentando criar um novo item de requisição no banco de dados');

    const novoItem = await prisma.item_requisicao.create({
      data: {
        descricao,
        qtde: quantidadeInt,
        observacao,
        requisicao: {
          connect: { num_requisicao: num_requisicao },  
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

// 📋 Buscar o último número de requisição
router.get('/ultimo-numero', async (req, res) => {
  try {
    console.log('Buscando o último número de requisição no banco de dados');

    const ultimaRequisicao = await prisma.requisicao.findFirst({
      orderBy: { num_requisicao: 'desc' }, 
      select: { num_requisicao: true },
    });

    if (!ultimaRequisicao) {
      return res.status(404).json({ error: 'Nenhuma requisição encontrada.' });
    }

    return res.json({ num_requisicao: ultimaRequisicao.num_requisicao });
  } catch (error) {
    console.error('Erro ao buscar o último número de requisição:', error.message);
    return res.status(500).json({ error: `Erro ao buscar o último número de requisição: ${error.message}` });
  }
});

// lista itens 
router.get('/', async (req, res) => {
  try {
    const itensRequisicao = await prisma.item_requisicao.findMany();
    
    res.json({
      grid: itensRequisicao.map(item => ({
        num_requisicao: item.num_requisicao,
        observacao: item.observacao,
        qtde: item.qtde,
        descricao: item.descricao,
      }))
    });
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ error: 'Erro ao buscar itens' });
  }
});

// 🗑️ Remover o primeiro item inserido
router.delete('/remover-primeiro', async (req, res) => {
  try {
    console.log('Buscando o primeiro item para remoção...');

    // Buscar o item com o menor `num_item_req`
    const primeiroItem = await prisma.item_requisicao.findFirst({
      orderBy: { num_item_req: 'asc' }, // Ordena em ordem crescente (o primeiro item inserido vem primeiro)
    });

    if (!primeiroItem) {
      return res.status(404).json({ error: 'Nenhum item encontrado para excluir.' });
    }

    console.log(`Removendo o item com num_item_req: ${primeiroItem.num_item_req}`);

    // Deletar o primeiro item encontrado
    await prisma.item_requisicao.delete({
      where: { num_item_req: primeiroItem.num_item_req },
    });

    res.json({ message: 'Primeiro item removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir item:', error);
    res.status(500).json({ error: 'Erro ao excluir item do banco de dados.' });
  }
});


export default router;
