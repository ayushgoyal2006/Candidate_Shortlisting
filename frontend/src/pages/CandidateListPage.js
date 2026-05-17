import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getAllCandidates, deleteCandidate } from '../services/api';
import CandidateCard from '../components/CandidateCard';
import './CandidateListPage.css';

function CandidateListPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [error, setError] = useState('');

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (skillFilter) params.skill = skillFilter;
      const res = await getAllCandidates(params);
      setCandidates(res.data);
    } catch (err) {
      setError('Failed to load candidates. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [search, skillFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchCandidates, 300);
    return () => clearTimeout(timer);
  }, [fetchCandidates]);

  const handleDelete = async (id) => {
    try {
      await deleteCandidate(id);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
      toast.success('Candidate deleted.');
    } catch {
      toast.error('Failed to delete candidate.');
    }
  };

  return (
    <div>
      <h1 className="page-title">👥 All Candidates</h1>
      <p className="page-subtitle">
        {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} in the system
      </p>

      <div className="filters card">
        <div className="grid-2">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>🔍 Search by Name / Email</label>
            <input
              type="text"
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>🏷 Filter by Skill</label>
            <input
              type="text"
              placeholder="e.g. React"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="empty-state">
          <div className="spinner" style={{ width: 36, height: 36, borderColor: '#4f46e5', borderTopColor: 'transparent' }} />
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading candidates...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="empty-state card">
          <div style={{ fontSize: '3rem' }}>📭</div>
          <h3>No candidates found</h3>
          <p>Try adjusting your filters or add new candidates.</p>
        </div>
      ) : (
        <div className="candidates-grid">
          {candidates.map((c) => (
            <CandidateCard key={c._id} candidate={c} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CandidateListPage;
