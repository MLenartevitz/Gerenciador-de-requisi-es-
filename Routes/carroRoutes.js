import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Criar um carro
router.post('/', async (req, res) => {
  try {
    const {
      placa,
      marca,
      modelo, 
    } = req.body;

    const novoCarro = await prisma.carro.create({
      data: {
        placa: String(placa),
        marca: String(marca),
        modelo: String(modelo),
      }
    });

    res.status(201).json(novoCarro);
  } catch (error) {
    console.error('Erro ao cadastrar carro:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar carro.' });
  }
});

// 📌 Listar todos os carros
router.get('/', async (req, res) => {
  try {
    const carros = await prisma.carro.findMany();
    res.json(carros);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar carros' });
  }
});

// 📌 Editar um produto existente
router.put('/:placa', async (req, res) => {
  const { placa } = req.params;
  const {
    marca,
    modelo,
  } = req.body;

  try {
    const carroExiste = await prisma.carro.findUnique({
      where: { placa: String(placa) }
    });

    if (!carroExiste) {
      return res.status(404).json({ error: "Carro não encontrado!" });
    }

    const carroAtualizado = await prisma.carro.update({
      where: { carro: String(placa) },
      data: { marca,modelo }
    });

    res.json({ message: "Carro atualizado com sucesso!", carro: carroAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar carro:', error);
    res.status(500).json({ error: "Erro ao atualizar carro" });
  }
});

// 📌 Excluir um produto
router.delete('/:placa', async (req, res) => {
  const { placa } = req.params;

  try {
    const carroExiste = await prisma.carro.findUnique({
      where: { placa: String(placa) }
    });

    if (!carroExiste) {
      return res.status(404).json({ error: "Carro não encontrado!" });
    }

    await prisma.carro.delete({
      where: { placa: String(placa) }
    });

    res.json({ message: "Carro excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir carro:", error);
    res.status(500).json({ error: "Erro no servidor ao excluir carro." });
  }
});

export default router;
