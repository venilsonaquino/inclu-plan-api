'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('neurodivergencies', 'icon', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('neurodivergencies', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('neurodivergencies', 'icon');
    await queryInterface.removeColumn('neurodivergencies', 'position');
  }
};
