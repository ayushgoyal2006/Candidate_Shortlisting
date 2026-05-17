import React, { useState } from 'react';
import { aiShortlist, generateInterviewQuestions } from '../services/api';
import JobRequirementForm from '../components/JobRequirementForm';
import MatchScoreChart from '../components/MatchScoreChart';
import './AiShortlistPage.css';

function AiShortlistPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [interviewLoading, setInterviewLoading] = useState({});
  const [interviewQuestions, setInterviewQuestions] = useState({});

  const handleSubmit = async (jobData) => {
    setLoading(true);
    setError('');
    setResults(null);
    setInterviewQuestions({});
    try {
      const res = await aiShortlist(jobData);
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'AI shortlisting failed. Check your OpenRouter API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async (candidateId, candidateName) => {
    setInterviewLoading((prev) => ({ ...prev, [candidateId]: true }));
    try {
      const res = await generateInterviewQuestions({
        candidateId,
        requiredSkills: results?.jobRequirements?.requiredSkills || [],
      });
      setInterviewQuestions((prev) => ({ ...prev, [candidateId]: res.data.questions }));
    } catch {
      setInterviewQuestions((prev) => ({
        ...prev,
        [candidateId]: ['Failed to generate questions. Check API key.'],
      }));
    } finally {
      setInterviewLoading((prev) => ({ ...prev, [candidateId]: false }));
    }
  };

  return (
    <div>
      <h1 className="page-title">🤖 AI-Based Shortlisting</h1>
      <p className="page-subtitle">
        Uses OpenRouter AI to intelligently rank candidates beyond simple keyword matching.
      </p>

      <JobRequirementForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="🤖 Run AI Analysis"
        aiMode
      />

      {error && <div className="error-msg">⚠ {error}</div>}

      {results && (
        <>
          {results.summary && (
            <div className="card ai-summary">
              <h3>🧠 AI Summary</h3>
              <p>{results.summary}</p>
            </div>
          )}

          <MatchScoreChart candidates={results.basicRanking} />

          <h2 style={{ margin: '1.5rem 0 0.75rem', fontSize: '1.1rem' }}>
            🏆 AI Rankings ({results.aiRankings?.length || 0} candidates)
          </h2>

          {results.aiRankings?.map((entry, idx) => {
            const md = entry.matchData;
            const candidateId = md?._id;
            const questions = interviewQuestions[candidateId];
            const qLoading = interviewLoading[candidateId];

            return (
              <div key={idx} className="card ai-candidate-card">
                <div className="ai-rank-header">
                  <div className="rank-number">#{entry.rank}</div>
                  <div className="rank-info">
                    <h3>{entry.name}</h3>
                    {md && (
                      <div className="rank-meta">
                        <span className="skill-tag">{md.experience}y exp</span>
                        {md.skills?.slice(0, 4).map((s) => (
                          <span key={s} className={`skill-tag ${md.matchedSkills?.includes(s) ? 'matched' : ''}`}>
                            {s}
                          </span>
                        ))}
                        {md.skills?.length > 4 && (
                          <span className="skill-tag">+{md.skills.length - 4} more</span>
                        )}
                      </div>
                    )}
                  </div>
                  {md && (
                    <div className="rank-score" style={{
                      color: md.matchScore >= 75 ? '#22c55e' : md.matchScore >= 40 ? '#f59e0b' : '#ef4444'
                    }}>
                      <span className="score-num">{md.matchScore}%</span>
                      <span style={{ fontSize: '0.7rem' }}>Match</span>
                    </div>
                  )}
                </div>

                <div className="ai-recommendation">
                  <span className="ai-label">🤖 AI Recommendation:</span>
                  <p>{entry.recommendation}</p>
                </div>

                {entry.interviewQuestions?.length > 0 && (
                  <div className="ai-interview-qs">
                    <p className="ai-label">💬 Suggested Interview Questions:</p>
                    <ul>
                      {entry.interviewQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {candidateId && (
                  <div className="generate-qs-section">
                    <button
                      className="btn btn-ai"
                      style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }}
                      onClick={() => handleGenerateQuestions(candidateId, entry.name)}
                      disabled={qLoading}
                    >
                      {qLoading ? <><span className="spinner" /> Generating...</> : '📝 Generate More Interview Questions'}
                    </button>
                    {questions && (
                      <div className="extra-questions">
                        <p className="ai-label" style={{ marginTop: '0.75rem' }}>📋 Additional Questions:</p>
                        <ol>
                          {questions.map((q, i) => <li key={i}>{q}</li>)}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {(!results.aiRankings || results.aiRankings.length === 0) && (
            <div className="empty-state card">
              <p>No AI rankings returned. Add more candidates first.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AiShortlistPage;
