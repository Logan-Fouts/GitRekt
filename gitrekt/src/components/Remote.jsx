import React, { useState, useEffect } from "react";
import APIService from "./services/APIService";
import LoadingIcon from "./LoadingIcon";

const cache = new Map();

const RemoteInfo = ({ remoteInfo }) => {
  return (
    <div className="pl-4">
      {remoteInfo && remoteInfo.length > 0 ? (
        <ul>
          {remoteInfo.map((branch, index) => (
            <li
              key={index}
              className="flex items-center space-x-2 py-2 border-gray-200"
            >
              <svg
                className="w-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                ></path>
              </svg>
              <span className="text-gray-300 text-sm">{branch.name}</span>
              {branch.isDefault && (
                <span className="bg-blue-100 text-krakblue text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                  Default
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No branch information available.</p>
      )}
    </div>
  );
};

const RemoteContent = ({ reponame, owner }) => {
  console.log(owner)
  const [remoteInfo, setRemoteInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `${owner}/${reponame}`;

      if (cache.has(cacheKey)) {
        setRemoteInfo(cache.get(cacheKey));
        return;
      }
      try {
        let API = new APIService(owner, reponame);
        let response = await API.getBranches();
        cache.set(cacheKey, response);
        setRemoteInfo(response);
      } catch (err) {
        console.error("Error fetching pull requests:", err);
      }
    };

    fetchData();
  }, [reponame, owner]);

  if (!remoteInfo) return <LoadingIcon />;

  return <RemoteInfo remoteInfo={remoteInfo} />;
};

export default RemoteContent;
