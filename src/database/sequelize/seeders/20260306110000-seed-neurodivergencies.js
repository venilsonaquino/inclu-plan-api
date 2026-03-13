'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const neurodivergencies = [
      { id: '47769947-6648-4389-8097-f875440c93a1', icon: 'bolt', name: 'TDAH', description: 'Transtorno do Déficit de Atenção com Hiperatividade', created_at: new Date(), updated_at: new Date() },
      { id: '9133606f-7065-4dff-9b48-ed6652e25916', icon: 'extension', name: 'TEA', description: 'Transtorno do Espectro Autista', created_at: new Date(), updated_at: new Date() },
      { id: '1692207b-5c8e-49b0-a352-7b958c89b788', icon: 'warning', name: 'TOD', description: 'Transtorno Opositor Desafiador', created_at: new Date(), updated_at: new Date() },
      { id: '85ed5712-4011-447a-861f-173676c38703', icon: 'psychology', name: 'Defic. Intelectual', description: 'Deficiência Intelectual', created_at: new Date(), updated_at: new Date() },
      { id: '09798993-9c84-4848-bc06-79776859518a', icon: 'menu_book', name: 'Dislexia', description: 'Transtorno de aprendizagem na leitura', created_at: new Date(), updated_at: new Date() },
      { id: '62e60938-f9b8-4c11-9a7e-137688225916', icon: 'campaign', name: 'DLD / TEL', description: 'Distúrbio de Linguagem de Desenvolvimento / Transtorno Específico de Linguagem', created_at: new Date(), updated_at: new Date() },
      { id: '28639556-9121-4d1a-967e-128267225110', icon: 'calculate', name: 'Discalculia', description: 'Transtorno de aprendizagem na matemática', created_at: new Date(), updated_at: new Date() },
      { id: '10926639-9133-4066-9a25-247653882776', icon: 'edit_note', name: 'Disgrafia', description: 'Transtorno de aprendizagem na escrita', created_at: new Date(), updated_at: new Date() },
      { id: '91266380-4491-4c1a-9821-285366442110', icon: 'directions_run', name: 'Dispraxia / TDC', description: 'Transtorno do Desenvolvimento da Coordenação', created_at: new Date(), updated_at: new Date() },
    ];

    // Check if data already exists to avoid duplicates if re-run
    const existing = await queryInterface.sequelize.query(
      `SELECT id FROM neurodivergencies WHERE id IN (${neurodivergencies.map(n => `'${n.id}'`).join(',')})`
    );

    if (existing[0].length === 0) {
      await queryInterface.bulkInsert('neurodivergencies', neurodivergencies, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('neurodivergencies', null, {});
  }
};
