import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import TrainingSession from "./components/TrainingSession";
import { FlashcardProvider } from "./context/FlashcardContext";
import Deck from "./components/Deck";
import TrainingReport from "./components/TrainingReport";
import SessionsList from "./components/SessionsList";

function App() {
  return (
    <FlashcardProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/deck" element={<Deck />} />
            <Route path="/sessions-list" element={<SessionsList />} />
            <Route path="/train/:deckId" element={<TrainingSession />} />
            <Route
              path="/training-report/:sessionId"
              element={<TrainingReport />}
            />
            <Route
              path="/"
              element={
                <div className="hero-section">
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
    </FlashcardProvider>
  );
}

export default App;
