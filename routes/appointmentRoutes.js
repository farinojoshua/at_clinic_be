const route = require("express").Router();
const AppointmentController = require("../controllers/AppointmentController");
const authMiddleware = require("../middlewares/authMiddleware");

route.post("/", authMiddleware, AppointmentController.createAppointment);
route.get("/mine", authMiddleware, AppointmentController.getMyAppointments);
route.patch(
  "/:id/status",
  authMiddleware,
  AppointmentController.updateAppointmentStatus
);

module.exports = route;
