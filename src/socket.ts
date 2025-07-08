import { Server, Socket } from 'socket.io';

const generateRoomId = (): string => {
  const randomRoomId = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `room-${randomRoomId}`;
}
// Função responsável por chamar o Socket.IO e configurar os eventos.
export const setupSocket = (io: Server) => {

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Novo cliente conectado: ${socket.id}`);

    socket.on('criar_sala', () => {
      console.log(`[EVENTO] Cliente ${socket.id} está tentando criar uma sala.`);
    
      const roomId = generateRoomId();
      socket.join(roomId);

      socket.emit('sala_criada', roomId);
      console.log(`[SALA] Cliente ${socket.id} criou e entrou na sala: ${roomId}`);
    });
    
    socket.on('disconnect', () => {
      console.log(`🔌 Cliente desconectado: ${socket.id}`);
    });
  });
};