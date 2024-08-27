import React, { useState } from "react";

const ApiTokenPrompt = () => {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const setApiToken = async (event) => {
    event.preventDefault();

    try {
      const success = await window.electronAPI.modifyEnv(
        "NEXT_PUBLIC_TOKEN",
        token
      );

      if (success) {
        setMessage("API Token successfully written to .env file");
      } else {
        throw new Error("Failed to set token");
      }
    } catch (error) {
      console.error("Failed to set API Token:", error);
      setMessage(`Error: ${error.message}`);
    }

    location.reload();
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl">Enter GitHub API Token:</h1>
      <form onSubmit={setApiToken} className="space-x-4">
        <input
          type="text"
          id="token"
          name="gitToken"
          className="p-2 rounded"
          required
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button type="submit" className="bg-green-500 p-2 rounded">
          Confirm
        </button>
      </form>
      {message && (
        <p
          className={
            message.includes("Error") ? "text-red-500" : "text-green-500"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ApiTokenPrompt;
