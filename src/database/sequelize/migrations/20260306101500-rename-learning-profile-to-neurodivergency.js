'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Rename learning_profiles to neurodivergencies
    await queryInterface.renameTable('learning_profiles', 'neurodivergencies');

    // 2. Rename student_learning_profiles to student_neurodivergencies
    await queryInterface.renameTable('student_learning_profiles', 'student_neurodivergencies');

    // 3. Rename learning_profile_id column in student_neurodivergencies
    await queryInterface.renameColumn(
      'student_neurodivergencies',
      'learning_profile_id',
      'neurodivergency_id'
    );
  },

  async down(queryInterface, Sequelize) {
    // 1. Rename back neurodivergency_id to learning_profile_id
    await queryInterface.renameColumn(
      'student_neurodivergencies',
      'neurodivergency_id',
      'learning_profile_id'
    );

    // 2. Rename student_neurodivergencies back to student_learning_profiles
    await queryInterface.renameTable('student_neurodivergencies', 'student_learning_profiles');

    // 3. Rename neurodivergencies back to learning_profiles
    await queryInterface.renameTable('neurodivergencies', 'learning_profiles');
  },
};
