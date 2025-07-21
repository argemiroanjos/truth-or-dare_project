import React from 'react';

interface GamePlayerProps {
  avatar: string;
  name: string;
  position: { x: number; y: number };
  highlightClass: string;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ avatar, name, position, highlightClass }) => {
  return (
    <div
      className="absolute top-1/2 left-1/2 flex flex-col items-center gap-2"
      style={{ transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)` }}
    >
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all duration-300 ${highlightClass}`}
      >
        {avatar}
      </div>
      <span className="font-bold text-white px-2 py-1 rounded-md">
        {name}
      </span>
    </div>
  );
};

export default GamePlayer;
