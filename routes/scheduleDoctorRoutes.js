const route = require("express").Router();
const ScheduleDoctorController = require("../controllers/ScheduleDoctorController");

// Route to get all schedule doctors
route.get("/", ScheduleDoctorController.getAllScheduleDoctor);

// Route to get a schedule doctor by ID
route.get("/:id", ScheduleDoctorController.getScheduleDoctorById);

module.exports = route;
