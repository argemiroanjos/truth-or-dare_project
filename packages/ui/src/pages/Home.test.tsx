import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';
import { GameProvider } from '../context/GameContext';

describe('Testando o componente: Home', () => {
  it('deve exibir botões para criar ou entrar numa sala', () => {
    render(
      <GameProvider>
        <Home />
      </GameProvider>
    );

    expect(screen.getByRole('button', { name: /criar sala/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar numa sala/i })).toBeInTheDocument();
  });
});
