import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Criar um produto
router.post('/', async (req, res) => {
  try {
    const {
      cod_omie,
      nome_produto,
      qtde
    } = req.body;

    const novoProduto = await prisma.produtos.create({
      data: {
        cod_omie: parseInt(cod_omie),
        nome_produto: String(nome_produto),
        qtde: parseInt(qtde),
      }
    });

    res.status(201).json(novoProduto);
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar produto.' });
  }
});

// 📌 Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const produtos = await prisma.produtos.findMany();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// 📌 Editar um produto existente
router.put('/:cod_produto', async (req, res) => {
  const { cod_produto } = req.params;
  const {
    cod_omie,
    nome_produto,
    qtde
  } = req.body;

  try {
    const produtoExiste = await prisma.produtos.findUnique({
      where: { cod_produto: Number(cod_produto) }
    });

    if (!produtoExiste) {
      return res.status(404).json({ error: "Produto não encontrado!" });
    }

    const produtoAtualizado = await prisma.produtos.update({
      where: { cod_produto: Number(cod_produto) },
      data: { cod_omie,nome_produto,qtde }
    });

    res.json({ message: "Produto atualizado com sucesso!", produto: produtoAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// 📌 Excluir um produto
router.delete('/:cod_produto', async (req, res) => {
  const { cod_produto } = req.params;

  try {
    const produtoExiste = await prisma.produtos.findUnique({
      where: { cod_produto: Number(cod_produto) }
    });

    if (!produtoExiste) {
      return res.status(404).json({ error: "Produto não encontrado!" });
    }

    await prisma.produtos.delete({
      where: { cod_produto: Number(cod_produto) }
    });

    res.json({ message: "Produto excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    res.status(500).json({ error: "Erro no servidor ao excluir produto." });
  }
});

export default router;
