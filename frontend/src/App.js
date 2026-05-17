import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import CandidateFormPage from './pages/CandidateFormPage';
import CandidateListPage from './pages/CandidateListPage';
import ShortlistPage from './pages/ShortlistPage';
import AiShortlistPage from './pages/AiShortlistPage';
import './App.css';

const PAGES = {
  ADD_CANDIDATE: 'add_candidate',
  CANDIDATE_LIST: 'candidate_list',
  SHORTLIST: 'shortlist',
  AI_SHORTLIST: 'ai_shortlist',
};

function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.CANDIDATE_LIST);

  const renderPage = () => {
    switch (currentPage) {
      case PAGES.ADD_CANDIDATE:
        return <CandidateFormPage onSuccess={() => setCurrentPage(PAGES.CANDIDATE_LIST)} />;
      case PAGES.CANDIDATE_LIST:
        return <CandidateListPage />;
      case PAGES.SHORTLIST:
        return <ShortlistPage />;
      case PAGES.AI_SHORTLIST:
        return <AiShortlistPage />;
      default:
        return <CandidateListPage />;
    }
  };

  return (
    <div className="app">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} pages={PAGES} />
      <main className="main-content">{renderPage()}</main>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App;
