import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SessionData } from "../types";

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
    <div>
      <h2>Training Report</h2>
      {sessionData.length === 0 && <p>No data available for this session.</p>}
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Time to Answer (ms)</th>
            <th>Correct</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {sessionData.map((data, index) => (
            <tr key={index}>
              <td>{data.question}</td>
              <td>{data.timeToAnswer}</td>
              <td>{data.correct ? "Yes" : "No"}</td>
              <td>{data.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainingReport;
