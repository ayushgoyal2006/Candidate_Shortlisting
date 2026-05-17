import React from 'react';
import './Navbar.css';

const NAV_ITEMS = [
  { key: 'candidate_list', label: '👥 Candidates' },
  { key: 'add_candidate', label: '➕ Add Candidate' },
  { key: 'shortlist', label: '🔍 Shortlist' },
  { key: 'ai_shortlist', label: '🤖 AI Shortlist' },
];

function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="brand-icon">🎯</span>
          <div>
            <span className="brand-title">CandidateIQ</span>
            <span className="brand-sub">Shortlisting System</span>
          </div>
        </div>
        <ul className="nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <button
                className={`nav-btn ${currentPage === item.key ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.key)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
