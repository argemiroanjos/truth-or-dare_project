import { io, Socket } from 'socket.io-client';
import { GameState } from '@verdade-ou-desafio/common/interfaces/Game';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    this.socket.on('disconnect', () => {
      if (import.meta.env.DEV) {
        console.log('[SocketService] Desconectado do servidor.');
      }
    });
  }

  public onConnect(callback: (id: string) => void) {
    this.socket.on('connect', () => {
      if (this.socket.id) {
        if (import.meta.env.DEV) {
        console.log(`[SocketService] Conectado com o ID: ${this.socket.id}`);
        }
        callback(this.socket.id);
      }
    });
  }

  // Métodos de eventos do jogo
  public createRoom(playerName: string) {
    this.socket.emit('criar_sala', playerName);
  }

  public joinRoom(roomId: string, playerName: string) {
    this.socket.emit('entrar_na_sala', { roomId, playerName });
  }

  public startGame(roomId: string) {
    this.socket.emit('iniciar_jogo', roomId);
  }

  public spinBottle(roomId: string) {
    this.socket.emit('spin_bottle', roomId);
  }

  public makeChoice(roomId: string, choice: 'truth' | 'dare') {
    this.socket.emit('make_choice', { roomId, choice });
  }

  public completeAction(roomId: string) {
    this.socket.emit('action_complete', roomId);
  }

  public submitVote(roomId: string, vote: 'like' | 'dislike') {
    this.socket.emit('submit_vote', { roomId, vote });
  }

  public confirmVerdict(roomId: string, verdict: 'accepted' | 'rejected') {
    this.socket.emit('confirm_verdict', { roomId, verdict });
  }

  public nextRound(roomId: string) {
    this.socket.emit('next_round', roomId);
  }

    public leaveRoom() {
    this.socket.emit('leave_room');
  }

  public onGameStateUpdate(callback: (gameState: GameState) => void) {
    this.socket.on('update_game_state', callback);
  }

  public onRoomError(callback: (message: string) => void) {
    this.socket.on('erro_sala', callback);
  }
}

export default new SocketService();
