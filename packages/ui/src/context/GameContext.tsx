import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import socketService from '../services/socketService';
import { GameState } from '@verdade-ou-desafio/common/interfaces/Game';

// Definimos a interface do contexto do jogo.
interface IGameContext {
  gameState: GameState | null;
  socketId: string | null;
  createRoom: (playerName: string) => void;
  joinRoom: (roomId: string, playerName: string) => void;
  startGame: (roomId: string) => void;
}

const GameContext = createContext<IGameContext>(null!);

// Hook para acessar o contexto do jogo.
// Isso facilita o acesso ao contexto em outros componentes.
export const useGame = () => {
  return useContext(GameContext);
};

// Componente provedor do contexto do jogo.
// Ele encapsula a lógica de estado do jogo e fornece funções para criar e entrar em salas
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);

  // useEffect para configurar os listeners do socket quando o componente é montado.
  useEffect(() => {
    socketService.onConnect((id) => {
      setSocketId(id);
    });

    socketService.onGameStateUpdate((newGameState) => {
      console.log('[GameContext] Estado do jogo atualizado:', newGameState);
      setGameState(newGameState);
    });

    socketService.onRoomError((message) => {
      console.error('[GameContext] Erro da sala:', message);
      alert(message);
    });
  }, []);

  const createRoom = (playerName: string) => {
    socketService.createRoom(playerName);
  };

  const joinRoom = (roomId: string, playerName: string) => {
    socketService.joinRoom(roomId, playerName);
  };

    const startGame = (roomId: string) => {
    socketService.startGame(roomId);
  };

  const value = {
    gameState,
    socketId,
    createRoom,
    joinRoom,
    startGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
