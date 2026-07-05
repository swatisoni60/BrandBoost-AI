const express = require("express");
const rateLimit = require("express-rate-limit");
const { generateMarketing, generateSEO, generatePoster, getCampaigns } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: "Too many AI requests, please slow down" },
});

router.post("/marketing-generator", aiLimiter, generateMarketing);
router.post("/seo-assistant", aiLimiter, generateSEO);
router.post("/poster-generator", aiLimiter, generatePoster);
router.get("/campaigns", getCampaigns);

module.exports = router;
