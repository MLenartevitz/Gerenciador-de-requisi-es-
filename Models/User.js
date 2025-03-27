import { Sequelize, DataTypes } from 'sequelize';

// Conexão com o banco de dados
const sequelize = new Sequelize('meubanco', 'root', '1236547890', {
  host: 'localhost',
  dialect: 'mariadb',
});

// Definição do modelo de usuário
const User = sequelize.define('User', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Garante que o nome seja único
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Método para comparar senhas (usando bcrypt)
User.prototype.comparePassword = async function(password) {
  const bcrypt = await import('bcrypt');
  return await bcrypt.compare(password, this.password);
};

// Sincronizar com o banco de dados
sequelize.sync()
  .then(() => console.log("Tabela de usuários criada com sucesso"))
  .catch((err) => console.error("Erro ao criar tabela de usuários:", err));

// Exportando o modelo User
export default User;
