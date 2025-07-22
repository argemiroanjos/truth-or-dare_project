import React from 'react';
import { Card, Votes } from '@verdade-ou-desafio/common/interfaces/Game';

interface VotingModalProps {
  card: Card;
  votes: Votes;
  isResponder: boolean;
  hasVoted: boolean;
  onSubmitVote: (vote: 'like' | 'dislike') => void;
}

const VotingModal: React.FC<VotingModalProps> = ({ card, votes, isResponder, hasVoted, onSubmitVote }) => {
  const totalLikes = Object.values(votes).filter(v => v === 'like').length;
  const totalDislikes = Object.values(votes).filter(v => v === 'dislike').length;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30 animate-fade-in">
      <div className="bg-indigo-900 border-2 border-yellow-400 rounded-2xl p-8 max-w-lg text-center shadow-2xl shadow-yellow-400/30">
        <h2 className="font-display text-3xl font-bold mb-4 text-yellow-400">VOTAÇÃO</h2>
        <p className="text-xl text-gray-300 mb-6">A ação foi cumprida?</p>
        <p className="text-2xl text-white mb-8 bg-black/20 p-4 rounded-lg">"{card.content}"</p>
        {isResponder ? (
          <p className="text-lg text-gray-400">Aguardando os votos dos outros jogadores...</p>
        ) : hasVoted ? (
          <p className="text-lg text-green-400">O seu voto foi registrado! Aguardando os outros...</p>
        ) : (
          <div className="flex gap-4 justify-center">
            <button onClick={() => onSubmitVote('like')} className="bg-green-500 text-white text-4xl w-24 h-24 rounded-full shadow-lg hover:bg-green-600">👍</button>
            <button onClick={() => onSubmitVote('dislike')} className="bg-red-500 text-white text-4xl w-24 h-24 rounded-full shadow-lg hover:bg-red-600">👎</button>
          </div>
        )}
        <div className="mt-6 flex justify-center gap-6 text-2xl">
          <span className="text-green-400">👍 {totalLikes}</span>
          <span className="text-red-400">👎 {totalDislikes}</span>
        </div>
      </div>
    </div>
  );
};

export default VotingModal;
