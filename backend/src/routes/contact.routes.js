const express = require('express');
const { sendContactMessage } = require('../controllers/contact.controller');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ROUTES — No authentication required
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/v1/contact — send contact form message
router.post('/', sendContactMessage);

module.exports = router;
