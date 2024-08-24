import React, { useState, useEffect } from "react";
import APIService from "./services/APIService";

const gitToken = "";
const cache = new Map();

const RepoInfo = ({ owner, repoInfo }) => {
  return (
    <div className="pl-4 pt-2 pb-2">
      <div className="space-y-3">
        <p className="flex items-center text-gray-200">
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold mr-2">Owner:</span>
          {owner}
        </p>
        <p className="flex items-center text-gray-200">
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-semibold mr-2">Stars:</span>{" "}
          {repoInfo.stargazers_count}
        </p>
        <div className="flex items-start text-gray-200">
          <div className="flex flex-col">
            <span className="font-semibold mr-2">Description:</span>
            <span className="flex-1 font-sm">
              {repoInfo.description || "No description provided."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoContent = ({ reponame, owner }) => {
  const [repoInfo, setRepoInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `${owner}/${reponame}`;
      
      if (cache.has(cacheKey)) {
        setRepoInfo(cache.get(cacheKey));
        return;
      }
      try {
        let API = new APIService(owner, reponame, gitToken);
        console.log(gitToken);
        let response = await API.getGeneralRepoInfo();
        cache.set(cacheKey, response);
        setRepoInfo(response);
      } catch (err) {
        console.error("Error fetching repo info:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, [reponame, owner]);

  if (error) return <div>Error: {error}</div>;
  if (!repoInfo) return <div>Loading...</div>;

  return <RepoInfo owner={owner} repoInfo={repoInfo} />;
};

const LocalContent = ({ reponame }) => {
  return <div>Remote: {reponame}</div>;
};

const PullRequestsContent = ({ reponame }) => {
  return <div>PR&apos;s: {reponame}</div>;
};

const IssuesContent = ({ reponame }) => {
  return <div>Issues: {reponame}</div>;
};

const TagsContent = ({ reponame }) => {
  return <div>Tags: {reponame}</div>;
};

function fetchData(name, reponame, owner) {
  switch (name.toLowerCase()) {
    case "local":
      return <LocalContent reponame={reponame} />;
    case "info":
      return <InfoContent reponame={reponame} owner={owner} />;
    case "pull requests":
      return <PullRequestsContent reponame={reponame} />;
    case "issues":
      return <IssuesContent reponame={reponame} />;
    case "tags":
      return <TagsContent reponame={reponame} />;
    default:
      return null;
  }
}

export default function SectionContent(props) {
  return <div>{fetchData(props.name, props.reponame, props.owner)}</div>;
}
