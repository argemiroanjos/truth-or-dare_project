import { Server, Socket } from 'socket.io';
import { Player, GameState } from './interfaces/Game';

//GERENCIADOR DE ESTADO
// Usando um Map para armazenar o estado de cada sala ativa
// A chave da sala é o ID da sala, e o valor é o estado do jogo
const activeRooms = new Map<string, GameState>();

const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

// Função para encontrar uma sala pelo ID do jogador
const findRoomByPlayerId = (playerId: string): { room: GameState, roomId: string} | null => {
  for (const [roomId, room] of activeRooms.entries()) {
    if (room.players.some(player => player.id === playerId)) {
      return { room, roomId };
    }
  }
  return null;
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

    // Evento para iniciar o jogo
    // Apenas o host pode iniciar o jogo
    socket.on('iniciar_jogo', (roomId: string) => {
      const room = activeRooms.get(roomId);
      if (!room || socket.id !== room.hostId) {
        console.log(`[FALHA AO INICIAR] Tentativa de iniciar o jogo na sala ${roomId} por um não-anfitrião.`);
        return;
      }

      room.status = 'playing';
      console.log(`[JOGO INICIADO] O jogo na sala ${roomId} começou.`);

      room.status = 'playing';
      console.log(`[INÍCIO DO JOGO] Sala: ${roomId}, Host: ${room.hostId}`);

      io.to(roomId).emit('update_game_state', room);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Cliente desconectado: ${socket.id}`);

      const roomInfo = findRoomByPlayerId(socket.id);
      if (!roomInfo) return;

      const { room, roomId } = roomInfo;

      // Removendo o jogador da sala
      const playerIndex = room.players.findIndex(player => player.id === socket.id);
      const disconnectedPlayerName = room.players[playerIndex].name;
      room.players.splice(playerIndex, 1);

      // Se o jogador desconectado era o host, transferimos a host para outro jogador
      if (room.players.length === 0) {
        activeRooms.delete(roomId);
        console.log(`[SALA REMOVIDA] Sala: ${roomId} foi removida porque não há mais jogadores.`);
      } else {
        if (socket.id === room.hostId) {
          room.hostId = room.players[0].id; // Novo host é o primeiro jogador restante
          console.log(`[NOVO HOST] ${room.players[0].name} (${room.players[0].id}) agora é o host da sala: ${roomId}`);
        }
        // Enviando estado atualizado da sala para todos os jogadores restantes
        io.to(roomId).emit('update_game_state', room);
      }
    });
  });
};