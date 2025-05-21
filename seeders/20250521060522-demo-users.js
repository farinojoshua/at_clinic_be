"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Joshua",
          email: "joshua@example.com",
          password: "hashedpassword",
          gender: "Male",
          birth_date: "2000-01-01",
          phone_number: "08123456789",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Nina",
          email: "nina@example.com",
          password: "hashedpassword",
          gender: "Female",
          birth_date: "1995-05-15",
          phone_number: "08987654321",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
