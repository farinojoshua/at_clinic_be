"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "ScheduleDoctors",
      [
        {
          doctor_id: 1,
          day: "Senin",
          start_hour: "08:00",
          end_hour: "10:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          doctor_id: 2,
          day: "Rabu",
          start_hour: "13:00",
          end_hour: "15:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          doctor_id: 3,
          day: "Jumat",
          start_hour: "09:00",
          end_hour: "11:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ScheduleDoctors", null, {});
  },
};
