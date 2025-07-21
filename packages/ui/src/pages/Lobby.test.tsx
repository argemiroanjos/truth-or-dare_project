import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Lobby from './Lobby';
import { GameContext } from '../context/GameContext';
import { GameState } from '@verdade-ou-desafio/common/interfaces/Game';

const mockGameState: GameState = {
  id: 'ABCD',
  hostId: 'host-socket-id',
  phase: 'LOBBY',
  players: [
    { id: 'host-socket-id', name: 'Anfitrião', consecutiveTruths: 0, suspensionCount: 0 },
    { id: 'player2-socket-id', name: 'Jogador 2', consecutiveTruths: 0, suspensionCount: 0 },
  ],
  questionerPool: [],
  spinnerId: null,
  questionerId: null,
  responderId: null,
  currentCard: null,
  votes: {},
  usedCardIds: {},
};

const renderWithContext = (ui: React.ReactElement, providerProps: any) => {
  return render(
    <GameContext.Provider value={providerProps}>{ui}</GameContext.Provider>
  );
};

describe('Testando o componente: Lobby', () => {
  it('deve exibir o código da sala e jogadores', () => {
    renderWithContext(<Lobby />, {
      gameState: mockGameState,
      socketId: 'player2-socket-id',
      startGame: jest.fn(),
    });

    expect(screen.getByText('ABCD')).toBeInTheDocument();
    expect(screen.getByText('Anfitrião')).toBeInTheDocument();
    expect(screen.getByText('Jogador 2')).toBeInTheDocument();
  });

  it('deve mostrar "Aguardando" para jogadores não anfitriões', () => {
    renderWithContext(<Lobby />, {
      gameState: mockGameState,
      socketId: 'player2-socket-id',
      startGame: jest.fn(),
    });

    expect(screen.getByText(/aguardando o anfitrião iniciar o jogo/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /iniciar jogo/i })).not.toBeInTheDocument();
  });

  it('deve habilitar o botão iniciar para o anfitrião com 2+ jogadores', () => {
    renderWithContext(<Lobby />, {
      gameState: mockGameState,
      socketId: 'host-socket-id',
      startGame: jest.fn(),
    });

    const startButton = screen.getByRole('button', { name: /iniciar jogo/i });
    expect(startButton).toBeInTheDocument();
    expect(startButton).not.toBeDisabled();
  });
});
