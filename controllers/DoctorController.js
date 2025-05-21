const { Doctor } = require("../models");

class DoctorController {
  static async getAllDoctor(req, res) {
    const doctor = await Doctor.findAll();

    return res
      .status(200)
      .json({ message: "Berhasil ambil data dokter", data: doctor });
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
  }1
  
}

module.exports = DoctorController;
