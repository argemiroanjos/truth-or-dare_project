import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Game from './Game';
import { GameContext } from '../context/GameContext';
import { GameState } from '@verdade-ou-desafio/common/interfaces/Game';

const mockSpinningState: GameState = {
  id: 'ABCD',
  hostId: 'host-socket-id',
  phase: 'SPINNING',
  players: [
    { id: 'host-socket-id', name: 'Anfitrião', consecutiveTruths: 0, suspensionCount: 0 },
    { id: 'player2-socket-id', name: 'Jogador 2', consecutiveTruths: 0, suspensionCount: 0 },
  ],
  spinnerId: 'host-socket-id',
  questionerId: null,
  responderId: null,
  questionerPool: [],
  currentCard: null,
  votes: {},
  usedCardIds: {},
};

const renderWithContext = (ui: React.ReactElement, providerProps: any) => {
  return render(
    <GameContext.Provider value={providerProps}>{ui}</GameContext.Provider>
  );
};

describe('Testando o componente: Game', () => {
  it("deve renderizar a mensagem 'É a vez de...' na fase de SPINNING", () => {
    renderWithContext(<Game />, {
      gameState: mockSpinningState,
      socketId: 'player2-socket-id',
    });

    expect(screen.getByText(/É a vez de/i)).toBeInTheDocument();
    expect(screen.getByTestId('turn-player')).toHaveTextContent('Anfitrião');
  });

  it('deve mostrar a mensagem de clique na garrafa para o jogador correto', () => {
    renderWithContext(<Game />, {
      gameState: mockSpinningState,
      socketId: 'host-socket-id',
    });

    expect(screen.getByText(/clique na garrafa/i)).toBeInTheDocument();
  });
});
