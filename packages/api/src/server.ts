import 'dotenv/config';
import { httpServer } from './app';
import { testDataBaseConnection } from './database';

// Definindo a porta
const PORT = process.env.PORT || 3000;

// Iniciando o servidor
httpServer.listen(PORT, () => {
  testDataBaseConnection();
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});
