"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ScheduleDoctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ScheduleDoctor.belongsTo(models.Doctor, { foreignKey: "doctor_id" });
      ScheduleDoctor.hasMany(models.Appointment, {
        foreignKey: "schedule_doctor_id",
      });
    }
  }
  ScheduleDoctor.init(
    {
      doctor_id: DataTypes.INTEGER,
      day: DataTypes.STRING,
      start_hour: DataTypes.TIME,
      end_hour: DataTypes.TIME,
    },
    {
      sequelize,
      modelName: "ScheduleDoctor",
    }
  );
  return ScheduleDoctor;
};
