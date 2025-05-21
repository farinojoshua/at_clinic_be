"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Doctors",
      [
        {
          name: "dr. Andi",
          specialist_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "dr. Budi",
          specialist_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "dr. Clara",
          specialist_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Doctors", null, {});
  },
};
