import React from "react";
import "./TagCloud.css";
import { useNavigate } from "react-router-dom";

function TagCloud() {
  const navigate = useNavigate();
  const item = localStorage.getItem("session-cloud");
  const sessionCloud: { value: string; priority: number }[] =
    item && item !== ""
      ? (JSON.parse(item) as { value: string; priority: number }[])
      : [];

  return (
    <>
      <ul className="cloud" role="navigation" aria-label="Webdev tag cloud">
        {sessionCloud?.map((session, index) => (
          <li key={index}>
            <a
              data-weight={session.priority}
              onClick={() => navigate("/train/" + session.value)}
            >
              {session?.value?.substring(0, 8)}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export default TagCloud;
