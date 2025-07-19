import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

const playerAvatars = ['🐵', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐷'];

// Posições pré-definidas para garantir um layout claro e sem ambiguidades.
const LAYOUTS: { [key: number]: { x: number; y: number }[] } = {
  1: [{ x: 0, y: -160 }],
  2: [{ x: 0, y: -160 }, { x: 0, y: 160 }],
  3: [{ x: 0, y: -160 }, { x: 138, y: 80 }, { x: -138, y: 80 }],
  4: [{ x: 0, y: -160 }, { x: 160, y: 0 }, { x: 0, y: 160 }, { x: -160, y: 0 }],
  5: [{ x: 0, y: -160 }, { x: 152, y: -49 }, { x: 94, y: 129 }, { x: -94, y: 129 }, { x: -152, y: -49 }],
  6: [{ x: 0, y: -160 }, { x: 138, y: -80 }, { x: 138, y: 80 }, { x: 0, y: 160 }, { x: -138, y: 80 }, { x: -138, y: -80 }],
  7: [{ x: 0, y: -160 }, { x: 125, y: -100 }, { x: 152, y: 49 }, { x: 49, y: 152 }, { x: -49, y: 152 }, { x: -152, y: 49 }, { x: -125, y: -100 }],
  8: [{ x: 0, y: -160 }, { x: 113, y: -113 }, { x: 160, y: 0 }, { x: 113, y: 113 }, { x: 0, y: 160 }, { x: -113, y: 113 }, { x: -160, y: 0 }, { x: -113, y: -113 }],
};

const GamePage: React.FC = () => {
  const { gameState, socketId, spinBottle } = useGame();
  const [bottleRotation, setBottleRotation] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!gameState) return;

    if (gameState.phase === 'SPINNING') {
      setIsRevealed(false);
    }

    if (!gameState.responderId || !gameState.questionerId || gameState.phase !== 'CHOOSING') return;

    const { players, questionerId, responderId } = gameState;
    const layout = LAYOUTS[players.length] || [];

    const questionerIndex = players.findIndex(p => p.id === questionerId);
    const responderIndex = players.findIndex(p => p.id === responderId);

    const questionerPos = layout[questionerIndex];
    const responderPos = layout[responderIndex];

    if (questionerPos && responderPos) {
      const angleRad = Math.atan2(responderPos.y - questionerPos.y, responderPos.x - questionerPos.x);
      const targetAngleDeg = angleRad * (180 / Math.PI) + 90;
      const finalRotation = (360 * 4) + targetAngleDeg;
      setBottleRotation(finalRotation);

      setTimeout(() => {
        setIsRevealed(true);
      }, 3000);
    }
  }, [gameState?.responderId, gameState?.questionerId, gameState?.phase]);

  if (!gameState) return null;

  const { players, phase, spinnerId, questionerId, responderId, id: roomId } = gameState;
  
  const spinner = players.find(p => p.id === spinnerId);
  const questioner = players.find(p => p.id === questionerId);
  const responder = players.find(p => p.id === responderId);
  
  const isMyTurnToSpin = socketId === spinnerId;
  const isMyTurnToChoose = socketId === questionerId;

  const handleSpinBottle = () => {
    if (isMyTurnToSpin && phase === 'SPINNING') {
      spinBottle(roomId);
    }
  };

  const currentLayout = LAYOUTS[players.length] || [];

  if (players.length < 2 && phase !== 'LOBBY') {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-indigo-950 text-white p-4">
        <h1 className="text-5xl font-display mb-4">Fim de Jogo!</h1>
        <p className="text-xl text-gray-400">Não há jogadores suficientes para continuar.</p>
        <p className="mt-8 text-2xl">O último a sair, apaga a luz... <span className="font-bold text-yellow-400">{players[0]?.name || 'ninguém'}</span>!</p>
      </main>
    );
  }

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-950 to-black p-4 text-white overflow-hidden">
      
      <div className="text-center absolute top-10 z-20 h-20">
        {phase === 'SPINNING' && spinner && (
          <>
            <h1 className="text-2xl font-display">É a vez de <span className="font-bold text-yellow-400">{spinner.name}</span></h1>
            <p className="text-gray-400">{isMyTurnToSpin ? "Clique na garrafa para girar!" : "Aguardando o jogador girar a garrafa..."}</p>
          </>
        )}
        {phase === 'CHOOSING' && questioner && responder && isRevealed && (
          <>
            <h1 className="text-2xl font-display"><span className="font-bold text-pink-400">{questioner.name}</span>, escolha para</h1>
            <p className="text-2xl font-display font-bold text-cyan-400">{responder.name}</p>
          </>
        )}
      </div>

      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group 
          ${isMyTurnToSpin && phase === 'SPINNING' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        onClick={handleSpinBottle}
      >
        <svg 
          className={`w-12 h-28 text-pink-500 ${isMyTurnToSpin && phase === 'SPINNING' && 'group-hover:scale-110'}`}
          style={{ transform: `rotate(${bottleRotation}deg)`, transition: 'transform 3s cubic-bezier(0.25, 1, 0.5, 1)'}}
          fill="none" viewBox="0 0 48 112" xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M32 2H16C14.8954 2 14 2.89543 14 4V14H34V4C34 2.89543 33.1046 2 32 2Z" stroke="currentColor" strokeWidth="3"/>
          <path d="M38 14H10C7.79086 14 6 15.7909 6 18V102C6 106.418 9.58172 110 14 110H34C38.4183 110 42 106.418 42 102V18C42 15.7908 40.2091 14 38 14Z" stroke="currentColor" strokeWidth="3"/>
        </svg>
      </div>

      {players.map((player, index) => {
        const position = currentLayout[index] || { x: 0, y: 0 };
        const isSpinner = player.id === spinnerId;
        const isQuestioner = player.id === questionerId;
        const isResponder = player.id === responderId;

        let highlightClass = 'bg-gray-800';
        if (phase === 'SPINNING' && isSpinner) highlightClass = 'bg-yellow-500 ring-4 ring-offset-4 ring-offset-black ring-yellow-400 shadow-lg shadow-yellow-500/50';
        if (phase === 'CHOOSING' && isRevealed && isQuestioner) highlightClass = 'bg-pink-500 ring-4 ring-offset-4 ring-offset-black ring-pink-400 shadow-lg shadow-pink-500/50';
        if (phase === 'CHOOSING' && isRevealed && isResponder) highlightClass = 'bg-cyan-500 ring-4 ring-offset-4 ring-offset-black ring-cyan-400 shadow-lg shadow-cyan-500/50';
        
        return (
          <div
            key={player.id}
            className="absolute top-1/2 left-1/2 flex flex-col items-center gap-2"
            style={{ transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)` }}
          >
            <div 
              className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all duration-300 ${highlightClass}`}
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
        {phase === 'CHOOSING' && isMyTurnToChoose && isRevealed && (
          <>
            <button className="bg-cyan-500 text-white font-bold text-xl py-4 px-12 rounded-lg shadow-lg hover:bg-cyan-600">VERDADE</button>
            <button className="bg-pink-600 text-white font-bold text-xl py-4 px-12 rounded-lg shadow-lg hover:bg-pink-700">DESAFIO</button>
          </>
        )}
      </div>
    </main>
  );
};

export default GamePage;