const route = require("express").Router();
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ Pindahkan ini ke atas
route.post("/register", UserController.register);
route.post("/login", UserController.login);
route.get("/me", authMiddleware, UserController.getProfile);
route.patch("/me", authMiddleware, UserController.updateProfile);

module.exports = route;
