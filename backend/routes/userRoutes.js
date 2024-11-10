const express = require("express");
const {
  getUsers,
  updateUser,
  createUser,
  loginUser,
  deleteUser,
  getUserReports
} = require("../controllers/userController");
const router = express.Router();

router.get("/", getUsers);
router.put("/:id", updateUser);
router.post("/", createUser);
router.delete('/:id', deleteUser);
router.post("/login", loginUser);
router.get('/reports', getUserReports);

module.exports = router;
