import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import kekasMascot from '../assets/mascote.png'; 
import IconButton from '../components/IconButton';
import ExitModal from '../components/modals/ExitModal';

const Lobby: React.FC = () => {
  // Usando hook personalizado useGame para acessar o estado do jogo.
  const { gameState, startGame, socketId, leaveRoom } = useGame();
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // Se o estado do jogo não estiver disponível, mostra uma mensagem de carregamento.
  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-indigo-950">
        <p className="text-white text-2xl">Carregando sala...</p>
      </div>
    );
  }

  const { id: roomId, players, hostId } = gameState;

    const isHost = socketId === hostId;
  const canStart = isHost && players.length >= 2;

  const handleStartGame = () => {
    if (canStart) {
      startGame(roomId);
    }
  };

    const handleConfirmExit = () => {
    leaveRoom();
    setIsExitModalOpen(false);
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-indigo-950 to-black p-4 text-white pt-16 md:pt-24 pb-24">
      <div className="absolute top-4 left-4">
        <IconButton onClick={() => setIsExitModalOpen(true)} title="Sair da Sala">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </IconButton>
      </div>
      <header className="w-full max-w-xs md:max-w-sm mb-8">
        <img src={kekasMascot} alt="Mascote Keka's" className="w-20 h-auto mx-auto" />
      </header>

      {/* Card principal com as informações da sala */}
      <div className="w-full max-w-md bg-black bg-opacity-20 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-700">
        
        {/* Título da Sala */}
        <div className="mb-6 text-center">
          <label className="text-sm text-gray-400">Código da Sala</label>
          <div className="text-4xl font-bold tracking-widest text-cyan-400 mt-1">
            {roomId}
          </div>
        </div>

        {/* Lista de Jogadores */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">Jogadores ({players.length})</h2>
          <ul className="space-y-3">
            {players.map((player) => (
              <li key={player.id} className="flex items-center bg-gray-800 p-3 rounded-lg">
                {player.id === hostId ? (
                  <span className="mr-3 text-yellow-400 text-2xl">👑</span>
                ) : (
                  <span className="mr-3 text-2xl">👤</span>
                )}
                <span className="font-semibold text-lg">{player.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Botão de Iniciar Jogo com lógica */}
      <div className="mt-8 h-16">
        {isHost ? (
          <button 
            onClick={handleStartGame}
            disabled={!canStart}
            className="bg-pink-600 text-white font-bold text-xl py-4 px-12 rounded-lg shadow-lg hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300"
          >
            {players.length < 2 ? `Aguardando mais ${2 - players.length} jogadores` : 'INICIAR JOGO'}
          </button>
        ) : (
          <p className="text-lg text-gray-400">Aguardando o anfitrião iniciar o jogo...</p>
        )}
      </div>
      <ExitModal 
        isOpen={isExitModalOpen} 
        onConfirm={handleConfirmExit} 
        onCancel={() => setIsExitModalOpen(false)} 
      />
    </main>
  );
};

export default Lobby;
