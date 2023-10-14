import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface SessionBrief {
  sessionId: string;
  deckId: string;
}

const SessionsList: React.FC = () => {
  const [sessions, setSessions] = useState<SessionBrief[]>([]);

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
    <div>
      <h2>Sessions List</h2>
      {sessions.length === 0 && <p>No sessions available.</p>}
      <ul>
        {sessions.map((session, index) => (
          <li key={index}>
            <Link to={`/training-report/${session.sessionId}`}>
              Report for Session: {session.sessionId}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionsList;
