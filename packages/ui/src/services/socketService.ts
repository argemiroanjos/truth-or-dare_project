import { io, Socket } from 'socket.io-client';
import { GameState } from '@verdade-ou-desafio/common/interfaces/Game';

const SOCKET_URL = 'http://localhost:3333';

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log(`[SocketService] Conectado ao servidor com o ID: ${this.socket.id}`);
    });

    this.socket.on('disconnect', () => {
      console.log('[SocketService] Desconectado do servidor.');
    });
  }

  public onConnect(callback: (id: string) => void) {
    this.socket.on('connect', () => {
      if (this.socket.id) {
        console.log(`[SocketService] Conectado com o ID: ${this.socket.id}`);
        callback(this.socket.id);
      }
    });
  }

  public createRoom(playerName: string) {
    this.socket.emit('criar_sala', playerName);
  }

  public joinRoom(roomId: string, playerName: string) {
    this.socket.emit('entrar_na_sala', { roomId, playerName });
  }

  public startGame(roomId: string) {
    this.socket.emit('iniciar_jogo', roomId);
  }

  public onGameStateUpdate(callback: (gameState: GameState) => void) {
    this.socket.on('update_game_state', callback);
  }

  public onRoomError(callback: (message: string) => void) {
    this.socket.on('erro_sala', callback);
  }
}

export default new SocketService();
