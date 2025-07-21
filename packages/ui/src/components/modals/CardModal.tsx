import React from 'react';
import { Card } from '@verdade-ou-desafio/common/interfaces/Game';

interface CardModalProps {
  card: Card;
  isResponder: boolean;
  onComplete: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, isResponder, onComplete }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30 animate-fade-in">
      <div className="bg-indigo-900 border-2 border-pink-500 rounded-2xl p-8 max-w-lg text-center shadow-2xl shadow-pink-500/30">
        <h2 className={`font-display text-4xl font-bold mb-6 ${card.type === 'truth' ? 'text-cyan-400' : 'text-pink-400'}`}>
          {card.type === 'truth' ? 'VERDADE' : 'DESAFIO'}
        </h2>
        <p className="text-2xl text-white mb-8">{card.content}</p>
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

export default CardModal;
