import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Session } from "../../types";
import "./TrainingReport.css";
import { useGetsessionByIdQuery } from "../../utils/api/SessionApi";
import { formatTimeToAnswer } from "../../utils/helpers"; // Assume this is a helper function you create

const TrainingReport: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const { data: sessionQuery } = useGetsessionByIdQuery(sessionId ?? "");

  useEffect(() => {
    if (sessionQuery) {
      setSessionData(sessionQuery);
    }
  }, [sessionQuery]);

  if (!sessionData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="logo-container">
        <Link to="/">
          <img src="/palooza.png" alt="Recall a plooza" className="logo" />
        </Link>
      </div>
      <div className="report-container">
        <h2>Training Report</h2>
        {!sessionData.data.length ? (
          <p className="no-data">No data available for this session.</p>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Time to Answer (s)</th>
                <th>Correct</th>
                <th>Rating</th>
                <th>Learning Material</th>
              </tr>
            </thead>
            <tbody>
              {sessionData.data.map((item, index) => (
                <tr
                  key={index}
                  className={
                    item.correct ? "correct_answer" : "incorrect_answer"
                  }
                >
                  <td>{item.question}</td>
                  <td>{formatTimeToAnswer(item.timeToAnswer)}</td>
                  <td>{item.correct ? "Yes" : "No"}</td>
                  <td>{item.rating}</td>
                  <td>
                    {item.learningMaterialLink ? 
                    <a
                      href={item.learningMaterialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="learn-more-link"
                    >
                      Learn More
                    </a> : ''
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default TrainingReport;
