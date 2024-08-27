import React, { useState, useEffect } from "react";

const GitStatus = ({ repoPath }) => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getGitStatus = async () => {
    try {
      setLoading(true);
      const newStatus = await window.electronAPI.getGitStatus(repoPath);
      setStatus(newStatus || "No changes");
    } catch (error) {
      console.error("Failed to get Git Status:", error);
      setError("Failed to fetch Git status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGitStatus();
  }, [repoPath]);

  if (loading)
    return <div className="text-gray-600">Loading Git status...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between mb-4 items-center">
        <h3 className="text-lg font-semibold">Git Status:</h3>
        <button onClick={getGitStatus}>
          <img src="/icons/refresh.png" className="w-10" />
        </button>
      </div>
      <pre className="rounded overflow-hidden text-ellipsis max-w-full">
        {status}
      </pre>
    </div>
  );
};

export default GitStatus;
