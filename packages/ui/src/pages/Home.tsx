import React, { useState } from 'react';
import { useGame } from '../context/GameContext'; 
import kekasLogo from '../assets/kekas-logo2.png';

const Home: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');

  // Definindo o estado para controlar qual formulário mostrar.
  const [formToShow, setFormToShow] = useState<'initial' | 'create' | 'join'>('initial');

  // Importando as funções do contexto de jogo.
  const { createRoom, joinRoom } = useGame();

  const handleCreateRoom = () => {
    // Validação simples: o nome do jogador não pode ser vazio.
    if (playerName.trim()) {
      createRoom(playerName);
    } else {
      alert('Por favor, insira o seu nome!');
    }
  };

  const handleJoinRoom = () => {
    // Validação simples: o nome do jogador e o ID da sala não podem ser vazios.
    if (playerName.trim() && roomId.trim()) {
      joinRoom(roomId.toUpperCase(), playerName);
    } else {
      alert('Por favor, insira o seu nome e o código da sala!');
    }
  };

  // Função para renderizar o conteúdo dinâmico com base no estado do formulário.
  const renderContent = () => {
    switch (formToShow) {
      case 'create':
        return (
          <div className="w-full max-w-sm flex flex-col gap-4">
            <input
              type="text"
              placeholder="Digite o seu nome"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-gray-800 text-white text-center text-lg p-3 rounded-lg border-2 border-gray-600 focus:border-pink-500 focus:outline-none"
            />
            <button onClick={handleCreateRoom} className="bg-pink-600 text-white font-bold text-xl py-4 px-8 rounded-lg shadow-lg hover:bg-pink-700 transform hover:scale-105 transition-transform duration-300">
              CRIAR
            </button>
          </div>
        );
      case 'join':
        return (
          <div className="w-full max-w-sm flex flex-col gap-4">
            <input
              type="text"
              placeholder="Digite o seu nome"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-gray-800 text-white text-center text-lg p-3 rounded-lg border-2 border-gray-600 focus:border-cyan-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              maxLength={4}
              className="bg-gray-800 text-white text-center text-lg p-3 rounded-lg border-2 border-gray-600 focus:border-cyan-500 focus:outline-none uppercase"
            />
            <button onClick={handleJoinRoom} className="bg-cyan-500 text-white font-bold text-xl py-4 px-8 rounded-lg shadow-lg hover:bg-cyan-600 transform hover:scale-105 transition-transform duration-300">
              ENTRAR
            </button>
          </div>
        );
      default:
        return (
          <div className="flex flex-col md:flex-row gap-4">
            <button onClick={() => setFormToShow('create')} className="bg-pink-600 text-white font-bold text-xl py-4 px-8 rounded-lg shadow-lg hover:bg-pink-700 transform hover:scale-105 transition-transform duration-300">
              CRIAR SALA
            </button>
            <button onClick={() => setFormToShow('join')} className="bg-cyan-500 text-white font-bold text-xl py-4 px-8 rounded-lg shadow-lg hover:bg-cyan-600 transform hover:scale-105 transition-transform duration-300">
              ENTRAR NUMA SALA
            </button>
          </div>
        );
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-950 to-black p-4">
      <section className="w-full max-w-xs md:max-w-sm text-center mb-12">
        <img 
          src={kekasLogo} 
          alt="Logotipo do jogo Keka's com um mascote de diabrete de duas cores" 
          className="w-full h-auto"
        />
      </section>
      <nav>
        {renderContent()}
      </nav>
    </main>
  );
};

export default Home;