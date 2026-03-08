'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop table if exists to ensure clean state
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
      discipline: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      theme: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lesson_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      estimated_prep_time: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lesson_number: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      objective: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      learning_objects: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      bncc_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bncc_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      activity_steps: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      udl_representation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      udl_action_expression: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      udl_engagement: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      resources: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      evaluation: {
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
