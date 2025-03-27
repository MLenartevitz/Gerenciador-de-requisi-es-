import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Criar um fornecedor
router.post('/', async (req, res) => {
  try {
    const {
      cod_fornecedor,
      nome,
      endereco,
      email,
      telefone,
      tipo_peca,
      quantidade,
      marca,
      descricao,
      responsavel
    } = req.body;

    const novoFornecedor = await prisma.fornecedores.create({
      data: {
        nome: String(nome),
        endereco: String(endereco),
        email: String(email),
        telefone: String(telefone),
        tipo_peca: String(tipo_peca),
        quantidade: parseInt(quantidade),
        marca: String(marca),
        descricao: String(descricao),
        responsavel: String(responsavel),
      }
    });

    res.status(201).json(novoFornecedor);
  } catch (error) {
    console.error('Erro ao cadastrar fornecedor:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar fornecedor.' });
  }
});

// 📌 Listar todos os fornecedores
router.get('/', async (req, res) => {
  try {
    const fornecedores = await prisma.fornecedores.findMany();
    res.json(fornecedores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar fornecedores' });
  }
});

// 📌 Editar um fornecedor existente
router.put('/:cod_fornecedor', async (req, res) => {
  const { cod_fornecedor } = req.params;
  const { nome, endereco, email, telefone, tipo_peca, quantidade, marca, descricao, responsavel } = req.body;

  try {
    const fornecedorExiste = await prisma.fornecedores.findUnique({
      where: { cod_fornecedor: Number(cod_fornecedor) }
    });

    if (!fornecedorExiste) {
      return res.status(404).json({ error: "Fornecedor não encontrado!" });
    }

    const fornecedorAtualizado = await prisma.fornecedores.update({
      where: { cod_fornecedor: Number(cod_fornecedor) },
      data: { nome, endereco, email, telefone, tipo_peca, quantidade, marca, descricao, responsavel }
    });

    res.json({ message: "Fornecedor atualizado com sucesso!", fornecedor: fornecedorAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({ error: "Erro ao atualizar fornecedor" });
  }
});

// 📌 Excluir um fornecedor
router.delete('/:cod_fornecedor', async (req, res) => {
  const { cod_fornecedor } = req.params;

  try {
    const fornecedorExiste = await prisma.fornecedores.findUnique({
      where: { cod_fornecedor: Number(cod_fornecedor) }
    });

    if (!fornecedorExiste) {
      return res.status(404).json({ error: "Fornecedor não encontrado!" });
    }

    await prisma.fornecedores.delete({
      where: { cod_fornecedor: Number(cod_fornecedor) }
    });

    res.json({ message: "Fornecedor excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir fornecedor:", error);
    res.status(500).json({ error: "Erro no servidor ao excluir fornecedor." });
  }
});

export default router;
