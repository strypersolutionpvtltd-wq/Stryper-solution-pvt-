const express = require("express");
const { addToShortlist, removeFromShortlist, getShortlist } = require("../controllers/shortlist.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/",           protect, getShortlist);
router.post("/:candidateId",   protect, addToShortlist);
router.delete("/:candidateId", protect, removeFromShortlist);

module.exports = router;
