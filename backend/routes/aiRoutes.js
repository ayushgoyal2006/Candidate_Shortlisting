const express = require('express');
const router = express.Router();
const { aiShortlist, generateInterviewQuestions } = require('../controllers/aiController');

// POST /api/ai/shortlist
router.post('/shortlist', aiShortlist);

// POST /api/ai/interview-questions (Bonus feature)
router.post('/interview-questions', generateInterviewQuestions);

module.exports = router;
