import React, { useState, useEffect } from "react";
import APIService from './services/APIService';

const gitToken = ''

const LocalContent = ({ reponame, owner }) => {
  const [repoInfo, setRepoInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let API = new APIService(owner, reponame, gitToken);
        console.log(gitToken)
        let response = await API.getGeneralRepoInfo();
        setRepoInfo(response);
        // console.log(response);
      } catch (err) {
        console.error('Error fetching repo info:', err);
        setError(err.message);
      }
    };

    fetchData();
  }, [reponame, owner]);

  if (error) return <div>Error: {error}</div>;
  if (!repoInfo) return <div>Loading...</div>;

  return (
    <div>
      <h2>Local: {reponame}</h2>
      <p>Owner: {owner}</p>
      <p>Description: {repoInfo.description}</p>
      <p>Stars: {repoInfo.stargazers_count}</p>
    </div>
  );
};

const RemoteContent = ({ reponame }) => {
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
      return <LocalContent reponame={reponame} owner={owner} />;
    case "remote":
      return <RemoteContent reponame={reponame} />;
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
  return <div>{fetchData(props.name, props.reponame, props.owner)} Content</div>;
}
