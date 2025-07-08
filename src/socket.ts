import { Server, Socket } from 'socket.io';

// Função responsável por chamar o Socket.IO e configurar os eventos.
export const setupSocket = (io: Server) => {

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Novo cliente conectado: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`🔌 Cliente desconectado: ${socket.id}`);
    });
  });
};