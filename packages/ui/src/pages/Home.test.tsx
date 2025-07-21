import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';
import { GameProvider } from '../context/GameContext';


describe('Testando o componente Home', () => {
  it('deve renderizar os botões de criar e entrar na sala', () => {
    render(
      <GameProvider>
        <Home />
      </GameProvider>
    );

    const createRoomButton = screen.getByRole('button', { name: /criar sala/i });
    const joinRoomButton = screen.getByRole('button', { name: /entrar numa sala/i });

    expect(createRoomButton).toBeInTheDocument();
    expect(joinRoomButton).toBeInTheDocument();
  });
});
