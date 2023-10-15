import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SessionList.css";

interface SessionBrief {
  sessionId: string;
  deckId: string;
}

const SessionsList: React.FC = () => {
  const [sessions, setSessions] = useState<SessionBrief[]>([]);
  const convertTimestampToDate = (timestamp: number): string => {
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleString(); // This will return date and time in the format: "MM/DD/YYYY, hh:mm:ss AM/PM"
  };

  useEffect(() => {
    const allKeys = Object.keys(localStorage);
    const sessionKeys = allKeys.filter((key) => key.includes("-session-"));

    const retrievedSessions: SessionBrief[] = sessionKeys.map((key) => {
      const [deckId] = key.split("-session-");
      return {
        sessionId: key,
        deckId: deckId,
      };
    });

    setSessions(retrievedSessions);
  }, []);

  return (
    <div className="report-container">
      <h2>Training Session Report</h2>

      {sessions.length === 0 ? (
        <p>No sessions available.</p>
      ) : (
        <div className="report-content">
          <h3>Overview</h3>
          <table className="sessions-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {sessions
                .sort(
                  (a, b) =>
                    Number(b.sessionId.split("-session-")[1]) -
                    Number(a.sessionId.split("-session-")[1])
                )
                .map((session, index) => (
                  <tr key={index} className="session-item">
                    <td>
                      <Link
                        to={`/training-report/${session.sessionId}`}
                        className="session-link"
                      >
                        Report for Session: {session.sessionId}
                      </Link>
                    </td>
                    <td className="session-time">
                      {convertTimestampToDate(
                        Number(session.sessionId.split("-session-")[1])
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SessionsList;
