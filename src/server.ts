import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { testDataBaseConnection } from './database';
import cardRoutes from './routes/cardRoutes';
import { setupSocket } from './socket';

const app = express();
// Servidor HTTP é criado a partir do Express.
const httpServer = createServer(app);

// Instância do Socket.IO
// Configuração do CORS para permitir conexões de qualquer origem (somente para desenvolvimento).

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setupSocket(io);

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor voando!');
});

app.use('/cards', cardRoutes);

// Inicia o servidor HTTP na porta especificada
httpServer.listen(PORT, () => {
  testDataBaseConnection();
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});
