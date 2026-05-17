import React, { useState } from 'react';
import { shortlistCandidates } from '../services/api';
import JobRequirementForm from '../components/JobRequirementForm';
import CandidateCard from '../components/CandidateCard';
import MatchScoreChart from '../components/MatchScoreChart';

function ShortlistPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (jobData) => {
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const res = await shortlistCandidates(jobData);
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to shortlist candidates');
    } finally {
      setLoading(false);
    }
  };

  const high = results?.results?.filter((r) => r.tier === 'High') || [];
  const partial = results?.results?.filter((r) => r.tier === 'Partial') || [];
  const low = results?.results?.filter((r) => r.tier === 'Low') || [];

  return (
    <div>
      <h1 className="page-title">🔍 Shortlist Candidates</h1>
      <p className="page-subtitle">Enter job requirements to rank candidates by skill match.</p>

      <JobRequirementForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="🔍 Shortlist Candidates"
      />

      {error && <div className="error-msg">⚠ {error}</div>}

      {results && (
        <>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <p style={{ fontWeight: 700, fontSize: '1rem' }}>
              Found <strong>{results.total}</strong> candidate{results.total !== 1 ? 's' : ''} —{' '}
              <span style={{ color: '#22c55e' }}>{high.length} High</span>,{' '}
              <span style={{ color: '#f59e0b' }}>{partial.length} Partial</span>,{' '}
              <span style={{ color: '#ef4444' }}>{low.length} Low</span>
            </p>
          </div>

          <MatchScoreChart candidates={results.results} />

          {high.length > 0 && (
            <section>
              <h2 style={{ margin: '1.5rem 0 0.75rem', fontSize: '1.1rem', color: '#166534' }}>
                ⭐ High Match
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: '1rem' }}>
                {high.map((c) => <CandidateCard key={c._id} candidate={c} matchData={c} />)}
              </div>
            </section>
          )}

          {partial.length > 0 && (
            <section>
              <h2 style={{ margin: '1.5rem 0 0.75rem', fontSize: '1.1rem', color: '#854d0e' }}>
                🔶 Partial Match
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: '1rem' }}>
                {partial.map((c) => <CandidateCard key={c._id} candidate={c} matchData={c} />)}
              </div>
            </section>
          )}

          {low.length > 0 && (
            <section>
              <h2 style={{ margin: '1.5rem 0 0.75rem', fontSize: '1.1rem', color: '#991b1b' }}>
                🔻 Low Match
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: '1rem' }}>
                {low.map((c) => <CandidateCard key={c._id} candidate={c} matchData={c} />)}
              </div>
            </section>
          )}

          {results.total === 0 && (
            <div className="empty-state card">
              <div style={{ fontSize: '3rem' }}>😔</div>
              <h3>No candidates found</h3>
              <p>Add more candidates or adjust job requirements.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ShortlistPage;
