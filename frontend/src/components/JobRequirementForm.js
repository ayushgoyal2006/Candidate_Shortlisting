import React, { useState } from 'react';

function JobRequirementForm({ onSubmit, loading, submitLabel = 'Search', aiMode = false }) {
  const [requiredSkills, setRequiredSkills] = useState('');
  const [preferredSkills, setPreferredSkills] = useState('');
  const [minExperience, setMinExperience] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reqArr = requiredSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const prefArr = preferredSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (reqArr.length === 0) {
      alert('Please enter at least one required skill.');
      return;
    }

    onSubmit({
      requiredSkills: reqArr,
      preferredSkills: prefArr,
      minExperience: Number(minExperience),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>
        {aiMode ? '🤖 AI Job Requirement Input' : '🔍 Job Requirement Input'}
      </h2>
      <div className="grid-2">
        <div className="form-group">
          <label>Required Skills *</label>
          <input
            type="text"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            placeholder="React, Node.js, MongoDB"
            required
          />
          <p className="form-hint">Comma-separated list of required skills</p>
        </div>
        <div className="form-group">
          <label>Preferred Skills</label>
          <input
            type="text"
            value={preferredSkills}
            onChange={(e) => setPreferredSkills(e.target.value)}
            placeholder="AWS, Docker, TypeScript"
          />
          <p className="form-hint">Comma-separated (optional bonus skills)</p>
        </div>
      </div>
      <div className="form-group" style={{ maxWidth: '200px' }}>
        <label>Minimum Experience (years)</label>
        <input
          type="number"
          min="0"
          value={minExperience}
          onChange={(e) => setMinExperience(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className={`btn ${aiMode ? 'btn-ai' : 'btn-primary'}`}
        disabled={loading}
      >
        {loading ? <><span className="spinner" /> Processing...</> : submitLabel}
      </button>
    </form>
  );
}

export default JobRequirementForm;
