const route = require("express").Router();
const SpecialistController = require("../controllers/SpecialistController");

// Route to get all specialists
route.get("/", SpecialistController.getAllSpecialist);

// Route to get a specialist by ID
route.get("/:id", SpecialistController.getSpecialistById);

module.exports = route;
