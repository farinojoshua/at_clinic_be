const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "rahasia123";

class UserController {
  // Register user baru
  static async register(req, res) {
    try {
      const { name, email, password, gender, birth_date, phone_number } =
        req.body;

      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        gender,
        birth_date,
        phone_number,
      });

      res.status(201).json({
        message: "Registrasi berhasil",
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Email atau password salah" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "1d",
      });

      res.status(200).json({
        message: "Login berhasil",
        token,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Ambil profil sendiri
  static async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
      });

      res.status(200).json({ message: "Berhasil ambil profil", data: user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user.id; // dari middleware auth
      const { name, gender, birth_date, phone_number } = req.body;

      const [updated] = await User.update(
        { name, gender, birth_date, phone_number },
        { where: { id: userId } }
      );

      if (!updated) {
        return res
          .status(404)
          .json({ message: "User tidak ditemukan atau tidak ada perubahan" });
      }

      const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });

      res.status(200).json({
        message: "Profil berhasil diperbarui",
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;
