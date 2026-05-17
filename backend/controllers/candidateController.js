const Candidate = require('../models/Candidate');

// POST /api/candidates — Add a new candidate
const addCandidate = async (req, res) => {
  try {
    const { name, email, skills, experience, bio } = req.body;

    const existing = await Candidate.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Candidate with this email already exists' });
    }

    const candidate = new Candidate({ name, email, skills, experience, bio });
    const saved = await candidate.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/candidates — Get all candidates
const getAllCandidates = async (req, res) => {
  try {
    const { search, skill } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }

    const candidates = await Candidate.find(query).sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/candidates/:id — Get single candidate
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/candidates/:id — Delete a candidate
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addCandidate, getAllCandidates, getCandidateById, deleteCandidate };
