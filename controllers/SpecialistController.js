const { Specialist } = require("../models");

class SpecialistController {
  // Method to get all specialists
  static async getAllSpecialist(req, res) {
    const specialists = await Specialist.findAll({
      attributes: ["id", "specialist"],
    });

    return res
      .status(200)
      .json({ message: "Berhasil ambil data spesialis", data: specialists });
  }

  // Method to get a specialist by ID
  static async getSpecialistById(req, res) {
    // Extract the specialist ID from the request parameters
    const { id } = req.params;

    // Find the specialist by primary key (ID)
    const specialist = await Specialist.findByPk(id, {
      attributes: ["id", "specialist"],
    });

    // If specialist not found, return 404 response
    if (!specialist) {
      return res.status(404).json({ message: "Spesialis tidak ditemukan" });
    }

    // If found, return the specialist data with a success message
    return res
      .status(200)
      .json({ message: "Berhasil ambil data spesialis", data: specialist });
  }
}

module.exports = SpecialistController;
