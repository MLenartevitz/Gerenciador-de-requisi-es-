import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();


// Criar um projeto
router.post('/', async (req, res) => {
  try {
    const {
      num_proposta,
      titulo,
      cod_empresa,
      cod_cliente,
      data_entrega,
      num_pedido,
      num_itempedido,
      data_pedido,
      resp_pedido
    } = req.body;

    const novoProjeto = await prisma.projeto.create({
      data: {
        num_proposta: parseInt(num_proposta),
        titulo: String(titulo),
        cod_empresa: parseInt(cod_empresa),
        cod_cliente: parseInt(cod_cliente),
        data_entrega: new Date(data_entrega),
        num_pedido: parseInt(num_pedido),
        num_itempedido: parseInt(num_itempedido),
        data_pedido: new Date(data_pedido),
        resp_pedido: String(resp_pedido),
        status: true,
      }
    });

    res.status(201).json(novoProjeto);
  } catch (error) {
    console.error('Erro ao cadastrar projeto:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar projeto.' });
  }
});

// 📌 Listar todos os projetos (com todos os campos)
router.get('/', async (req, res) => {
  try {
    const projetos = await prisma.projeto.findMany();
    res.json(projetos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
});


// 📌 Editar um cliente existente
router.put('/:cod_proj', async (req, res) => {
  const { cod_proj } = req.params;
  const { num_proposta, titulo, cod_empresa, cod_cliente, data_entrega, num_pedido, num_itempedido, data_pedido, resp_pedido } = req.body;

  try {
    const projetoExiste = await prisma.projeto.findUnique({
      where: { cod_proj: Number(cod_proj) }
    });

    if (!projetoExiste) {
      return res.status(404).json({ error: "Projeto não encontrado!" });
    }

    const projetoAtualizado = await prisma.projeto.update({
      where: {  cod_proj: Number(cod_proj) },
      data: { num_proposta, titulo, cod_empresa, cod_cliente, data_entrega, num_pedido, num_itempedido, data_pedido, resp_pedido  }
    });

    res.json({ message: "Projeto atualizado com sucesso!", projeto: projetoAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    res.status(500).json({ error: "Erro ao atualizar projeto" });
  }
});

// 📌 Excluir um projeto
router.delete('/:cod_proj', async (req, res) => {
  const { cod_proj } = req.params;

  try {
    const projetoExiste = await prisma.projeto.findUnique({
      where: { cod_proj: Number(cod_proj) }
    });

    if (!projetoExiste) {
      return res.status(404).json({ error: "Cliente não encontrado!" });
    }

    await prisma.projeto.delete({
      where: { cod_proj: Number(cod_proj) }
    });

    res.json({ message: "Projeto excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir projeto:", error);
    res.status(500).json({ error: "Erro no servidor ao excluir projeto." });
  }
});

// Listar todos os projetos (somente código e nome)
router.get('/cod_proj', async (req, res) => {
  try {
    const projetos = await prisma.projeto.findMany({
      select: {
        cod_proj: true,
        titulo: true
      }
    });
    res.json(projetos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
});
export default router;
