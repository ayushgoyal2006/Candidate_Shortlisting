const fetch = require('node-fetch');
const Candidate = require('../models/Candidate');
const { matchCandidates } = require('./matchController');

// POST /api/ai/shortlist — AI-based candidate suggestion via OpenRouter
const aiShortlist = async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills } = req.body;

    if (!requiredSkills || !Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({ error: 'requiredSkills array is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured on the server' });
    }

    // Fetch candidates and run basic match first
    const allCandidates = await Candidate.find();
    const basicRanked = matchCandidates(allCandidates, {
      requiredSkills,
      minExperience: minExperience || 0,
      preferredSkills: preferredSkills || [],
    });

    // Build candidate list string for the AI prompt
    const candidateList = basicRanked
      .map(
        (c, i) =>
          `${i + 1}. ${c.name} — Skills: ${c.skills.join(', ')} — Experience: ${c.experience} year(s)${
            c.bio ? ` — Bio: ${c.bio}` : ''
          }`
      )
      .join('\n');

    const prompt = `You are a technical recruiter AI assistant. Analyze the following candidates for a job opening and rank them based on fit.

Job Requirements:
- Required Skills: ${requiredSkills.join(', ')}
- Minimum Experience: ${minExperience || 0} year(s)
${preferredSkills && preferredSkills.length > 0 ? `- Preferred Skills: ${preferredSkills.join(', ')}` : ''}

Candidates:
${candidateList}

For each candidate:
1. Rank them from best to worst fit (use their exact names)
2. Give a short explanation (1-2 sentences) of why they are or aren't a good fit
3. Suggest 1-2 interview questions tailored to their profile

Respond in the following JSON format only (no markdown, no extra text):
{
  "rankings": [
    {
      "rank": 1,
      "name": "Candidate Name",
      "recommendation": "Why they are a good fit...",
      "interviewQuestions": ["Question 1", "Question 2"]
    }
  ],
  "summary": "Overall summary of the candidate pool in 2-3 sentences."
}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Candidate Shortlisting System',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: 'OpenRouter API error', details: errText });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '';

    let aiResult;
    try {
      const cleaned = rawContent.replace(/```json|```/g, '').trim();
      aiResult = JSON.parse(cleaned);
    } catch {
      aiResult = { raw: rawContent };
    }

    // Merge AI rankings with basic match data
    const enrichedRankings = (aiResult.rankings || []).map((aiEntry) => {
      const matchData = basicRanked.find(
        (c) => c.name.toLowerCase() === aiEntry.name.toLowerCase()
      );
      return { ...aiEntry, matchData: matchData || null };
    });

    res.json({
      jobRequirements: { requiredSkills, minExperience, preferredSkills },
      aiRankings: enrichedRankings,
      summary: aiResult.summary || '',
      basicRanking: basicRanked,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/ai/interview-questions — Generate interview questions for a candidate
const generateInterviewQuestions = async (req, res) => {
  try {
    const { candidateId, jobRole, requiredSkills } = req.body;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured on the server' });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const prompt = `Generate 5 technical interview questions for a candidate with the following profile:

Name: ${candidate.name}
Skills: ${candidate.skills.join(', ')}
Experience: ${candidate.experience} year(s)
${candidate.bio ? `Bio: ${candidate.bio}` : ''}
${jobRole ? `Job Role: ${jobRole}` : ''}
${requiredSkills ? `Required Skills for the Job: ${requiredSkills.join(', ')}` : ''}

Return ONLY a JSON array of 5 question strings, no extra text:
["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Candidate Shortlisting System',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '[]';
    let questions;
    try {
      const cleaned = rawContent.replace(/```json|```/g, '').trim();
      questions = JSON.parse(cleaned);
    } catch {
      questions = [rawContent];
    }

    res.json({ candidate: { name: candidate.name, skills: candidate.skills }, questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { aiShortlist, generateInterviewQuestions };
