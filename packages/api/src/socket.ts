import { Server, Socket } from 'socket.io';
import { Op } from 'sequelize';
import {
  Player,
  GameState,
  Card,
} from '@verdade-ou-desafio/common/interfaces/Game';
import CardModel from './models/Card';
import sequelize from './database';

const activeRooms = new Map<string, GameState>();
const MAX_PLAYERS_PER_ROOM = 8; // Definindo um limite máximo de jogadores por sala

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

        if (room.players.length >= MAX_PLAYERS_PER_ROOM) {
          socket.emit(
            'erro_sala',
            `A sala está cheia. O limite é de ${MAX_PLAYERS_PER_ROOM} jogadores.`,
          );
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

    socket.on('spin_bottle', (roomId: string) => {
      const room = activeRooms.get(roomId);
      if (!room || socket.id !== room.spinnerId || room.phase !== 'SPINNING') {
        return;
      }

      // Criamos uma lista de jogadores elegíveis (todos, exceto quem girou).
      const eligiblePlayers = room.players.filter((p) => p.id !== socket.id);
      if (eligiblePlayers.length < 2) {
        return;
      }
      // Escolhemos aleatoriamente um questioner e um responder.
      const questionerIndex = Math.floor(
        Math.random() * eligiblePlayers.length,
      );
      room.questionerId = eligiblePlayers[questionerIndex].id;

      // Removemos o questioner escolhido da lista de elegíveis para o responder.
      const remainingPlayers = eligiblePlayers.filter(
        (p) => p.id !== room.questionerId,
      );
      const responderIndex = Math.floor(
        Math.random() * remainingPlayers.length,
      );
      room.responderId = remainingPlayers[responderIndex].id;

      // Atualizamos o estado do jogo.
      room.phase = 'CHOOSING';

      console.log(
        `[GARRAFA GIRADA] Sala: ${roomId}. Questioner: ${room.questionerId}, Responder: ${room.responderId}`,
      );

      // Emitimos o estado atualizado do jogo para todos os jogadores na sala.
      io.to(roomId).emit('update_game_state', room);
    });

    socket.on(
      'make_choice',
      async (data: { roomId: string; choice: 'truth' | 'dare' }) => {
        const { roomId, choice } = data;
        const room = activeRooms.get(roomId);
        // Verificamos se a sala existe, se o jogador é o questioner e se a fase é 'CHOOSING'.
        if (
          !room ||
          socket.id !== room.questionerId ||
          room.phase !== 'CHOOSING'
        ) {
          return;
        }
        // Verificamos se o responder está definido.
        const responder = room.players.find((p) => p.id === room.responderId);
        if (!responder) return;

        // 1. Se a escolha for 'truth', incrementamos o contador do "Responder".
        if (choice === 'truth') {
          responder.consecutiveTruths += 1;
        } else {
          // Se for 'dare', reiniciamos o contador.
          responder.consecutiveTruths = 0;
        }

        try {
          // Buscamos uma carta na base de dados
          const usedCardIdsForResponder =
            room.usedCardIds[room.responderId!] || [];

          const card = await CardModel.findOne({
            where: {
              type: choice,
              id: { [Op.notIn]: usedCardIdsForResponder },
            },
            order: sequelize.random(),
          });

          if (!card) {
            room.currentCard = {
              id: 0,
              type: choice,
              content: 'Todas as cartas foram usadas!',
              level: 1,
            };
          } else {
            room.currentCard = card.toJSON() as Card;
            // Adicionamos o ID da nova carta à lista de cartas usadas pelo "Responder"
            room.usedCardIds[room.responderId!].push(card.id);
          }

          // Atualizamos a fase do jogo para 'ACTION'
          room.phase = 'ACTION';
          console.log(
            `[ESCOLHA FEITA] Sala: ${roomId}. Escolha: ${choice}. Carta ID: ${room.currentCard.id}`,
          );

          // Enviamos o estado atualizado para todos na sala
          io.to(roomId).emit('update_game_state', room);
        } catch (error) {
          console.error('Erro ao buscar carta:', error);
          io.to(roomId).emit(
            'erro_jogo',
            'Ocorreu um erro ao buscar a carta. Tente novamente.',
          );
        }
      },
    );

    socket.on('action_complete', (roomId: string) => {
      const room = activeRooms.get(roomId);
      if (!room || socket.id !== room.responderId || room.phase !== 'ACTION') {
        return;
      }

      // Atualizamos o estado do jogo para a fase de votação
      room.phase = 'VOTING';
      console.log(`[AÇÃO COMPLETA] Sala: ${roomId}. A iniciar a votação.`);

      // Emitimos o estado atualizado do jogo para todos os jogadores na sala
      io.to(roomId).emit('update_game_state', room);
    });

    socket.on(
      'submit_vote',
      (data: { roomId: string; vote: 'like' | 'dislike' }) => {
        const { roomId, vote } = data;
        const room = activeRooms.get(roomId);

        // Verificamos se a sala existe, se a fase é 'VOTING' e se o jogador não é o "Responder".
        if (
          !room ||
          room.phase !== 'VOTING' ||
          socket.id === room.responderId
        ) {
          return;
        }

        // Adicionamos o voto do jogador.
        room.votes[socket.id] = vote;
        console.log(
          `[VOTO] Sala: ${roomId}. Jogador ${socket.id} votou: ${vote}`,
        );

        // 1. Atualizamos o estado do jogo com o voto do jogador.
        // O número de votantes deve ser o total de jogadores menos o "Responder".
        const requiredVotes = room.players.length - 1;
        if (Object.keys(room.votes).length === requiredVotes) {
          console.log(
            `[VOTAÇÃO COMPLETA] Sala: ${roomId}. A passar para a fase de veredito.`,
          );
          // Se todos votaram, mudamos para a fase de Veredito.
          room.phase = 'VERDICT';
        }

        // 2. Emitimos o estado atualizado do jogo para todos os jogadores na sala.
        io.to(roomId).emit('update_game_state', room);
      },
    );

    socket.on(
      'confirm_verdict',
      (data: { roomId: string; verdict: 'accepted' | 'rejected' }) => {
        const { roomId, verdict } = data;
        const room = activeRooms.get(roomId);

        // Verificamos se a sala existe, se o jogador é o questioner e se a fase é 'VERDICT'.
        if (
          !room ||
          socket.id !== room.questionerId ||
          room.phase !== 'VERDICT'
        ) {
          return;
        }

        const responder = room.players.find((p) => p.id === room.responderId);
        if (!responder) return;

        // Processamos o veredito
        if (verdict === 'accepted') {
          // A Recompensa: O "Responder" bem-sucedido torna-se o próximo a girar.
          room.spinnerId = room.responderId;
          // Se a carta era um desafio, reiniciamos o seu contador de "verdades".
          if (room.currentCard?.type === 'dare') {
            responder.consecutiveTruths = 0;
          }
        } else {
          // verdict === 'rejected'
          // A Penalidade: O "Responder" recebe uma carga de suspensão.
          responder.suspensionCount += 1;
          // O poder de girar volta para um jogador aleatório (que não seja o penalizado).
          const eligibleSpinners = room.players.filter(
            (p) => p.id !== room.responderId,
          );
          const randomSpinner =
            eligibleSpinners[
              Math.floor(Math.random() * eligibleSpinners.length)
            ];
          room.spinnerId = randomSpinner.id;
        }

        // Reiniciamos o estado do jogo para a próxima rodada.
        room.phase = 'SPINNING';
        room.questionerId = null;
        room.responderId = null;
        room.currentCard = null;
        room.votes = {};

        console.log(
          `[VEREDITO] Sala: ${roomId}. Veredito: ${verdict}. Próximo a girar: ${room.spinnerId}`,
        );

        // Enviamos o estado atualizado para todos na sala para iniciar a nova rodada.
        io.to(roomId).emit('update_game_state', room);
      },
    );

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
