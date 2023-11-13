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
        <div className="summary-details">
          {state.sessionData.map((data, index) => (
            <div
              key={index}
              className={`summary-item ${
                data.correct ? "correct" : "incorrect"
              }`}
            >
              {data.correct ? (
                <>
                  <span className="summary-icon">✔</span>
                  <span>What you know</span>
                </>
              ) : (
                <>
                  <span className="summary-icon">✘</span>
                  <span>What you should review</span>
                </>
              )}
              <Markdown>{data.question}</Markdown>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SessionSummary;
