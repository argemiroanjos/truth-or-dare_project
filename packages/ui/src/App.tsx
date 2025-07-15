import { useGame } from './context/GameContext';
import Home from './pages/Home';
import Lobby from './pages/Lobby';

function App() {
  const { gameState } = useGame();

  if (gameState && gameState.status === 'lobby') {
    return <Lobby />;
  }
  return <Home />;
}

export default App;
