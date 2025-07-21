import { httpServer } from '../app';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import sequelize from '../database';
import { GameState } from '@verdade-ou-desafio/common/interfaces/Game';

describe('Testes de Eventos do Socket.IO para Salas de Jogo', () => {
  // A variável 'clientSocket' é declarada com 'let' porque o seu valor
  // precisa de ser reatribuído antes de cada teste no hook 'beforeEach'.
  let clients: ClientSocket[] = [];
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

  // Uma função auxiliar para conectar um novo cliente.
  const connectClient = (): Promise<ClientSocket> => {
    return new Promise((resolve) => {
      const socket = Client(`http://localhost:${port}`);
      socket.on('connect', () => {
        clients.push(socket); // Adicionamos o novo cliente à nossa lista
        resolve(socket);
      });
    });
  };

  // Após cada teste, desconectamos o cliente Socket.IO.
  // Isso é importante para garantir que não haja conexões persistentes entre os testes,
  // o que poderia causar falhas intermitentes ou comportamentos inesperados.
  afterEach(() => {
    clients.forEach((socket) => socket.disconnect());
    clients = []; // Limpamos a lista
  });

  describe("Testa o fluxo completo do jogo'", () => {
    it('deve permitir que os jogadores criem, entrem, iniciem e joguem uma rodada', async () => {
      const hostSocket = await connectClient();
      const player2Socket = await connectClient();
      const player3Socket = await connectClient();

      const hostName = 'Anfitrião';
      const player2Name = 'Jogador 2';
      const player3Name = 'Jogador 3';

      // Testar a Criação e Entrada na Sala

      // Criamos uma Promise que espera pela primeira atualização de estado (criação da sala).
      const roomCreationPromise = new Promise<GameState>((resolve) => {
        hostSocket.on('update_game_state', (gameState) => resolve(gameState));
      });

      hostSocket.emit('criar_sala', hostName);
      const initialState = await roomCreationPromise;
      const roomId = initialState.id;

      // Verificamos se o anfitrião está sozinho na sala.
      expect(initialState.phase).toBe('LOBBY');
      expect(initialState.players).toHaveLength(1);

      // Criamos uma Promise para quando o Jogador 2 entrar.
      const player2JoinPromise = new Promise<GameState>((resolve) => {
        hostSocket.on('update_game_state', (gameState) => resolve(gameState));
      });

      player2Socket.emit('entrar_na_sala', { roomId, playerName: player2Name });
      const stateAfterP2 = await player2JoinPromise;

      expect(stateAfterP2.players).toHaveLength(2);

      // Criamos uma Promise para quando o Jogador 3 entrar.
      const player3JoinPromise = new Promise<GameState>((resolve) => {
        hostSocket.on('update_game_state', (gameState) => resolve(gameState));
      });

      player3Socket.emit('entrar_na_sala', { roomId, playerName: player3Name });
      const stateAfterP3 = await player3JoinPromise;

      expect(stateAfterP3.players).toHaveLength(3);

      // Testar o Início do Jogo e o Giro da Garrafa

      // Criamos uma Promise para esperar pela fase de SPINNING.
      const startGamePromise = new Promise<GameState>((resolve) => {
        hostSocket.on('update_game_state', (gs) => {
          if (gs.phase === 'SPINNING') resolve(gs);
        });
      });

      hostSocket.emit('iniciar_jogo', roomId);
      const spinningState = await startGamePromise;

      expect(spinningState.phase).toBe('SPINNING');
      expect(spinningState.spinnerId).toBe(hostSocket.id); // O anfitrião começa.

      // Criamos uma Promise para esperar pela fase de CHOOSING.
      const spinPromise = new Promise<GameState>((resolve) => {
        hostSocket.on('update_game_state', (gs) => {
          if (gs.phase === 'CHOOSING') resolve(gs);
        });
      });

      hostSocket.emit('spin_bottle', roomId);
      const choosingState = await spinPromise;

      expect(choosingState.phase).toBe('CHOOSING');
      expect(choosingState.questionerId).toBeDefined();
      expect(choosingState.responderId).toBeDefined();
      expect(choosingState.questionerId).not.toBe(hostSocket.id);
      expect(choosingState.responderId).not.toBe(hostSocket.id);
    }, 20000);
  });
});
