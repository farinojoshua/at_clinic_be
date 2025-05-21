const {
  Appointment,
  Doctor,
  ScheduleDoctor,
  Specialist,
} = require("../models");
const dayjs = require("dayjs");
const { Op } = require("sequelize");
const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

class AppointmentController {
  static async createAppointment(req, res) {
    try {
      const { doctor_id, date, time } = req.body;
      const user_id = req.user.id;

      // 🔍 Validasi input
      if (!doctor_id || !date || !time) {
        return res.status(400).json({
          message:
            "Field doctor_id, date (YYYY-MM-DD), dan time (HH:mm) wajib diisi",
        });
      }

      const doctor = await Doctor.findByPk(doctor_id);
      if (!doctor) {
        return res.status(404).json({ message: "Dokter tidak ditemukan" });
      }

      const dayName = dayjs(date).format("dddd");
      const schedule = await ScheduleDoctor.findOne({
        where: {
          doctor_id,
          day: dayName,
        },
      });

      if (!schedule) {
        return res
          .status(400)
          .json({ message: "Dokter tidak praktik pada hari ini" });
      }

      const timeStart = dayjs(`${date}T${schedule.start_hour}`);
      const timeEnd = dayjs(`${date}T${schedule.end_hour}`);
      const appointmentTime = dayjs(`${date}T${time}`);

      if (
        !appointmentTime.isBetween(timeStart.subtract(1, "minute"), timeEnd)
      ) {
        return res
          .status(400)
          .json({ message: "Waktu di luar jam praktik dokter" });
      }

      // ❌ Cek apakah slot sudah dibooking
      const exist = await Appointment.findOne({
        where: {
          doctor_id,
          appointment_time: dayjs(`${date}T${time}`).toDate(),
        },
      });

      if (exist) {
        return res
          .status(400)
          .json({ message: "Slot ini sudah dibooking pasien lain" });
      }

      // ❌ Cek apakah user sudah booking di hari itu untuk dokter yang sama
      const userHasAppointment = await Appointment.findOne({
        where: {
          doctor_id,
          user_id,
          appointment_time: {
            [Op.between]: [
              dayjs(date).startOf("day").toDate(),
              dayjs(date).endOf("day").toDate(),
            ],
          },
        },
      });

      if (userHasAppointment) {
        return res
          .status(400)
          .json({ message: "Sudah booking dokter ini di hari tersebut" });
      }

      // ✅ Hitung nomor antrian
      const totalToday = await Appointment.count({
        where: {
          doctor_id,
          appointment_time: {
            [Op.between]: [
              dayjs(date).startOf("day").toDate(),
              dayjs(date).endOf("day").toDate(),
            ],
          },
        },
      });

      const appointment = await Appointment.create({
        user_id,
        doctor_id,
        schedule_doctor_id: schedule.id,
        register_no: totalToday + 1,
        status: "booked",
        appointment_time: appointmentTime.toDate(),
      });

      return res.status(201).json({
        message: "Berhasil booking appointment",
        data: appointment,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Gagal booking appointment" });
    }
  }

  static async getMyAppointments(req, res) {
    try {
      const userId = req.user.id;

      const appointments = await Appointment.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Doctor,
            attributes: ["id", "name"],
            include: [
              {
                model: Specialist,
                attributes: ["specialist"],
              },
            ],
          },
          {
            model: ScheduleDoctor,
            attributes: ["day", "start_hour", "end_hour"],
          },
        ],
        order: [["appointment_time", "ASC"]],
      });

      const result = appointments.map((appt) => ({
        id: appt.id,
        status: appt.status,
        register_no: appt.register_no,
        appointment_time: appt.appointment_time,
        doctor: {
          id: appt.Doctor?.id,
          name: appt.Doctor?.name,
          specialist: appt.Doctor?.Specialist?.specialist || null,
        },
        schedule: {
          day: appt.ScheduleDoctor?.day,
          start_hour: appt.ScheduleDoctor?.start_hour,
          end_hour: appt.ScheduleDoctor?.end_hour,
        },
      }));

      return res.status(200).json({
        message: "Berhasil ambil appointment saya",
        data: result,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Gagal ambil appointment" });
    }
  }

  static async updateAppointmentStatus(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params; // appointment ID
      const { status } = req.body;

      const validStatus = ["cancelled", "done"];
      if (!validStatus.includes(status)) {
        return res.status(400).json({
          message: `Status hanya boleh: ${validStatus.join(" / ")}`,
        });
      }

      const appointment = await Appointment.findOne({
        where: {
          id,
          user_id: userId, // hanya user pemilik yang bisa ubah
        },
      });

      if (!appointment) {
        return res.status(404).json({ message: "Appointment tidak ditemukan" });
      }

      appointment.status = status;
      await appointment.save();

      return res.status(200).json({
        message: `Appointment berhasil diubah ke status '${status}'`,
        data: {
          id: appointment.id,
          status: appointment.status,
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Gagal update status appointment" });
    }
  }
}

module.exports = AppointmentController;
