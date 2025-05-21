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

  static async addSpecialist(req, res) {
    try {
      const { specialist } = req.body;

      if (!specialist) {
        return res
          .status(400)
          .json({ message: "Field 'specialist' wajib diisi" });
      }

      // Cek duplikat (opsional)
      const exist = await Specialist.findOne({ where: { specialist } });
      if (exist) {
        return res.status(400).json({ message: "Spesialis sudah ada" });
      }

      const newSpecialist = await Specialist.create({ specialist });

      return res.status(201).json({
        message: "Spesialis berhasil ditambahkan",
        data: newSpecialist,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Gagal menambahkan spesialis" });
    }
  }
}

module.exports = SpecialistController;
