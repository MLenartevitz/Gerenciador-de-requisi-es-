import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 📌 Rota para cadastrar um novo cliente
router.post('/cadastrar', async (req, res) => {
  try {
    const { nome_cliente, CNPJ_cliente } = req.body;

    if (!nome_cliente || !CNPJ_cliente) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Verifica se o CNPJ já existe no banco
    const cnpjExistente = await prisma.cliente.findUnique({
      where: { CNPJ_cliente },
    });

    if (cnpjExistente) {
      return res.status(400).json({ error: 'Este CNPJ já está cadastrado.' });
    }

    // Criação do novo cliente
    const novoCliente = await prisma.cliente.create({
      data: {
        nome_cliente,
        CNPJ_cliente,
      },
    });

    res.status(201).json({ message: 'Cliente cadastrado com sucesso!', cliente: novoCliente });
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    res.status(500).json({ error: 'Erro interno ao cadastrar cliente.' });
  }
});

// 📌 Listar todos os clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// 📌 Editar um cliente existente
router.put('/:cod_cliente', async (req, res) => {
  const { cod_cliente } = req.params;
  const { nome_cliente, CNPJ_cliente } = req.body;

  try {
    const clienteExiste = await prisma.cliente.findUnique({
      where: { cod_cliente: Number(cod_cliente) }
    });

    if (!clienteExiste) {
      return res.status(404).json({ error: "Cliente não encontrado!" });
    }

    const clienteAtualizado = await prisma.cliente.update({
      where: { cod_cliente: Number(cod_cliente) },
      data: { nome_cliente, CNPJ_cliente }
    });

    res.json({ message: "Cliente atualizado com sucesso!", cliente: clienteAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
});

// 📌 Excluir um cliente
router.delete('/:cod_cliente', async (req, res) => {
  const { cod_cliente } = req.params;

  try {
    const clienteExiste = await prisma.cliente.findUnique({
      where: { cod_cliente: Number(cod_cliente) }
    });

    if (!clienteExiste) {
      return res.status(404).json({ error: "Cliente não encontrado!" });
    }

    await prisma.cliente.delete({
      where: { cod_cliente: Number(cod_cliente) }
    });

    res.json({ message: "Cliente excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    res.status(500).json({ error: "Erro no servidor ao excluir cliente." });
  }
});

export default router;
