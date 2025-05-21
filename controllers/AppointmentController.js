const { Appointment, User, Doctor, ScheduleDoctor } = require("../models");

class AppointmentController {
  // Get all appointments (admin only)
  static async getAllAppointment(req, res) {
    try {
      const appointments = await Appointment.findAll({
        include: [
          { model: User, attributes: ['name', 'email'] },
          { model: Doctor, include: ['Specialist'] },
          { model: ScheduleDoctor }
        ]
      });

      res.status(200).json({ 
        message: "Berhasil ambil semua appointment", 
        data: appointments 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Status endpoint to check service status
  static async getStatus(req, res) {
    return res.status(200).json({ message: "Appointment service is running" });
  }

  // Get appointment by ID
  static async getAppointmentById(req, res) {
    const { id } = req.params;
    
    try {
      const appointment = await Appointment.findByPk(id, {
        include: [
          { model: User }, 
          { model: Doctor }
        ]
      });

      if (!appointment) {
        return res.status(404).json({ message: "Appointment tidak ditemukan" });
      }

      res.status(200).json({ 
        message: "Berhasil ambil data appointment", 
        data: appointment 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create new appointment
  static async createAppointment(req, res) {
    const { user_id, doctor_id, schedule_doctor_id, register_no, appointment_time } = req.body;
    
    try {
      const newAppointment = await Appointment.create({
        user_id,
        doctor_id,
        schedule_doctor_id,
        register_no,
        appointment_time,
        status: "pending" // Default status
      });

      res.status(201).json({ 
        message: "Appointment berhasil dibuat", 
        data: newAppointment 
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update appointment status
  static async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const appointment = await Appointment.findByPk(id);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment tidak ditemukan" });
      }

      appointment.status = status;
      await appointment.save();

      res.status(200).json({ 
        message: "Status appointment berhasil diupdate", 
        data: appointment 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AppointmentController;