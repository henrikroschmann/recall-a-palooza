import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import TrainingSession from "./components/TrainingSession/TrainingSession";
import Deck from "./components/Deck/Deck";
import TrainingReport from "./components/TrainingReport/TrainingReport";
import SessionsList from "./components/SessionsList/SessionsList";
import TagCloud from "./components/Deck/TagCloud/TagCloud";
import 'react-toastify/dist/ReactToastify.css';
import ImportExportDecks from "./components/ImportExport/ImportExportDecks";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/deck" element={<Deck />} />
          <Route path="/deck/:deckId" element={<Deck />} />
          <Route path="/sessions-list" element={<SessionsList />} />
          <Route path="/train/:deckId" element={<TrainingSession />} />
          <Route path="/import" element={<ImportExportDecks />} />
          <Route
            path="/training-report/:sessionId"
            element={<TrainingReport />}
          />
          <Route
            path="/"
            element={
              <>
                <div className="hero-section">
                  <img src="./palooza.png" alt="Brain Design" />
                  <h1>Recall a Palooza</h1>
                  <h3>just another Spaced Repetition App</h3>
                  <button className="primary-btn">
                    <Link to="/deck">Let's create some learning material!</Link>
                  </button>
                </div>
                <TagCloud />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
