import React from 'react';
import { useGame } from '../context/GameContext';

const playerAvatars = ['🐵', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐷'];

const GamePage: React.FC = () => {
  const { gameState, socketId, spinBottle } = useGame();

  if (!gameState) {
    return null; 
  }

  const { players, phase, spinnerId, id: roomId } = gameState;
  const totalPlayers = players.length;
  const radius = 160;

  const spinner = players.find(p => p.id === spinnerId);
  const isMyTurnToSpin = socketId === spinnerId;

  const handleSpinBottle = () => {
    if (isMyTurnToSpin) {
      spinBottle(roomId);
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-950 to-black p-4 text-white overflow-hidden">
      <div className="text-center absolute top-10 z-20">
        {phase === 'SPINNING' && spinner && (
          <>
            <h1 className="text-2xl font-display">
              É a vez de <span className="font-bold text-cyan-400">{spinner.name}</span>
            </h1>
            <p className="text-gray-400">
              {isMyTurnToSpin ? "Clique na garrafa para girar!" : "Aguardando o jogador girar a garrafa..."}
            </p>
          </>
        )}
      </div>
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group ${isMyTurnToSpin ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        onClick={handleSpinBottle}
      >
        <svg 
          className={`w-12 h-28 text-pink-500 ${isMyTurnToSpin && 'group-hover:scale-110'} transition-transform duration-300`}
          fill="none" 
          viewBox="0 0 48 112" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M32 2H16C14.8954 2 14 2.89543 14 4V14H34V4C34 2.89543 33.1046 2 32 2Z" stroke="currentColor" strokeWidth="3"/>
          <path d="M38 14H10C7.79086 14 6 15.7909 6 18V102C6 106.418 9.58172 110 14 110H34C38.4183 110 42 106.418 42 102V18C42 15.7908 40.2091 14 38 14Z" stroke="currentColor" strokeWidth="3"/>
        </svg>
      </div>
      {players.map((player, index) => {
        const angleRad = (index / totalPlayers) * 2 * Math.PI;
        const angleWithOffset = angleRad - Math.PI / 2; 
        const x = radius * Math.cos(angleWithOffset);
        const y = radius * Math.sin(angleWithOffset);

        const isSpinner = player.id === spinnerId;

        return (
          <div
            key={player.id}
            className="absolute top-1/2 left-1/2 flex flex-col items-center gap-2"
            style={{
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
            }}
          >
            <div 
              className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all duration-300
                ${isSpinner 
                  ? 'bg-cyan-500 ring-4 ring-offset-4 ring-offset-black ring-cyan-400 shadow-lg shadow-cyan-500/50' 
                  : 'bg-gray-800'}`
              }
            >
              {playerAvatars[index % playerAvatars.length]}
            </div>
            <span className="font-bold text-white px-2 py-1 rounded-md">
              {player.name}
            </span>
          </div>
        );
      })}
      <div className="absolute bottom-10 flex gap-4 z-20">
      </div>
    </main>
  );
};

export default GamePage;