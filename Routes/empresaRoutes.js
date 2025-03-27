import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 📌 Rota para cadastrar uma nova empresa
router.post('/cadastrar', async (req, res) => {
  try {
    const { nome_empresa, CNPJ_empresa } = req.body;

    if (!nome_empresa || !CNPJ_empresa) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Verifica se o CNPJ já existe no banco
    const cnpjExistente = await prisma.empresas.findUnique({
      where: { CNPJ_empresa },
    });

    if (cnpjExistente) {
      return res.status(400).json({ error: 'Este CNPJ já está cadastrado.' });
    }

    // Criação da nova empresa
    const novaEmpresa = await prisma.empresas.create({
      data: {
        nome_empresa,
        CNPJ_empresa,
      },
    });

    res.status(201).json({ message: 'Empresa cadastrada com sucesso!', empresa: novaEmpresa });
  } catch (error) {
    console.error('Erro ao cadastrar empresa:', error);
    res.status(500).json({ error: 'Erro interno ao cadastrar empresa.' });
  }
});

// 📌 Listar todas as empresas
router.get('/', async (req, res) => {
  try {
    const empresas = await prisma.empresas.findMany();
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar empresas' });
  }
});

// 📌 Editar uma empresa existente
router.put('/:cod_empresa', async (req, res) => {
  const { cod_empresa } = req.params;
  const { nome_empresa, CNPJ_empresa } = req.body;

  try {
    const empresaExiste = await prisma.empresas.findUnique({
      where: { cod_empresa: Number(cod_empresa) }
    });

    if (!empresaExiste) {
      return res.status(404).json({ error: "Empresa não encontrada!" });
    }

    const empresaAtualizada = await prisma.empresas.update({
      where: { cod_empresa: Number(cod_empresa) },
      data: { nome_empresa, CNPJ_empresa }
    });

    res.json({ message: "Empresa atualizada com sucesso!", empresa: empresaAtualizada });
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ error: "Erro ao atualizar empresa" });
  }
});

// 📌 Excluir uma empresa
router.delete('/:cod_empresa', async (req, res) => {
  const { cod_empresa } = req.params;

  try {
    const empresaExiste = await prisma.empresas.findUnique({
      where: { cod_empresa: Number(cod_empresa) }
    });

    if (!empresaExiste) {
      return res.status(404).json({ error: "Empresa não encontrada!" });
    }

    await prisma.empresas.delete({
      where: { cod_empresa: Number(cod_empresa) }
    });

    res.json({ message: "Empresa excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir empresa:", error);
    res.status(500).json({ error: "Erro no servidor ao excluir empresa." });
  }
});

export default router;
