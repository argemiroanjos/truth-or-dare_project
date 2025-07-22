import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import CardModal from '../components/modals/CardModal';
import VotingModal from '../components/modals/VotingModal';
import VerdictModal from '../components/modals/VerdictModal';
import { LAYOUTS } from '../constants/layouts';

const playerAvatars = ['🐵', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐷'];

const TRUTH_LIMIT = 2;

const GamePage: React.FC = () => {
  const { gameState, socketId, spinBottle, makeChoice, completeAction, submitVote, confirmVerdict } = useGame();
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
      const currentFullSpins = Math.floor(bottleRotation / 360);
      const finalRotation = (currentFullSpins + 10) * 360 + targetAngleDeg;
      setBottleRotation(finalRotation);

      setTimeout(() => {
        setIsRevealed(true);
      }, 3000);
    }
  }, [gameState?.responderId, gameState?.questionerId, gameState?.phase]);

  if (!gameState) return null;

  const { players, phase, spinnerId, questionerId, responderId, currentCard, votes, id: roomId } = gameState;

  const spinner = players.find(p => p.id === spinnerId);
  const questioner = players.find(p => p.id === questionerId);
  const responder = players.find(p => p.id === responderId);

  const isMyTurnToSpin = socketId === spinnerId;
  const isMyTurnToChoose = socketId === questionerId;
  const isMyTurnToRespond = socketId === responderId;
  const hasVoted = socketId ? votes[socketId] !== undefined : false;

  const isTruthDisabled = responder ? responder.consecutiveTruths >= TRUTH_LIMIT : false;

  const handleSpinBottle = () => {
    if (isMyTurnToSpin && phase === 'SPINNING') {
      spinBottle(roomId);
    }
  };

  const handleSelectTruth = () => {
    if (isMyTurnToChoose) {
      makeChoice(roomId, 'truth');
    }
  };

  const handleSelectDare = () => {
    if (isMyTurnToChoose) {
      makeChoice(roomId, 'dare');
    }
  };

  const handleCompleteAction = () => {
    if (isMyTurnToRespond) {
      completeAction(roomId);
    }
  };

  const handleSubmitVote = (vote: 'like' | 'dislike') => {
    if (!isMyTurnToRespond && !hasVoted) {
      submitVote(roomId, vote);
    }
  };

  const handleConfirmVerdict = (verdict: 'accepted' | 'rejected') => {
    if (isMyTurnToChoose) {
      confirmVerdict(roomId, verdict);
    }
  };

  const currentLayout = LAYOUTS[players.length] || [];

  if (players.length < 2 && phase !== 'LOBBY') {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-indigo-950 text-white p-4">
        <h1 className="text-5xl font-display mb-4">Fim de Jogo!</h1>
        <p className="text-xl text-gray-400">Não há jogadores suficientes para continuar.</p>
        <p className="mt-8 text-2xl">
          O último a sair, apaga a luz... <span className="font-bold text-blue-400">{players[0]?.name || 'ninguém'}</span>!
        </p>
      </main>
    );
  }

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-950 to-black p-4 text-white overflow-hidden">

      <div className="text-center absolute top-10 z-20 h-20">
        {phase === 'SPINNING' && spinner && (
          <>
            <h1 className="text-2xl font-display">
              É a vez de <span data-testid="turn-player" className="font-bold text-white-400">{spinner.name}</span>
            </h1>
            <p className="text-gray-400">{isMyTurnToSpin ? "Clique na garrafa para girar!" : "Aguardando o jogador girar a garrafa..."}</p>
          </>
        )}
        {phase === 'CHOOSING' && questioner && responder && isRevealed && (
          <>
            <h1 className="text-2xl font-display">
              <span className="font-bold text-pink-400">{questioner.name}</span>, escolha para
            </h1>
            <p className="text-2xl font-display font-bold text-cyan-400">{responder.name}</p>
          </>
        )}
        {phase === 'SUSPENDED' && questioner && (
          <div className="animate-pulse">
            <h1 className="text-2xl font-display text-red-500">SUSPENSO!</h1>
            <p className="text-xl text-gray-400">
              <span className="font-bold">{questioner.name}</span> perdeu a vez de perguntar!
            </p>
          </div>
        )}
      </div>

      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group 
          ${isMyTurnToSpin && phase === 'SPINNING' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        onClick={handleSpinBottle}
      >
                <svg 
          width="50" 
          height="140" 
          viewBox="0 0 50 140" 
          className={`text-pink-500 ${isMyTurnToSpin && phase === 'SPINNING' && 'group-hover:scale-110'}`}
          style={{ transform: `rotate(${bottleRotation}deg)`, transition: 'transform 3s cubic-bezier(0.25, 1, 0.5, 1)'}}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g style={{ filter: 'url(#glow)' }}>
            <path d="M15 138 C 5 138, 5 130, 5 120 L 5 45 C 5 35, 10 30, 15 30 L 35 30 C 40 30, 45 35, 45 45 L 45 120 C 45 130, 45 138, 35 138 Z" fill="rgba(236, 72, 153, 0.1)" stroke="currentColor" strokeWidth="3"/>
            <path d="M20 30 L 20 10 C 20 5, 22 2, 25 2 C 28 2, 30 5, 30 10 L 30 30 Z" fill="rgba(236, 72, 153, 0.1)" stroke="currentColor" strokeWidth="3"/>
            <rect x="18" y="0" width="14" height="5" rx="2" fill="currentColor"/>
            <path d="M12 120 C 15 90, 15 60, 12 50" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" fill="none"/>
          </g>
        </svg>
      </div>

      {players.map((player, index) => {
        const position = currentLayout[index] || { x: 0, y: 0 };
        const isSpinner = player.id === spinnerId;
        const isQuestioner = player.id === questionerId;
        const isResponder = player.id === responderId;

        let highlightClass = 'bg-gray-800';
        if (phase === 'SPINNING' && isSpinner) highlightClass = 'bg-gray-700 ring-4 ring-offset-4 ring-offset-black ring-white shadow-lg shadow-white/50';
        if (phase === 'CHOOSING' && isRevealed && isQuestioner) highlightClass = 'bg-pink-500 ring-4 ring-offset-4 ring-offset-black ring-pink-400 shadow-lg shadow-pink-500/50';
        if (phase === 'CHOOSING' && isRevealed && isResponder) highlightClass = 'bg-cyan-500 ring-4 ring-offset-4 ring-offset-black ring-cyan-400 shadow-lg shadow-cyan-500/50';

        return (
          <div
            key={player.id}
            className="absolute top-1/2 left-1/2 flex flex-col items-center gap-2"
            style={{ transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)` }}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all duration-300 ${highlightClass}`}>
              {playerAvatars[index % playerAvatars.length]}
            </div>
            <span className="font-bold text-white px-2 py-1 rounded-md">{player.name}</span>
          </div>
        );
      })}

      <div className="absolute bottom-10 flex gap-4 z-20">
        {phase === 'CHOOSING' && isMyTurnToChoose && isRevealed && (
          <>
            <button
              onClick={handleSelectTruth}
              disabled={isTruthDisabled}
              className="bg-cyan-500 text-white font-bold text-xl py-4 px-12 rounded-lg shadow-lg hover:bg-cyan-600 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              VERDADE
            </button>
            <button
              onClick={handleSelectDare}
              className="bg-pink-600 text-white font-bold text-xl py-4 px-12 rounded-lg shadow-lg hover:bg-pink-700"
            >
              DESAFIO
            </button>
          </>
        )}
      </div>
      {phase === 'ACTION' && currentCard && (
        <CardModal card={currentCard} isResponder={isMyTurnToRespond} onComplete={handleCompleteAction} />
      )}
      {phase === 'VOTING' && currentCard && (
        <VotingModal
          card={currentCard}
          votes={votes}
          isResponder={isMyTurnToRespond}
          hasVoted={hasVoted}
          onSubmitVote={handleSubmitVote}
        />
      )}
      {phase === 'VERDICT' && (
        <VerdictModal votes={votes} isQuestioner={isMyTurnToChoose} onConfirmVerdict={handleConfirmVerdict} />
      )}
    </main>
  );
};

export default GamePage;