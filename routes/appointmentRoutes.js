const route = require("express").Router();
const AppointmentController = require("../controllers/AppointmentController");

// Get all appointments
route.get("/", AppointmentController.getAllAppointment);

// Status endpoint to check service status
route.get("/status", AppointmentController.getStatus);

// Get appointment by ID
route.get("/:id", AppointmentController.getAppointmentById);

// Create new appointment
route.post("/", AppointmentController.createAppointment);

// Update status
route.patch("/:id/status", AppointmentController.updateStatus);

module.exports = route;
