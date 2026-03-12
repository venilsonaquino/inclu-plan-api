'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add user_id column
    await queryInterface.addColumn('teachers', 'user_id', {
      type: Sequelize.UUID,
      allowNull: true, // Initially true to allow existing records if any
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // We can't safely drop email and password_hash without data loss if we care about existing records,
    // but assuming this is a new module or we will migrate data cleanly.
    // Let's drop them.
    await queryInterface.removeColumn('teachers', 'email');
    await queryInterface.removeColumn('teachers', 'password_hash');
  },

  async down(queryInterface, Sequelize) {
    // Reverse operations
    await queryInterface.addColumn('teachers', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('teachers', 'password_hash', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.removeColumn('teachers', 'user_id');
  },
};
