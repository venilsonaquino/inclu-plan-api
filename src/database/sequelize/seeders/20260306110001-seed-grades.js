'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const grades = [
      { id: '3f9f8e8e-c7a8-4444-9999-a11122223333', name: '1º Ano', description: 'Primeiro ano do Ensino Fundamental', created_at: new Date(), updated_at: new Date() },
      { id: '7d8e9f0a-b1c2-43d4-8e5f-6a7b8c9d0e1f', name: '2º Ano', description: 'Segundo ano do Ensino Fundamental', created_at: new Date(), updated_at: new Date() },
      { id: 'a1b2c3d4-e5f6-4789-8012-3456789abcde', name: '3º Ano', description: 'Terceiro ano do Ensino Fundamental', created_at: new Date(), updated_at: new Date() },
      { id: 'f1e2d3c4-b5a6-4987-9b8a-7c6d5e4f3a2b', name: '4º Ano', description: 'Quarto ano do Ensino Fundamental', created_at: new Date(), updated_at: new Date() },
      { id: 'b5c6d7e8-f9a0-4123-b456-d789e0123456', name: '5º Ano', description: 'Quinto ano do Ensino Fundamental', created_at: new Date(), updated_at: new Date() },
    ];

    const existing = await queryInterface.sequelize.query(
      `SELECT id FROM grades WHERE id IN (${grades.map(g => `'${g.id}'`).join(',')})`
    );

    if (existing[0].length === 0) {
      await queryInterface.bulkInsert('grades', grades, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('grades', null, {});
  }
};
