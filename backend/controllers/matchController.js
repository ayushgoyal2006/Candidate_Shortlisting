const Candidate = require('../models/Candidate');

// Core matching logic as described in the document
function matchCandidates(candidates, job) {
  return candidates
    .map((candidate) => {
      const normalizedCandidateSkills = candidate.skills.map((s) => s.toLowerCase());
      const normalizedRequired = job.requiredSkills.map((s) => s.toLowerCase());
      const normalizedPreferred = (job.preferredSkills || []).map((s) => s.toLowerCase());

      const matchedRequired = normalizedRequired.filter((skill) =>
        normalizedCandidateSkills.includes(skill)
      );
      const matchedPreferred = normalizedPreferred.filter((skill) =>
        normalizedCandidateSkills.includes(skill)
      );

      const requiredScore =
        normalizedRequired.length > 0
          ? matchedRequired.length / normalizedRequired.length
          : 1;

      const preferredBonus =
        normalizedPreferred.length > 0
          ? (matchedPreferred.length / normalizedPreferred.length) * 0.2
          : 0;

      const matchScore = Math.min(requiredScore + preferredBonus, 1);

      const meetsExperience = candidate.experience >= (job.minExperience || 0);

      let tier;
      if (matchScore >= 0.75 && meetsExperience) {
        tier = 'High';
      } else if (matchScore >= 0.4 || meetsExperience) {
        tier = 'Partial';
      } else {
        tier = 'Low';
      }

      return {
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        skills: candidate.skills,
        experience: candidate.experience,
        bio: candidate.bio,
        matchScore: Math.round(matchScore * 100),
        matchedSkills: candidate.skills.filter((s) =>
          normalizedRequired.includes(s.toLowerCase())
        ),
        matchedPreferredSkills: candidate.skills.filter((s) =>
          normalizedPreferred.includes(s.toLowerCase())
        ),
        meetsExperience,
        tier,
      };
    })
    .sort((a, b) => {
      // Sort by tier first, then score
      const tierOrder = { High: 0, Partial: 1, Low: 2 };
      if (tierOrder[a.tier] !== tierOrder[b.tier]) {
        return tierOrder[a.tier] - tierOrder[b.tier];
      }
      return b.matchScore - a.matchScore;
    });
}

// POST /api/match — Shortlist candidates with basic logic
const shortlistCandidates = async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills } = req.body;

    if (!requiredSkills || !Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({ error: 'requiredSkills array is required' });
    }

    const candidates = await Candidate.find();
    const results = matchCandidates(candidates, {
      requiredSkills,
      minExperience: minExperience || 0,
      preferredSkills: preferredSkills || [],
    });

    res.json({
      total: results.length,
      jobRequirements: { requiredSkills, minExperience, preferredSkills },
      results,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { shortlistCandidates, matchCandidates };
