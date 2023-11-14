import { Link, useLocation } from 'react-router-dom';
import './sessionSummary.css'; // Make sure this path is correct
import { SessionData } from 'types';

const SessionSummary = () => {
  const location = useLocation();
  const state = location.state as { sessionData: SessionData[] };
  const correctCount = state.sessionData.filter((data) => data.correct).length;
  const totalCount = state.sessionData.length;

  const correctAnswers = state.sessionData.filter((data) => data.correct);
  const incorrectAnswers = state.sessionData.filter((data) => !data.correct);

  return (
    <>
      <div className="logo-container">
        <Link to="/">
          <img src="/palooza.png" alt="Recall a plooza" className="logo" />
        </Link>
      </div>
      <div className="session-summary-container">
        <h2>Review the course materials to expand your learning.</h2>
        <p>You got {correctCount} out of {totalCount} correct.</p>

        {correctAnswers.length > 0 && (
          <div className="answers-section correct-answers">
            <h3>What you know</h3>
            <ul>
              {correctAnswers.map((answer, index) => (
                <li key={index} className="summary-item correct">
                  <span className="summary-icon">✔</span>
                  <span className="summary-text">{answer.question}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {incorrectAnswers.length > 0 && (
          <div className="answers-section incorrect-answers">
            <h3>What you should review</h3>
            <ul>
              {incorrectAnswers.map((answer, index) => (
                <li key={index} className="summary-item incorrect">
                  <span className="summary-icon">✘</span>
                  <span className="summary-text">{answer.question}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link to="/" className="link-back">
          Back to Home
        </Link>
      </div>
    </>
  );
};

export default SessionSummary;
