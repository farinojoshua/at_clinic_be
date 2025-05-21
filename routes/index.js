const route = require("express").Router();
const doctorRoutes = require("./doctorRoutes");
const specialistRoutes = require("./specialistRoutes");
const appointmentRoutes = require("./appointmentRoutes");
const userRoutes = require("./userRoutes");

route.get("/", (req, res) => {
  res.send("masuk sini");
});

route.use("/doctor", doctorRoutes);
route.use("/specialist", specialistRoutes);
route.use("/appointment", appointmentRoutes);
route.use("/user", userRoutes);

module.exports = route;
