const express = require("express");
const { getSettings, updateSettings, deactivateAccount } = require("../controllers/settings.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", protect, getSettings);
router.put("/", protect, updateSettings);
router.post("/deactivate", protect, deactivateAccount);

module.exports = router;
