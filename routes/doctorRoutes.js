const route = require("express").Router();
const DoctorController = require("../controllers/DoctorController");

route.get("/", DoctorController.getAllDoctor);

// Route to get a doctor by ID
route.get("/:id", DoctorController.getDoctorById);


module.exports = route;
