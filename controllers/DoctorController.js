const { Doctor, Specialist, ScheduleDoctor } = require("../models");

class DoctorController {
  static async getAllDoctor(req, res) {
    try {
      const { specialist_id } = req.query;

      const filter = {};
      if (specialist_id) {
        filter.specialist_id = specialist_id;
      }

      const doctors = await Doctor.findAll({
        where: filter,
        include: [
          {
            model: Specialist,
            attributes: ["id", "specialist"],
          },
          {
            model: ScheduleDoctor,
            attributes: ["id", "day", "start_hour", "end_hour"],
          },
        ],
      });

      // Format flat
      const result = doctors.map((doc) => ({
        id: doc.id,
        name: doc.name,
        specialist: doc.Specialist?.specialist || null,
        schedules:
          doc.ScheduleDoctors?.map((jadwal) => ({
            day: jadwal.day,
            start_hour: jadwal.start_hour,
            end_hour: jadwal.end_hour,
          })) || [],
      }));

      return res.status(200).json({
        message: "Berhasil ambil data dokter dengan jadwal dan spesialis",
        data: result,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Gagal mengambil data dokter" });
    }
  }

  // Method to get a doctor by ID
  static async getDoctorById(req, res) {
    // Extract the doctor ID from the request parameters
    const { id } = req.params;

    // Find the doctor by primary key (ID)
    const doctor = await Doctor.findByPk(id);

    // If doctor not found, return 404 response
    if (!doctor) {
      return res.status(404).json({ message: "Dokter tidak ditemukan" });
    }

    // If found, return the doctor data with a success message
    return res
      .status(200)
      .json({ message: "Berhasil ambil data dokter", data: doctor });
  }
  1;
}

module.exports = DoctorController;
