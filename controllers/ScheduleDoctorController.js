const { ScheduleDoctor } = require("../models");

class ScheduleDoctorController {
  // Method to get all schedule doctors
  static async getAllScheduleDoctor(req, res) {
    try {
      const schedules = await ScheduleDoctor.findAll({
        include: ["doctor"],
      });

      res.status(200).json({
        message: "Berhasil ambil semua jadwal dokter",
        data: schedules,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Method to get a schedule doctor by ID
  static async getScheduleDoctorById(req, res) {
    const { id } = req.params;
    try {
      const schedule = await ScheduleDoctor.findByPk(id, {
        include: ["doctor"],
      });
      if (!schedule) {
        return res
          .status(404)
          .json({ message: "Jadwal dokter tidak ditemukan" });
      }
      res
        .status(200)
        .json({ message: "Berhasil ambil data jadwal dokter", data: schedule });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ScheduleDoctorController;
