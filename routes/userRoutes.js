const route = require("express").Router();
const UserController = require("../controllers/UserController");

route.get("/", UserController.getAllUsers);
route.get("/:id", UserController.getUserById);

module.exports = route;