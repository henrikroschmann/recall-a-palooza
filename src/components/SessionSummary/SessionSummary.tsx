import React from "react";
import Markdown from "react-markdown";
import "./sessionSummary.css";
import { SessionData } from "types";
import { Link, useLocation } from "react-router-dom";

const SessionSummary: React.FC = () => {
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
        <p>
          You got {correctCount} out of {totalCount} correct.
        </p>
        <div className="correct-answers">
          {correctAnswers.map((data, index) => (
            <div key={index} className="correct-answer">
              <span className="summary-icon-green">✔</span>
              <span className="summary-text">{data.question}</span>
            </div>
          ))}
        </div>
        <div className="incorrect-answers">
          {incorrectAnswers.map((data, index) => (
            <div key={index} className="incorrect-answer">
              <span className="summary-icon-red">✘</span>
              <span className="summary-text">{data.question}</span>
            </div>
          ))}
        </div>
        <Link to="/" className="link-back">
          Back to Home
        </Link>
      </div>
    </>
  );
};

export default SessionSummary;
