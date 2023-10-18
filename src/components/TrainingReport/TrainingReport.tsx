import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Session } from "../../types";
import "./TrainingReport.css";
import { useGetsessionByIdQuery } from "../../utils/api/SessionApi";

const TrainingReport: React.FC = () => {
  const { sessionId } = useParams<{ deckId: string; sessionId: string }>();
  const [sessionData, setSessionData] = useState<Session>();
  const { data: sessionQuery } = useGetsessionByIdQuery(sessionId ?? "");

  useEffect(() => {
    const retrievedSessionData = sessionQuery;

    setSessionData(retrievedSessionData);
  }, [sessionId, sessionQuery]);

  return (
    <div className="report-container">
      <h2>Training Report</h2>
      {sessionData?.data.length === 0 ? (
        <p className="no-data">No data available for this session.</p>
      ) : (
        <table className="report-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Time to Answer (s)</th>
              <th>Correct</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {sessionData?.data.map((data, index) => (
              <tr
                key={index}
                className={data.correct ? "correct" : "incorrect"}
              >
                <td>{data.question}</td>
                <td>{(data.timeToAnswer / 1000).toFixed(2)}</td>
                <td>{data.correct ? "Yes" : "No"}</td>
                <td>{data.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrainingReport;
