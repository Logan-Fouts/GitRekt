import React from "react";
import GitStatus from "@/components/GitStatus";
import Commiter from "./Commiter";

export default function CommitSection({ repoPath }) {
  return (
    <div className="w-4/12 bg-kraklgrey flex flex-col items-center justify-between">
      <GitStatus repoPath={repoPath}/>
      <Commiter />
    </div>
  );
}
