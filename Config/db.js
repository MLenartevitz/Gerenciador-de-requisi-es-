// Config/db.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('meubanco', 'root', '1236547890', {
  host: 'localhost',
  dialect: 'mariadb',
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados bem-sucedida!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
};

export default { connectDB };
