import React, { useState, useEffect } from "react";
import PullRequestsContent from "./PullReqeuests";
import InfoContent from "./RepoInfo";
import LocalContent from "./LocalContent";
import TagsContent from "./TagsContent";
import IssuesContent from "./IssuesContent";
import RemoteContent from "./Remote";

function fetchData(name, reponame, owner) {
  switch (name.toLowerCase()) {
    case "remote":
      return <RemoteContent reponame={reponame} owner={owner} />;
    case "local":
      return <LocalContent reponame={reponame} />;
    case "info":
      return <InfoContent reponame={reponame} owner={owner} />;
    case "pull requests":
      return <PullRequestsContent reponame={reponame} owner={owner} />;
    case "issues":
      return <IssuesContent reponame={reponame} owner={owner} />;
    case "tags":
      return <TagsContent reponame={reponame} />;
    default:
      return null;
  }
}

export default function SectionContent(props) {
  return <div>{fetchData(props.name, props.reponame, props.owner)}</div>;
}
