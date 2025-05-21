const route = require("express").Router();
const DoctorController = require("../controllers/DoctorController");

route.get("/", DoctorController.getAllDoctor);

// Route to get a doctor by ID
route.get("/:id", DoctorController.getDoctorById);
route.get("/:id/schedule", DoctorController.getDoctorScheduleByDate);
route.get("/:id/available-days", DoctorController.getAvailableDays);

// ✅ Endpoint untuk tambah dokter
route.post("/", DoctorController.addDoctor);
route.post("/schedule", DoctorController.addDoctorSchedule);

module.exports = route;
