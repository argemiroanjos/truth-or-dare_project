import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cardRoutes from './routes/cardRoutes';
import { setupSocket } from './socket';

const app = express();

// Cria o servidor HTTP e o servidor Socket.IO
// Configuração do CORS para permitir conexões de qualquer origem (somente para desenvolvimento).
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setupSocket(io);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor voando!');
});

app.use('/cards', cardRoutes);

export { app, httpServer };
