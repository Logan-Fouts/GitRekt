"use client";

import React, { useState, useEffect } from "react";
import APIService from "./services/APIService";
import StorageService from "./services/StorageService";

const cache = new Map();

const LocalInfo = ({ localRepoInfo }) => {
  if (!localRepoInfo) {
    return (
      <div className="text-gray-500">No repository information available.</div>
    );
  }

  const { currentBranch, repoName, remotes } = localRepoInfo;

  return (
    <div className="text-slate-300">
      <div className="pb-2 flex items-center">
        <h3 className="text-sm font-semibold pl-4 pr-2">Repository Name:</h3>
        <p className="text-xs">{repoName}</p>
      </div>

      <div className="pb-2 flex items-center">
        <h3 className="text-sm font-semibold pl-4 pr-2">Current Branch:</h3>
        <p className="text-xs">{currentBranch}</p>
      </div>
    </div>
  );
};

const LocalContent = ({ reponame, owner }) => {
  const [localRepoInfo, setLocalRepoInfo] = useState(null);
  const [isSelectingDirectory, setIsSelectingDirectory] = useState(false);

  const handleSelectDirectory = () => {
    setIsSelectingDirectory(true);
    window.electronAPI
      .selectDirectory()
      .then((path) => {
        if (path) {
          setLocalRepoInfo(path);
        }
        setIsSelectingDirectory(false);
      })
      .catch((error) => {
        console.error("Error selecting directory:", error);
        setIsSelectingDirectory(false);
      });
  };

  useEffect(() => {
    if (localRepoInfo) {
      const fetchRepoInfo = async () => {
        try {
          let info;
        } catch (error) {
          console.error("Error fetching repo info:", error);
        }
      };
      fetchRepoInfo();
    }
  }, [localRepoInfo]);

  if (!localRepoInfo && !isSelectingDirectory) {
    return (
      <div>
        <LocalInfo localRepoInfo={localRepoInfo} />
        <button
          className="text-sm text-center w-full"
          onClick={handleSelectDirectory}
        >
          Select Directory
        </button>
      </div>
    );
  } else if (!localRepoInfo) {
    return <div>Selecting directory...</div>;
  }
  let storageService = new StorageService()
  storageService.setItem("repoDir", localRepoInfo.repoPath)
  storageService.setItem("repoName", localRepoInfo.repoName)
  storageService.setItem("githubURL", localRepoInfo.githubUrl)
  storageService.setItem("owner", localRepoInfo.ownerName)

  return <LocalInfo localRepoInfo={localRepoInfo} />;
};

export default LocalContent;
