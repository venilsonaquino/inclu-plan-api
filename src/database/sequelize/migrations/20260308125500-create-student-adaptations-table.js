'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop table if exists to ensure clean state
    await queryInterface.dropTable('student_adaptations').catch(() => { });

    await queryInterface.createTable('student_adaptations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      lesson_plan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'lesson_plans', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      student_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'students', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      student_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      student_grade: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      student_neurodivergencies: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      strategy: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      behavioral_tips: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      support_level: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      success_indicators: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('student_adaptations');
  },
};
