import { Sequelize } from 'sequelize';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL não está definida. Verifique seu arquivo .env');
}

// Adicionamos as opções de SSL apenas se estivermos em produção
const isProduction = process.env.NODE_ENV === 'production';
const dialectOptions = isProduction
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {};

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectOptions: dialectOptions,
  logging: false,
});

export const testDataBaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
  }
};

export default sequelize;
