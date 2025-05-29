import express from 'express';
import qrcode from 'qrcode';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Geração do QRCode do veículo
router.get('/:placa', async (req, res) => {
  const { placa } = req.params;

  try {
    const carro = await prisma.carro.findUnique({
      where: { placa: placa.toUpperCase() }
    });

    if (!carro) {
      return res.status(404).json({ erro: 'Carro não encontrado' });
    }

    const destino = carro.status === 0
      ? `http://localhost:5500/Carros/SaidaCarro.html?placa=${carro.placa}`
      : `http://localhost:5500/Carros/RetornoCarro.html?placa=${carro.placa}`;

    const qrCode = await qrcode.toDataURL(destino);

    res.json({ qrCode, destino });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao gerar QRCode' });
  }
});

export default router;
