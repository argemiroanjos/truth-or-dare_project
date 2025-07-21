import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Card, Votes } from '@verdade-ou-desafio/common/interfaces/Game';

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

const CardModal: React.FC<{
  card: Card;
  isResponder: boolean;
  onComplete: () => void;
}> = ({ card, isResponder, onComplete }) => {
  return (
    // O fundo semi-transparente que cobre o ecrã
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30 animate-fade-in">
      {/* O cartão em si */}
      <div className="bg-indigo-900 border-2 border-pink-500 rounded-2xl p-8 max-w-lg text-center shadow-2xl shadow-pink-500/30">
        <h2 className={`font-display text-4xl font-bold mb-6 ${card.type === 'truth' ? 'text-cyan-400' : 'text-pink-400'}`}>
          {card.type === 'truth' ? 'VERDADE' : 'DESAFIO'}
        </h2>
        <p className="text-2xl text-white mb-8">{card.content}</p>
        
        {/* O botão só aparece para o "Responder" */}
        {isResponder && (
          <button 
            onClick={onComplete}
            className="bg-green-500 text-white font-bold text-xl py-3 px-10 rounded-lg shadow-lg hover:bg-green-600"
          >
            Ação Concluída
          </button>
        )}
      </div>
    </div>
  );
};

const VotingModal: React.FC<{
  card: Card;
  votes: Votes;
  isResponder: boolean;
  hasVoted: boolean;
  onSubmitVote: (vote: 'like' | 'dislike') => void;
}> = ({ card, votes, isResponder, hasVoted, onSubmitVote }) => {
  const totalLikes = Object.values(votes).filter(v => v === 'like').length;
  const totalDislikes = Object.values(votes).filter(v => v === 'dislike').length;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30 animate-fade-in">
      <div className="bg-indigo-900 border-2 border-yellow-400 rounded-2xl p-8 max-w-lg text-center shadow-2xl shadow-yellow-400/30">
        <h2 className="font-display text-3xl font-bold mb-4 text-yellow-400">VOTAÇÃO</h2>
        <p className="text-xl text-gray-300 mb-6">A ação foi cumprida?</p>
        <p className="text-2xl text-white mb-8 bg-black/20 p-4 rounded-lg">"{card.content}"</p>
        
        {/* Lógica para mostrar os botões de voto ou a mensagem de espera */}
        {isResponder ? (
          <p className="text-lg text-gray-400">A aguardar os votos dos outros jogadores...</p>
        ) : hasVoted ? (
          <p className="text-lg text-green-400">O seu voto foi registado! A aguardar os outros...</p>
        ) : (
          <div className="flex gap-4 justify-center">
            <button onClick={() => onSubmitVote('like')} className="bg-green-500 text-white text-4xl w-24 h-24 rounded-full shadow-lg hover:bg-green-600">👍</button>
            <button onClick={() => onSubmitVote('dislike')} className="bg-red-500 text-white text-4xl w-24 h-24 rounded-full shadow-lg hover:bg-red-600">👎</button>
          </div>
        )}

        {/* Exibição dos resultados parciais */}
        <div className="mt-6 flex justify-center gap-6 text-2xl">
          <span className="text-green-400">👍 {totalLikes}</span>
          <span className="text-red-400">👎 {totalDislikes}</span>
        </div>
      </div>
    </div>
  );
};

const VerdictModal: React.FC<{
  votes: Votes;
  isQuestioner: boolean;
  onConfirmVerdict: (verdict: 'accepted' | 'rejected') => void;
}> = ({ votes, isQuestioner, onConfirmVerdict }) => {
  const totalLikes = Object.values(votes).filter(v => v === 'like').length;
  const totalDislikes = Object.values(votes).filter(v => v === 'dislike').length;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30 animate-fade-in">
      <div className="bg-indigo-900 border-2 border-green-400 rounded-2xl p-8 max-w-lg text-center shadow-2xl shadow-green-400/30">
        <h2 className="font-display text-3xl font-bold mb-4 text-green-400">VEREDITO</h2>
        <p className="text-xl text-gray-300 mb-6">A votação terminou!</p>
        
        <div className="mb-8 flex justify-center gap-6 text-4xl">
          <span className="text-green-400">👍 {totalLikes}</span>
          <span className="text-red-400">👎 {totalDislikes}</span>
        </div>
        
        {isQuestioner ? (
          <>
            <p className="text-lg text-gray-400 mb-4">Qual é a sua decisão final?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => onConfirmVerdict('accepted')} className="bg-green-500 text-white font-bold text-xl py-3 px-10 rounded-lg shadow-lg hover:bg-green-600">ACEITAR</button>
              <button onClick={() => onConfirmVerdict('rejected')} className="bg-red-500 text-white font-bold text-xl py-3 px-10 rounded-lg shadow-lg hover:bg-red-600">REJEITAR</button>
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-400 animate-pulse">A aguardar o veredito do Questioner...</p>
        )}
      </div>
    </div>
  );
};

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
      const finalRotation = (360 * 4) + targetAngleDeg;
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

  const TRUTH_LIMIT =  2;
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
        <p className="mt-8 text-2xl">O último a sair, apaga a luz... <span className="font-bold text-yellow-400">{players[0]?.name || 'ninguém'}</span>!</p>
      </main>
    );
  }

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-950 to-black p-4 text-white overflow-hidden">
      
      <div className="text-center absolute top-10 z-20 h-20">
        {phase === 'SPINNING' && spinner && (
          <>
            <h1 className="text-2xl font-display">É a vez de <span data-testid="turn-player" className="font-bold text-yellow-400">{spinner.name}</span></h1>
            <p className="text-gray-400">{isMyTurnToSpin ? "Clique na garrafa para girar!" : "Aguardando o jogador girar a garrafa..."}</p>
          </>
        )}
        {phase === 'CHOOSING' && questioner && responder && isRevealed && (
          <>
            <h1 className="text-2xl font-display"><span className="font-bold text-pink-400">{questioner.name}</span>, escolha para</h1>
            <p className="text-2xl font-display font-bold text-cyan-400">{responder.name}</p>
          </>
        )}
        {/* APLICAÇÃO DA SUSPENSÃO */}
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
            <button 
              onClick={handleSelectTruth} 
              disabled={isTruthDisabled} 
              className="bg-cyan-500 text-white font-bold text-xl py-4 px-12 rounded-lg shadow-lg hover:bg-cyan-600 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >VERDADE
            </button>
            <button onClick={handleSelectDare} className="bg-pink-600 text-white font-bold text-xl py-4 px-12 rounded-lg shadow-lg hover:bg-pink-700">DESAFIO</button>
          </>
        )}
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL PARA O MODAL */}
      {phase === 'ACTION' && currentCard && (
        <CardModal 
          card={currentCard}
          isResponder={isMyTurnToRespond}
          onComplete={handleCompleteAction}
        />
      )}
      {/* RENDERIZAÇÃO CONDICIONAL PARA O MODAL DE VOTAÇÃO */}
      {phase === 'VOTING' && currentCard && (
        <VotingModal 
          card={currentCard}
          votes={votes}
          isResponder={isMyTurnToRespond}
          hasVoted={hasVoted}
          onSubmitVote={handleSubmitVote}
        />
      )}
      {/* RENDERIZAÇÃO CONDICIONAL PARA O MODAL DE VEREDITO */}
      {phase === 'VERDICT' && (
        <VerdictModal 
          votes={votes}
          isQuestioner={isMyTurnToChoose}
          onConfirmVerdict={handleConfirmVerdict}
        />
      )}
    </main>
  );
};

export default GamePage;