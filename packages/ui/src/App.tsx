import { useGame } from './context/GameContext';
import Game from './pages/Game';
import Home from './pages/Home';
import Lobby from './pages/Lobby';

function App() {
  const { gameState } = useGame();

  if (gameState && gameState.phase !== 'LOBBY') {
    return <Game />;
  }

  if (gameState && gameState.phase === 'LOBBY') {
    return <Lobby />;
  }

  return <Home />;
}

export default App;
