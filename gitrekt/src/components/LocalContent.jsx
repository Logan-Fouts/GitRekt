'use client'

import React, { useState, useEffect } from "react";
import APIService from "./services/APIService";

const cache = new Map();

const LocalInfo = ({ owner, repoInfo, directoryPath }) => {
  return <div>{directoryPath}</div>;
};

const LocalContent = ({ reponame, owner }) => {
  const [directoryPath, setDirectoryPath] = useState(null);
  const [repoInfo, setRepoInfo] = useState(null);
  const [isSelectingDirectory, setIsSelectingDirectory] = useState(false);

  const handleSelectDirectory = () => {
    setIsSelectingDirectory(true);
    window.electronAPI.selectDirectory()
      .then((path) => {
        if (path) {
          setDirectoryPath(path);
        }
        setIsSelectingDirectory(false);
      })
      .catch((error) => {
        console.error('Error selecting directory:', error);
        setIsSelectingDirectory(false);
      });
  };

  useEffect(() => {
    if (directoryPath) {
      const fetchRepoInfo = async () => {
        try {
          let info;
          if (cache.has(reponame)) {
            info = cache.get(reponame);
          } else {
            // info = await APIService.getRepoInfo(owner, reponame);
            cache.set(reponame, info);
          }
          setRepoInfo(info);
        } catch (error) {
          console.error('Error fetching repo info:', error);
        }
      };
      fetchRepoInfo();
    }
  }, [directoryPath, reponame, owner]);

  if (!directoryPath && !isSelectingDirectory) {
    return <button onClick={handleSelectDirectory}>Select Directory</button>;
  }

  if (isSelectingDirectory) {
    return <div>Selecting directory...</div>;
  }

  return <LocalInfo owner={owner} repoInfo={repoInfo} directoryPath={directoryPath}/>;
};

export default LocalContent;