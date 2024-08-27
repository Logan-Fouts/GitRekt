import React, { useEffect, useState } from "react";
import TreeBuilder from "./BuildTree";

const GitTree = ({ repoPath }) => {
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState(null);

  const fetchGitLog = async (retries = 3) => {
    try {
      const log = await window.electronAPI.getGitLog(repoPath);
      if (!Array.isArray(log) || log.length === 0) {
        if (retries > 0) {
          console.log("Git log is empty or invalid, retrying...");
          setTimeout(() => fetchGitLog(retries - 1), 1000);
        } else {
          throw new Error("Failed to fetch git log after multiple attempts");
        }
      } else {
        setLogs(log);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching git log:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchGitLog();
  }, [repoPath]);

  return (
    <div className="w-full">
      {error && <p className="error-message">Error: {error}</p>}
      {logs && <TreeBuilder log={logs} />}
    </div>
  );
};

export default GitTree;
