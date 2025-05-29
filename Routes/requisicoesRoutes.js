import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Criar uma requisição
router.post('/', async (req, res) => {
  try {
    const { cod_proj, data_requisicao, cod_user, rev_req, cod_empresa } = req.body;

    // Verificando se os valores são válidos
    if (isNaN(cod_proj) || isNaN(cod_user) || !rev_req || !data_requisicao || isNaN(cod_empresa)) {
      return res.status(400).json({ error: 'Dados inválidos, por favor verifique os campos' });
    }

    // Convertendo para inteiros e certificando-se de que são números válidos
    const codProjInt = parseInt(cod_proj);
    const codUserInt = parseInt(cod_user);
    const codEmpresaInt = parseInt(cod_empresa);

    // Verificando se os valores são números válidos
    if (isNaN(codProjInt) || isNaN(codUserInt) || isNaN(codEmpresaInt)) {
      return res.status(400).json({ error: 'Campos cod_proj, cod_user ou cod_empresa são inválidos' });
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
        cod_empresa: codEmpresaInt,  // Novo campo adicionado
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
  const {
    cod_proj,
    data_requisicao,
    rev_req,
    cod_empresa
  } = req.body;

  try {
    const requisicaoExiste = await prisma.requisicoes.findUnique({
      where: { num_requisicao: Number(num_requisicao) }
    });

    if (!requisicaoExiste) {
      return res.status(404).json({ error: "Requisição não encontrada!" });
    }

    const requisicaoAtualizado = await prisma.requisicoes.update({
      where: { num_requisicao: Number(num_requisicao) },
      data: {
        data_requisicao: new Date(data_requisicao),
        rev_req: rev_req ? String(rev_req) : null,
        projeto: {
          connect: { cod_proj: Number(cod_proj) },
        },
        empresa: cod_empresa
          ? {
              connect: {
                id: Number(cod_empresa),
              },
            }
          : undefined,
      },
    });
    
    

    res.json({
      message: "Requisição atualizada com sucesso!",
      projeto: requisicaoAtualizado
    });
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

// 📌 Buscar uma requisição específica com usuário e projeto
router.get('/:num_requisicao', async (req, res) => {
  const { num_requisicao } = req.params;

  try {
    const requisicao = await prisma.requisicoes.findUnique({
      where: { num_requisicao: Number(num_requisicao) },
      include: {
        usuario: true, // Deve estar relacionado no modelo Prisma
        projeto: true, // Também
      },
    });

    if (!requisicao) {
      return res.status(404).json({ error: "Requisição não encontrada!" });
    }

    res.json(requisicao);
  } catch (error) {
    console.error("Erro ao buscar requisição:", error);
    res.status(500).json({ error: "Erro ao buscar requisição." });
  }
});


export default router;
