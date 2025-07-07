'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('cards', [
      {
        type: 'truth',
        content: 'Qual foi a coisa mais estranha que você já pesquisou no Google?',
        level: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'dare',
        content: 'Deixe a pessoa à sua direita postar um story no seu Instagram.',
        level: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'truth',
        content: 'Se você pudesse trocar de vida com alguém nesta sala por um dia, quem seria e por quê?',
        level: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'dare',
        content: 'Mande uma mensagem de áudio para sua mãe dizendo que a ama, mas com a voz mais sedutora que conseguir.',
        level: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'truth',
        content: 'Qual foi o lugar mais inusitado onde você já ficou com alguém?',
        level: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'dare',
        content: 'Ligue para o primeiro contato da sua agenda e tente vender um produto imaginário por 30 segundos.',
        level: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('cards', null, {});
  }
};
// 