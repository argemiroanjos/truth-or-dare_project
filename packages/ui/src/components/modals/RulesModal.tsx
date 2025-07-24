import React from 'react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 text-white rounded-xl shadow-lg w-full max-w-md border border-gray-700">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">Regras do Jogo</h2>
          <div className="space-y-3 text-gray-300 max-h-[60vh] overflow-y-auto pr-2">
            <p><strong className="text-white">1. Objetivo:</strong> Divirta-se! Gire a garrafa, responda perguntas ou cumpra desafios.</p>
            <p><strong className="text-white">2. Girando a Garrafa:</strong> No início de cada rodada, o jogador da vez ("Spinner") clica na garrafa para girar.</p>
            <p><strong className="text-white">3. Questionador e Respondedor:</strong> A garrafa sorteia quem fará a pergunta ("Questioner") e quem deverá responder ("Responder").</p>
            <p><strong className="text-white">4. Verdade ou Desafio:</strong> O Questionador escolhe entre "Verdade" ou "Desafio" para o Respondedor.</p>
            <p><strong className="text-white">5. Votação:</strong> Após o Respondedor cumprir a ação, todos os outros jogadores votam se gostaram ou não da performance.</p>
            <p><strong className="text-white">6. Veredito:</strong> Com base nos votos, o Questionador dá o veredito final: "Aceito" ou "Rejeitado".</p>
            <p><strong className="text-white">7. Consequências:</strong> Se o veredito for "Aceito", o Respondedor será o próximo a girar a garrafa. Se for "Rejeitado", ele recebe uma suspensão e outro jogador é sorteado para girar.</p>
            <p><strong className="text-white">8. Suspensão:</strong> Um jogador suspenso perde a vez de perguntar caso seja sorteado como Questionador.</p>
            {/* NOVA REGRA ADICIONADA AQUI */}
            <p><strong className="text-pink-400">9. Regra Anti-fuga:</strong> Para manter o jogo justo, um jogador não pode escolher "Verdade" mais de duas vezes seguidas. Na terceira vez, a escolha será automaticamente "Desafio"! </p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-b-xl text-center">
          <button
            onClick={onClose}
            className="bg-pink-600 text-white font-bold py-2 px-8 rounded-lg shadow-lg hover:bg-pink-700 transition-colors"
          >
            Entendi!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;
