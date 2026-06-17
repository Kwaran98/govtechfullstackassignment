const express = require("express");
const router = express.Router();
const {
  registerTeacher,
  getTeachers,
} = require("../controllers/teacherController");

router.post("/teachers", registerTeacher);
router.get("/teachers", getTeachers);

module.exports = router;