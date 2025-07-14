import React from 'react';
import kekasLogo from '../assets/kekas-logo2.png';

const HomePage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-950 to-black p-4">
      <section className="w-full max-w-xs md:max-w-sm text-center mb-12">
        <img 
          src={kekasLogo} 
          alt="Logótipo do jogo Keka's com um mascote de diabrete de duas cores" 
          className="w-full h-auto"
        />
      </section>
      <nav className="flex flex-col md:flex-row gap-4">
        <button className="bg-pink-600 text-white font-bold text-xl py-4 px-8 rounded-lg shadow-lg hover:bg-pink-700 transform hover:scale-105 transition-transform duration-300">
          CRIAR SALA
        </button>
        <button className="bg-cyan-500 text-white font-bold text-xl py-4 px-8 rounded-lg shadow-lg hover:bg-cyan-600 transform hover:scale-105 transition-transform duration-300">
          ENTRAR NUMA SALA
        </button>
      </nav>
    </main>
  );
};

export default HomePage;
