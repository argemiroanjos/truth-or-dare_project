import { httpServer } from '../app';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import sequelize from '../database';
import { GameState } from '@verdade-ou-desafio/common/interfaces/Game';

describe('Testes de Eventos do Socket.IO para Salas de Jogo', () => {
  // A variável 'clientSocket' é declarada com 'let' porque o seu valor
  // precisa de ser reatribuído antes de cada teste no hook 'beforeEach'.
  let clientSocket: ClientSocket;
  const port = 3001;

  // Antes de todos os testes, iniciamos o nosso servidor.
  beforeAll((done) => {
    httpServer.listen(port, () => {
      console.log(`Servidor de teste a rodar na porta ${port}`);
      done();
    });
  });

  // Depois de todos os testes, fechamos o servidor e a conexão com o banco de dados.
  // Isso é importante para evitar vazamentos de memória e conexões abertas.
  afterAll(async () => {
    httpServer.close();
    await sequelize.close();
  });

  // Antes de cada teste, criamos uma nova instância do cliente Socket.IO.
  // Isso garante que cada teste comece com um cliente limpo e desconectado.
  beforeEach((done) => {
    clientSocket = Client(`http://localhost:${port}`);
    clientSocket.on('connect', () => {
      done();
    });
  });

  // Após cada teste, desconectamos o cliente Socket.IO.
  // Isso é importante para garantir que não haja conexões persistentes entre os testes,
  // o que poderia causar falhas intermitentes ou comportamentos inesperados.
  afterEach(() => {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  // Teste para o fluxo de criação de sala e início do jogo
  // Este teste verifica se o fluxo de criação de sala e início do jogo funciona corretamente.
  describe("Fluxo: 'criar_sala' seguido de 'iniciar_jogo'", () => {
    it('deve criar uma sala com o estado de LOBBY e depois iniciar o jogo com o estado de SPINNING', async () => {
      const hostName = 'Anfitrião Teste';

      // Parte 1 - Criação da sala

      // Criamos uma nova Promise para esperar pela atualização do estado do jogo.
      const createRoomPromise = new Promise<GameState>((resolve) => {
        clientSocket.on('update_game_state', (gameState) => {
          resolve(gameState);
        });
      });

      // Emitindo o evento para criar a sala.
      clientSocket.emit('criar_sala', hostName);

      // Aguardando a resposta do servidor.
      const initialGameState = await createRoomPromise;

      // Verificando se o estado inicial (LOBBY) está correto.
      expect(initialGameState.phase).toBe('LOBBY');
      expect(initialGameState.hostId).toBe(clientSocket.id);
      expect(initialGameState.players).toHaveLength(1);
      expect(initialGameState.players[0].name).toBe(hostName);

      const roomId = initialGameState.id;

      // Parte 2: Início do Jogo

      // Criamos uma nova Promise para esperar pela atualização do estado do jogo
      // quando o jogo for iniciado.
      const startGamePromise = new Promise<GameState>((resolve) => {
        clientSocket.on('update_game_state', (gameState) => {
          // Verificando se o estado do jogo foi atualizado para SPINNING.
          if (gameState.phase === 'SPINNING') {
            resolve(gameState);
          }
        });
      });

      // Emitindo o evento para iniciar o jogo.
      clientSocket.emit('iniciar_jogo', roomId);

      // Aguardando a resposta do servidor.
      const playingGameState = await startGamePromise;

      // Verificando se o estado do jogo foi atualizado corretamente.
      expect(playingGameState.phase).toBe('SPINNING');
      expect(playingGameState.spinnerId).toBe(clientSocket.id);
      expect(playingGameState.questionerPool).toContain(clientSocket.id);
    }, 10000);
  });
});
