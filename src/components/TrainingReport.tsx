import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SessionData } from "../types";
import "./TrainingReport.css";

const TrainingReport: React.FC = () => {
  const { sessionId } = useParams<{ deckId: string; sessionId: string }>();
  const [sessionData, setSessionData] = useState<SessionData[]>([]);

  useEffect(() => {
    const sessionDataString = localStorage.getItem(sessionId!);
    const retrievedSessionData: SessionData[] = sessionDataString
      ? (JSON.parse(sessionDataString) as SessionData[])
      : [];

    setSessionData(retrievedSessionData);

    // For debugging purposes
    console.log("Session Data:", retrievedSessionData);
  }, [sessionId]);

  return (
    <div className="report-container">
      <h2>Training Report</h2>
      {sessionData.length === 0 ? (
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
            {sessionData.map((data, index) => (
              <tr key={index} className={data.correct ? "correct" : "incorrect"}>
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
