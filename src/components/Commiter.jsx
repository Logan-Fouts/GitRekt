import React, { useState } from "react";

const MessageForm = ({ repoPath }) => {
  const [message, setMessage] = useState("");

  const handleAddFiles = async () => {
    try {
      const result = await window.electronAPI.gitAdd(repoPath);
      console.log("Git add result:", result);
    } catch (error) {
      console.error("Error adding files:", error);
    }
  };

  const handleCommit = async () => {
    if (!message.trim()) {
      alert("Please enter a commit message");
      return;
    }
    try {
      const result = await window.electronAPI.gitCommit(repoPath, message);
      console.log("Git commit result:", result);
      setMessage("");
    } catch (error) {
      console.error("Error committing changes:", error);
    }
  };

  return (
    <>
      <form
        className="max-w-md mx-auto mt-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-slate-300 font-bold mb-2"
          >
            Commit Message:
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
            placeholder="Type your message here..."
            required
          />
        </div>
      </form>
      <div className="flex items-center justify-between pl-8 pr-8">
        <button
          onClick={handleAddFiles}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Files
        </button>
        <button
          onClick={handleCommit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Commit
        </button>
      </div>
    </>
  );
};

export default function Committer({ repoPath }) {
  return (
    <div className="w-full pb-20">
      <MessageForm repoPath={repoPath} />
    </div>
  );
}
