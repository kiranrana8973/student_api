const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const upload = require("../middleware/uploads");

const {
  getStudents,
  getStudent,
  register,
  login,
  updateStudent,
  deleteStudent,
  uploadImage,
} = require("../controllers/student");

router.post("/uploadImage", upload, uploadImage);
router.post("/register", register);
router.post("/login", login);
router.get("/", protect, getStudents);
router.get("/:id", protect, getStudent);
router.put("/:id", protect, updateStudent);
router.delete("/:id", protect, deleteStudent);

module.exports = router;
