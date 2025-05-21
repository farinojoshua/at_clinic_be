"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Specialists",
      [
        { specialist: "Umum", createdAt: new Date(), updatedAt: new Date() },
        { specialist: "Gigi", createdAt: new Date(), updatedAt: new Date() },
        { specialist: "Anak", createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Specialists", null, {});
  },
};
