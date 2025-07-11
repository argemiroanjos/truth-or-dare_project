import { httpServer } from '../app';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import sequelize from '../database';
import { GameState } from '@verdade-ou-desafio/common/interfaces/Game';

describe('Testes de Eventos do Socket.IO para Salas de Jogo', () => {
  // A variável 'clientSocket' é declarada com 'let' porque o seu valor
  // precisa de ser reatribuído antes de cada teste no hook 'beforeEach'.
  let clientSocket: ClientSocket;
  const port = 3001;

  beforeAll((done) => {
    httpServer.listen(port, () => {
      console.log(`Servidor de teste a rodar na porta ${port}`);
      done();
    });
  });

  afterAll(() => {
    httpServer.close();
    sequelize.close();
  });

  beforeEach((done) => {
    clientSocket = Client(`http://localhost:${port}`);
    clientSocket.on('connect', () => {
      done();
    });
  });

  afterEach(() => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  describe("Teste de Evento: 'criar_sala'", () => {
    it('deve criar uma sala e devolver o estado inicial do jogo', async () => {
      const playerName = 'Anfitrião Teste';

      // 1. Criando uma Promise que só será resolvida quando o evento 'update_game_state' chegar.
      const responsePromise = new Promise<GameState>((resolve) => {
        clientSocket.on('update_game_state', (gameState) => {
          resolve(gameState);
        });
      });

      // 2. Emitindo o nosso evento 'criar_sala'.
      clientSocket.emit('criar_sala', playerName);

      // Esperando a resposta do servidor.
      const gameState = await responsePromise;

      expect(gameState).toBeDefined();
      expect(gameState.id).toHaveLength(4);
      expect(gameState.status).toBe('lobby');
      expect(gameState.players).toHaveLength(1);
      expect(gameState.players[0].name).toBe(playerName);
      expect(gameState.hostId).toBe(clientSocket.id);
    });
  });
});
