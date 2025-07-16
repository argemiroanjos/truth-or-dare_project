import { Server, Socket } from 'socket.io';
import { Player, GameState } from '@verdade-ou-desafio/common/interfaces/Game';

const activeRooms = new Map<string, GameState>();

const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

const findRoomByPlayerId = (
  playerId: string,
): { room: GameState; roomId: string } | null => {
  for (const [roomId, room] of activeRooms.entries()) {
    if (room.players.some((p) => p.id === playerId)) {
      return { room, roomId };
    }
  }
  return null;
};

// Configuração do Socket.IO
export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Novo cliente conectado: ${socket.id}`);

    socket.on('criar_sala', (playerName: string) => {
      const roomId = generateRoomId();
      socket.join(roomId);

      // Criamos o jogador anfitrião com os dados iniciais
      const hostPlayer: Player = {
        id: socket.id,
        name: playerName,
        consecutiveTruths: 0,
        suspensionCount: 0,
      };

      // GameState inicial
      const newGameState: GameState = {
        id: roomId,
        hostId: socket.id,
        phase: 'LOBBY', // O jogo começa na fase de Lobby
        players: [hostPlayer],
        questionerPool: [],
        spinnerId: null,
        questionerId: null,
        responderId: null,
        currentCard: null,
        votes: {},
        usedCardIds: { [socket.id]: [] },
      };

      activeRooms.set(roomId, newGameState);
      console.log(
        `[SALA CRIADA] Sala: ${roomId}, Anfitrião: ${playerName} (${socket.id})`,
      );
      io.to(roomId).emit('update_game_state', newGameState);
    });

    socket.on(
      'entrar_na_sala',
      (data: { roomId: string; playerName: string }) => {
        const { roomId, playerName } = data;
        const room = activeRooms.get(roomId);

        if (!room || room.phase !== 'LOBBY') {
          socket.emit('erro_sala', 'Não foi possível entrar na sala.');
          return;
        }

        socket.join(roomId);

        const newPlayer: Player = {
          id: socket.id,
          name: playerName,
          consecutiveTruths: 0,
          suspensionCount: 0,
        };

        room.players.push(newPlayer);
        room.usedCardIds[socket.id] = [];

        io.to(roomId).emit('update_game_state', room);
      },
    );

    socket.on('iniciar_jogo', (roomId: string) => {
      const room = activeRooms.get(roomId);
      if (!room || socket.id !== room.hostId) return;

      room.phase = 'SPINNING';
      // O anfitrião é o primeiro a girar.
      room.spinnerId = room.hostId;
      // Lista de questionadores é preenchida com todos os jogadores.
      room.questionerPool = room.players.map((p) => p.id);

      console.log(
        `[JOGO INICIADO] Sala: ${roomId}. Anfitrião ${room.players.find((p) => p.id === room.hostId)?.name} começa a girar.`,
      );
      io.to(roomId).emit('update_game_state', room);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Cliente desconectado: ${socket.id}`);

      const roomInfo = findRoomByPlayerId(socket.id);
      if (!roomInfo) return;

      const { room, roomId } = roomInfo;
      const playerIndex = room.players.findIndex((p) => p.id === socket.id);

      if (playerIndex > -1) {
        const disconnectedPlayerName = room.players[playerIndex].name;
        console.log(`[SAÍDA] ${disconnectedPlayerName} saiu da sala ${roomId}`);
        room.players.splice(playerIndex, 1);
      }

      if (room.players.length === 0) {
        activeRooms.delete(roomId);
        console.log(
          `[SALA FECHADA] A sala ${roomId} ficou vazia e foi fechada.`,
        );
      } else {
        if (socket.id === room.hostId) {
          room.hostId = room.players[0].id;
          console.log(
            `[NOVO ANFITRIÃO] O anfitrião saiu. O novo anfitrião da sala ${roomId} é ${room.players[0].name}.`,
          );
        }
        io.to(roomId).emit('update_game_state', room);
      }
    });
  });
};
