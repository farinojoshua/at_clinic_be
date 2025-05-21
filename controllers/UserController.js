const { User } = require("../models");

class UserController {
  // Get all users (admin only)
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] } // Hide password
      });
      
      res.status(200).json({ 
        message: "Berhasil ambil semua user", 
        data: users 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    const { id } = req.params;
    
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      res.status(200).json({ 
        message: "Berhasil ambil data user", 
        data: user 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;