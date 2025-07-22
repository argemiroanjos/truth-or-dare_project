import React from 'react';
import { Votes } from '@verdade-ou-desafio/common/interfaces/Game';

interface VerdictModalProps {
  votes: Votes;
  isQuestioner: boolean;
  onConfirmVerdict: (verdict: 'accepted' | 'rejected') => void;
}

const VerdictModal: React.FC<VerdictModalProps> = ({ votes, isQuestioner, onConfirmVerdict }) => {
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
          <p className="text-lg text-gray-400 animate-pulse">Aguardando o veredito do Questioner...</p>
        )}
      </div>
    </div>
  );
};

export default VerdictModal;
