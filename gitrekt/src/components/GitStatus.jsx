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

  if (loading) return <div className="text-gray-600">Loading Git status...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 max-w-full">
      <h3 className="text-lg font-semibold mb-2">Git Status:</h3>
      <pre className=" p-2 rounded overflow-hidden text-ellipsis max-w-full">
        {status}
      </pre>
      <button 
        onClick={getGitStatus}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Refresh Status
      </button>
    </div>
  );
};

export default GitStatus;