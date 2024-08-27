import React, { useState, useEffect } from "react";
import StorageService from "./services/StorageService";
import EventBus from "./services/EventBus";

const Button = ({ label, onClick, imgsrc, disabled }) => (
  <div className="flex flex-col items-center">
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-gray-200 text-sm font-light transition-colors duration-200 flex flex-col items-center ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"
      }`}
    >
      <span>{label}</span>
      <img
        src={imgsrc}
        alt="action button"
        className="w-5 h-5 object-contain mb-1 mt-1"
      />
    </button>
  </div>
);

export default function TopBar() {
  const [repoName, setRepoName] = useState(null);
  const [repoPath, setRepoPath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchRepoInfo() {
      try {
        const storageService = new StorageService();
        const name = await storageService.getItem("repoName");
        const path = await storageService.getItem("repoDir");
        setRepoName(name);
        setRepoPath(path);
      } catch (error) {
        console.error("Failed to fetch repo info from storage:", error);
      }
    }

    fetchRepoInfo();
    function handleStorageChange(event) {
      if (event.key === "repoName" || event.key === "repoPath") {
        fetchRepoInfo();
      }
    }
    EventBus.on("storageChanged", handleStorageChange);
  }, []);

  const handlePull = async () => {
    if (!repoPath) return;
    setIsLoading(true);
    try {
      const result = await window.electronAPI.gitPull(repoPath);
      if (result.success) {
        console.log("Pull successful", result.summary);
        location.reload();
      } else {
        console.error("Pull failed:", result.message);
      }
    } catch (error) {
      console.error("Error during pull:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePush = async () => {
    if (!repoPath) return;
    setIsLoading(true);
    try {
      const result = await window.electronAPI.gitPush(repoPath);
      if (result.success) {
        console.log("Push successful");
        location.reload();
      }
    } catch (error) {
      console.error("Error during push:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pl-2 bg-kraktopgrey flex items-center h-1/12">
      <div className="text-gray-200 font-semibold text-2xl w-1/4">
        {repoName}
      </div>
      <div className="flex-grow flex justify-center space-x-4">
        <Button
          label="Pull"
          imgsrc="icons/pull.png"
          onClick={handlePull}
          disabled={isLoading || !repoPath}
        />
        <Button
          label="Push"
          imgsrc="icons/push.png"
          onClick={handlePush}
          disabled={isLoading || !repoPath}
        />
      </div>
      <div className="w-1/4"></div>
    </div>
  );
}
