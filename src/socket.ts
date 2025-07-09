import { Server, Socket } from 'socket.io';
import { Player, GameState } from './interfaces/Game';

//GERENCIADOR DE ESTADO
// Usando um Map para armazenar o estado de cada sala ativa
// A chave da sala é o ID da sala, e o valor é o estado do jogo
const activeRooms = new Map<string, GameState>();

const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Novo cliente conectado: ${socket.id}`);

    socket.on('criar_sala', (playerName: string) => {
      const roomId = generateRoomId();
      socket.join(roomId);

      // Estado inicial da sala
      const newGameState: GameState = {
        id: roomId,
        hostId: socket.id,
        status: 'lobby',
        players: [{ id: socket.id, name: playerName, truthPicks: 0 }],
        usedCardIds: { [socket.id]: [] },
      };

      // Adicionando a nova sala ao gerenciador de estado
      activeRooms.set(roomId, newGameState);

      console.log(`[SALA CRIADA] Sala: ${roomId}, Host: ${playerName} (${socket.id})`);
      
      // Enviando estado inicial da sala para o host
      io.to(roomId).emit('update_game_state', newGameState);
    });

    socket.on('entrar_na_sala', (data: { roomId: string, playerName: string }) => {
      const { roomId, playerName } = data;
      const room = activeRooms.get(roomId);

      // Verificamos se a sala existe e se ainda está no lobby
      if (!room || room.status !== 'lobby') {
        socket.emit('erro_de_sala', 'Não foi possível entrar na sala. Ela pode não existir ou o jogo já começou.');
        return;
      }

      socket.join(roomId);

      // Adicionando o novo jogador à sala
      const newPlayer: Player = { id: socket.id, name: playerName, truthPicks: 0 };
      room.players.push(newPlayer);
      room.usedCardIds[socket.id] = [];

      console.log(`[ENTRADA] ${playerName} (${socket.id}) entrou na sala: ${roomId}`);

      // Enviando estado atualizado da sala para todos os jogadores
      io.to(roomId).emit('update_game_state', room);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Cliente desconectado: ${socket.id}`);
    });
  });
};