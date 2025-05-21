"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Doctor.belongsTo(models.Specialist, { foreignKey: "specialist_id" });
      Doctor.hasMany(models.ScheduleDoctor, { foreignKey: "doctor_id" });
      Doctor.hasMany(models.Appointment, { foreignKey: "doctor_id" });
    }
  }
  Doctor.init(
    {
      name: DataTypes.STRING,
      specialist_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Doctor",
    }
  );
  return Doctor;
};
