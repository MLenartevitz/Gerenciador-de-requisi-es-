import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

dotenv.config(); // Carrega variáveis de ambiente

const router = express.Router();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "seuSegredoSuperSeguro"; // Melhor usar variável de ambiente

// Rota de cadastro de usuário
// Rota de cadastro de usuário
router.post('/register', async (req, res) => {
  const { nome_user, funcao, senha, data_inicio } = req.body;

  if (!nome_user || !funcao || !senha || !data_inicio) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    // Verifica se o usuário já existe
    const usuarioExistente = await prisma.usuario.findFirst({
      where: { nome_user }
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = await prisma.usuario.create({
      data: {
        nome_user,
        funcao,
        senha: hashedPassword,
        data_inicio: new Date(data_inicio),
        ativo: true,
      },
    });

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      user: { cod_user: newUser.cod_user, nome_user: newUser.nome_user },
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Rota de login de usuário
router.post('/login', async (req, res) => {
  try {
    const { cod_user, senha } = req.body;

    if (!cod_user || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    const userId = parseInt(cod_user, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Código do usuário inválido' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { cod_user: userId },
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gerando token JWT
    const token = jwt.sign(
      { cod_user: usuario.cod_user, nome_user: usuario.nome_user, funcao: usuario.funcao },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login bem-sucedido!',
      token,
      usuario: {
        cod_user: usuario.cod_user,
        nome_user: usuario.nome_user,
        funcao: usuario.funcao,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Middleware para validar JWT
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
    req.usuario = decoded;
    next();
  });
};

// Rota protegida que retorna informações do usuário logado
router.get('/perfil', verificarToken, async (req, res) => {
  res.json({ message: 'Acesso permitido', usuario: req.usuario });
});

// 🔥 Nova Rota /me para buscar os dados do usuário autenticado diretamente do banco
router.get('/me', verificarToken, async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { cod_user: req.usuario.cod_user }, // Acessando cod_user de req.usuario
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Formatando a data para "DD/MM/YYYY"
    const dataFormatada = format(new Date(usuario.data_inicio), 'dd/MM/yyyy', { locale: ptBR });

    res.json({
      cod_user: usuario.cod_user,
      nome_user: usuario.nome_user,
      funcao: usuario.funcao,
      data_inicio: dataFormatada,
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Rota para editar usuário
router.put('/usuario', verificarToken, async (req, res) => {
  const { codUser, nomeUser, funcao, dataInicio, ativo } = req.body;

  if (!codUser || !nomeUser || !funcao || !dataInicio) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { cod_user: parseInt(codUser) },
      data: {
        nome_user: nomeUser,
        funcao: funcao,
        data_inicio: new Date(dataInicio),
        ativo: ativo,
      },
    });

    res.json({
      message: 'Usuário atualizado com sucesso!',
      usuario: usuarioAtualizado,
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// 📌 Listar todas os usuarios
router.get('/', async (req, res) => {
  try {
    const usuario = await prisma.usuario.findMany();
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuario' });
  }
});

export default router;
