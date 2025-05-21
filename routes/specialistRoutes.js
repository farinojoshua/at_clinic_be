const route = require("express").Router();
const SpecialistController = require("../controllers/SpecialistController");

// Route to get all specialists
route.get("/", SpecialistController.getAllSpecialist);
route.post("/", SpecialistController.addSpecialist);

module.exports = route;
