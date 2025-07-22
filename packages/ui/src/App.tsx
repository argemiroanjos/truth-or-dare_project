import { useGame } from './context/GameContext';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Footer from './components/Footer';
import FeedbackButton from './components/FeedbacksButton';

function App() {
  const { gameState } = useGame();

  const renderPage = () => {
    if (gameState && gameState.phase !== 'LOBBY') {
      return <Game />;
    }
    if (gameState && gameState.phase === 'LOBBY') {
      return <Lobby />;
    }
    return <Home />;
  };

  return (
    <>
      {renderPage()}
      <FeedbackButton />
      <Footer />
    </>
  );
}

export default App;
