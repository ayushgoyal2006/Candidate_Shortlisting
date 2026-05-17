import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addCandidate } from '../services/api';
import './CandidateFormPage.css';

function CandidateFormPage({ onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const skillsArray = form.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (skillsArray.length === 0) {
      setError('Please enter at least one skill.');
      setLoading(false);
      return;
    }

    try {
      await addCandidate({
        name: form.name.trim(),
        email: form.email.trim(),
        skills: skillsArray,
        experience: Number(form.experience),
        bio: form.bio.trim(),
      });
      toast.success(`✅ Candidate "${form.name}" added successfully!`);
      setForm({ name: '', email: '', skills: '', experience: '', bio: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to add candidate';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="candidate-form-page">
      <h1 className="page-title">➕ Add Candidate</h1>
      <p className="page-subtitle">Fill in the details to add a new candidate to the system.</p>

      <div className="card form-card">
        {error && <div className="error-msg">⚠ {error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. rahul@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills *</label>
            <input
              id="skills"
              name="skills"
              type="text"
              placeholder="e.g. React, Node.js, MongoDB"
              value={form.skills}
              onChange={handleChange}
              required
            />
            <p className="form-hint">Enter skills separated by commas</p>
          </div>

          {form.skills && (
            <div className="skill-preview">
              {form.skills
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
                .map((s) => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
            </div>
          )}

          <div className="form-group" style={{ maxWidth: '220px' }}>
            <label htmlFor="experience">Experience (years) *</label>
            <input
              id="experience"
              name="experience"
              type="number"
              min="0"
              step="0.5"
              placeholder="e.g. 2"
              value={form.experience}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio / Projects (optional)</label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              placeholder="Brief summary of candidate's background, projects, etc."
              value={form.bio}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Adding...</> : '➕ Add Candidate'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setForm({ name: '', email: '', skills: '', experience: '', bio: '' })}
            >
              🔄 Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CandidateFormPage;
