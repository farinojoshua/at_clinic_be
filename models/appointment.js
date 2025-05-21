"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Appointment.belongsTo(models.User, { foreignKey: "user_id" });
      Appointment.belongsTo(models.Doctor, { foreignKey: "doctor_id" });
      Appointment.belongsTo(models.ScheduleDoctor, {
        foreignKey: "schedule_doctor_id",
      });
    }
  }
  Appointment.init(
    {
      user_id: DataTypes.INTEGER,
      doctor_id: DataTypes.INTEGER,
      schedule_doctor_id: DataTypes.INTEGER,
      register_no: DataTypes.INTEGER,
      status: DataTypes.STRING,
      appointment_time: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Appointment",
    }
  );
  return Appointment;
};
