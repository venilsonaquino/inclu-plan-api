'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('school_classes', {
      fields: ['teacher_id'],
      type: 'foreign key',
      name: 'school_classes_teacher_id_fk', // custom name for the constraint
      references: {
        table: 'teachers',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE', // Or 'RESTRICT' if a teacher with classes shouldn't be deleted easily
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('school_classes', 'school_classes_teacher_id_fk');
  },
};
