'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop existing table to ensure clean slate with rich columns
    await queryInterface.dropTable('lesson_plans').catch(() => { });

    await queryInterface.createTable('lesson_plans', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      teacher_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'teachers', key: 'id' },
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
      discipline: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      theme: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      objective: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      bncc_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bncc_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      activity_steps: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      resources: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      evaluation: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      udl_representation: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      udl_action_expression: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      udl_engagement: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      adaptation_strategy: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      behavioral_tips: {
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
    await queryInterface.dropTable('lesson_plans');
  },
};
