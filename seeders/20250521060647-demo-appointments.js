"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Appointments",
      [
        {
          user_id: 1,
          doctor_id: 1,
          schedule_doctor_id: 1,
          register_no: 1,
          status: "confirmed",
          appointment_time: new Date("2025-06-01T08:00:00"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 2,
          doctor_id: 2,
          schedule_doctor_id: 2,
          register_no: 2,
          status: "pending",
          appointment_time: new Date("2025-06-04T13:00:00"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Appointments", null, {});
  },
};
