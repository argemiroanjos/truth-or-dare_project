import { Sequelize } from 'sequelize';
import 'dotenv/config';

const dbName = process.env.DB_NAME || 'spicy_db';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || 'root';
const dbPort = process.env.DB_PORT || '3306';

// Definindo o host do banco de dados, dependendo do ambiente em que estamos.
const dbHost = process.env.DB_HOST || 'db';

// Criando uma nova instância do Sequelize, passando as credenciais do nosso banco de dados.
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: parseInt(dbPort, 10),
  dialect: 'mysql',
  logging: false,
});

// Testando a conexão com o banco de dados.
export const testDataBaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
  }
};

export default sequelize;
