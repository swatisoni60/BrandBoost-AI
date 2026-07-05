const express = require("express");
const {
  getSummary,
  getRevenueTrend,
  getCategoryBreakdown,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/summary", getSummary);
router.get("/revenue-trend", getRevenueTrend);
router.get("/category-breakdown", getCategoryBreakdown);

module.exports = router;
