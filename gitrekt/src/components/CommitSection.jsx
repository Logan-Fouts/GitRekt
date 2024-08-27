import React from "react";
import GitStatus from "@/components/GitStatus";
import Commiter from "./Commiter";

export default function CommitSection({ repoPath }) {
  return (
    <div className="w-5/12 bg-kraklgrey flex flex-col items-center justify-between min-w-[150px] max-w-[600px]">
      <GitStatus repoPath={repoPath}/>
      <div className='pl-4 pr-4 w-full'>
        <Commiter />
      </div>
    </div>
  );
}
