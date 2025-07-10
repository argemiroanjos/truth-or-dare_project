import React from 'react';

const Home: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 p-4">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4">
          Verdade ou Desafio
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-12">
          O jogo clássico, agora mais picante e divertido.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <button className="bg-pink-600 text-white font-bold text-xl py-4 px-8 rounded-lg shadow-lg hover:bg-pink-700 transform hover:scale-105 transition-transform duration-300">
          CRIAR SALA
        </button>
        <button className="bg-cyan-500 text-white font-bold text-xl py-4 px-8 rounded-lg shadow-lg hover:bg-cyan-600 transform hover:scale-105 transition-transform duration-300">
          ENTRAR NUMA SALA
        </button>
      </div>
    </main>
  );
};

export default Home;
