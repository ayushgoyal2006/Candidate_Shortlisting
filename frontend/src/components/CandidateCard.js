import React from 'react';
import './CandidateCard.css';

function CandidateCard({ candidate, onDelete, matchData }) {
  const handleDelete = () => {
    if (window.confirm(`Delete candidate "${candidate.name}"?`)) {
      onDelete(candidate._id);
    }
  };

  const scoreColor = matchData
    ? matchData.matchScore >= 75
      ? '#22c55e'
      : matchData.matchScore >= 40
      ? '#f59e0b'
      : '#ef4444'
    : '#4f46e5';

  return (
    <div className="candidate-card">
      <div className="candidate-card-header">
        <div className="candidate-avatar">{candidate.name.charAt(0).toUpperCase()}</div>
        <div className="candidate-info">
          <h3 className="candidate-name">{candidate.name}</h3>
          <p className="candidate-email">{candidate.email}</p>
          <p className="candidate-exp">
            <span>🕒</span> {candidate.experience} year{candidate.experience !== 1 ? 's' : ''} experience
          </p>
        </div>
        {matchData && (
          <div className="candidate-score-badge" style={{ borderColor: scoreColor, color: scoreColor }}>
            <span className="score-num">{matchData.matchScore}%</span>
            <span className="score-label">Match</span>
          </div>
        )}
      </div>

      {matchData && (
        <div className="score-bar-container">
          <div
            className="score-bar"
            style={{ width: `${matchData.matchScore}%`, background: scoreColor }}
          />
        </div>
      )}

      {matchData && (
        <div className="tier-row">
          <span className={`tier-badge tier-${matchData.tier.toLowerCase()}`}>
            {matchData.tier === 'High' ? '⭐ High Match' : matchData.tier === 'Partial' ? '🔶 Partial Match' : '🔻 Low Match'}
          </span>
          {!matchData.meetsExperience && (
            <span className="exp-warn">⚠ Below min. experience</span>
          )}
        </div>
      )}

      <div className="skills-section">
        <p className="skills-label">Skills:</p>
        <div className="skills-wrap">
          {candidate.skills.map((skill) => {
            const isMatched = matchData?.matchedSkills?.some(
              (s) => s.toLowerCase() === skill.toLowerCase()
            );
            return (
              <span key={skill} className={`skill-tag ${isMatched ? 'matched' : ''}`}>
                {isMatched ? '✓ ' : ''}{skill}
              </span>
            );
          })}
        </div>
      </div>

      {matchData?.matchedSkills?.length > 0 && (
        <p className="matched-info">
          ✅ Matched {matchData.matchedSkills.length} required skill{matchData.matchedSkills.length !== 1 ? 's' : ''}
        </p>
      )}

      {candidate.bio && (
        <p className="candidate-bio">{candidate.bio}</p>
      )}

      {onDelete && (
        <button className="btn btn-danger delete-btn" onClick={handleDelete}>
          🗑 Delete
        </button>
      )}
    </div>
  );
}

export default CandidateCard;
