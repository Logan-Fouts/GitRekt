"use client";
import React from "react";

// TODO: Make API calls and format data
const LocalContent = () => {
  return <div>Local</div>;
};

const RemoteContent = () => {
  return <div>Remote</div>;
};

const PullRequestsContent = () => {
  return <div>PR&apos;s</div>;
};

const IssuesContent = () => {
  return <div>Issues</div>;
};

const TagsContent = () => {
  return <div>Tags</div>;
};

function fetchData(name) {
  let content = null;
  switch (name.toLowerCase()) {
    case "local":
      content = <LocalContent />;
      break;
    case "remote":
      content = <RemoteContent />;
      break;
    case "pull requests":
      content = <PullRequestsContent />;
      break;
    case "issues":
      content = <IssuesContent />;
      break;
    case "tags":
      content = <TagsContent />;
      break;
  }
  return content;
}

export default function SectionContent(props) {
  return <div>{fetchData(props.name)} Content</div>;
}
