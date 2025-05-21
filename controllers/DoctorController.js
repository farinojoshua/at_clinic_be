const { Op } = require("sequelize");
const {
  Doctor,
  Specialist,
  ScheduleDoctor,
  Appointment,
} = require("../models");
const dayjs = require("dayjs");

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

  static async getDoctorById(req, res) {
    try {
      const { id } = req.params;

      const doctor = await Doctor.findByPk(id, {
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

      if (!doctor) {
        return res.status(404).json({ message: "Dokter tidak ditemukan" });
      }

      return res.status(200).json({
        message: "Berhasil ambil data dokter",
        data: {
          id: doctor.id,
          name: doctor.name,
          specialist: doctor.Specialist?.specialist || null,
          schedules:
            doctor.ScheduleDoctors?.map((jadwal) => ({
              day: jadwal.day,
              start_hour: jadwal.start_hour,
              end_hour: jadwal.end_hour,
            })) || [],
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Gagal mengambil data dokter" });
    }
  }

  static async getDoctorScheduleByDate(req, res) {
    try {
      const { id } = req.params;
      const { date } = req.query;

      if (!date) {
        return res
          .status(400)
          .json({ message: "Query 'date' wajib diisi (YYYY-MM-DD)" });
      }

      // Pastikan dokter ada
      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        return res.status(404).json({ message: "Dokter tidak ditemukan" });
      }

      const dayName = dayjs(date).format("dddd"); // "Monday", "Tuesday", etc.

      // Ambil jadwal untuk hari itu
      const schedules = await ScheduleDoctor.findAll({
        where: {
          doctor_id: id,
          day: dayName,
        },
      });

      if (schedules.length === 0) {
        return res.status(200).json({
          doctor_id: id,
          date,
          slots: [],
          message: "Dokter tidak memiliki jadwal pada hari ini",
        });
      }

      // Ambil semua appointment yang sudah dibooking di tanggal itu
      const startOfDay = dayjs(date).startOf("day").toDate();
      const endOfDay = dayjs(date).endOf("day").toDate();

      const bookedAppointments = await Appointment.findAll({
        where: {
          doctor_id: id,
          appointment_time: {
            [Op.between]: [startOfDay, endOfDay], // ✅
          },
        },
      });

      const bookedTimes = bookedAppointments.map((appt) =>
        dayjs(appt.appointment_time).format("HH:mm")
      );
      console.log("Booked times:", bookedTimes);

      const generateSlots = (start, end) => {
        const slots = [];
        const startTime = dayjs(`${date}T${start}`);
        const endTime = dayjs(`${date}T${end}`);

        let current = startTime;
        while (current.isBefore(endTime)) {
          const time = current.format("HH:mm");
          slots.push({
            time,
            available: !bookedTimes.includes(time),
          });
          current = current.add(15, "minute");
        }

        return slots;
      };

      // Gabungkan semua slot dari semua jadwal
      const allSlots = schedules.flatMap((schedule) =>
        generateSlots(schedule.start_hour, schedule.end_hour)
      );

      return res.status(200).json({
        doctor_id: id,
        date,
        slots: allSlots,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  }

  static async getAvailableDays(req, res) {
    try {
      const { id } = req.params;
      const today = dayjs();
      const next7Days = Array.from({ length: 7 }).map((_, i) => {
        const date = today.add(i, "day");
        return {
          date: date.format("YYYY-MM-DD"),
          dayName: date.format("dddd"), // e.g. Monday, Tuesday
        };
      });

      // Ambil semua hari jadwal si dokter (ex: Monday, Wednesday)
      const doctorSchedules = await ScheduleDoctor.findAll({
        where: { doctor_id: id },
        attributes: ["day"], // format: Monday, Tuesday
      });

      const doctorDays = doctorSchedules.map((d) => d.day);

      const availableDates = next7Days
        .filter((d) => doctorDays.includes(d.dayName))
        .map((d) => d.date);

      return res.status(200).json({
        message: "Tanggal tersedia untuk booking",
        available_dates: availableDates,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengambil jadwal dokter" });
    }
  }

  static async addDoctor(req, res) {
    try {
      const { name, specialist_id, photo_url } = req.body;

      if (!name || !specialist_id) {
        return res.status(400).json({
          message: "Field 'name' dan 'specialist_id' wajib diisi",
        });
      }

      const specialist = await Specialist.findByPk(specialist_id);
      if (!specialist) {
        return res.status(404).json({ message: "Specialist tidak ditemukan" });
      }

      const newDoctor = await Doctor.create({ name, specialist_id, photo_url });

      return res.status(201).json({
        message: "Dokter berhasil ditambahkan",
        data: newDoctor,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Gagal menambahkan dokter" });
    }
  }

  static async addDoctorSchedule(req, res) {
    try {
      const { doctor_id, day, start_hour, end_hour } = req.body;

      // Validasi input
      if (!doctor_id || !day || !start_hour || !end_hour) {
        return res.status(400).json({
          message: "doctor_id, day, start_hour, dan end_hour wajib diisi",
        });
      }

      // Validasi dokter ada
      const doctor = await Doctor.findByPk(doctor_id);
      if (!doctor) {
        return res.status(404).json({ message: "Dokter tidak ditemukan" });
      }

      // Validasi day harus string seperti "Monday", "Tuesday", dst.
      const validDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      if (!validDays.includes(day)) {
        return res.status(400).json({
          message: `day harus salah satu dari: ${validDays.join(", ")}`,
        });
      }

      // Cek apakah jadwal hari itu sudah ada untuk dokter yang sama
      const exist = await ScheduleDoctor.findOne({
        where: { doctor_id, day },
      });

      if (exist) {
        return res
          .status(400)
          .json({ message: "Jadwal hari tersebut sudah ada untuk dokter ini" });
      }

      // Buat jadwal
      const schedule = await ScheduleDoctor.create({
        doctor_id,
        day,
        start_hour,
        end_hour,
      });

      return res.status(201).json({
        message: "Jadwal dokter berhasil ditambahkan",
        data: schedule,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Gagal menambahkan jadwal dokter" });
    }
  }
}

module.exports = DoctorController;
