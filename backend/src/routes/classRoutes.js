const express = require("express");
const router = express.Router();
const {
  addNewClass,
  getClasses,
} = require("../controllers/classController");

router.post("/classes", addNewClass);
router.get("/classes", getClasses);

module.exports = router;
