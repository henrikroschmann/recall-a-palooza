// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import TrainingSession from "./components/TrainingSession";
import Deck from "./components/Deck";
import TrainingReport from "./components/TrainingReport";
import SessionsList from "./components/SessionsList";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/deck" element={<Deck />} />
          <Route path="/sessions-list" element={<SessionsList />} />
          <Route path="/train/:deckId" element={<TrainingSession />} />
          <Route path="/training-report/:sessionId" element={<TrainingReport />} />
          <Route
            path="/"
            element={
              <div className="hero-section">
                <img src="./palooza.png" alt="Brain Design" />
                <h1>Welcome to the Spaced Repetition App</h1>
                <button className="primary-btn">
                  <Link to="/deck">Let's create some learning material!</Link>
                </button>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
