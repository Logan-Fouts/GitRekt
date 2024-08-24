import React, { useState, useEffect } from "react";
import APIService from "./services/APIService";
import LoadingIcon from "./LoadingIcon";

const cache = new Map();

const PullRequestsContent = ({ reponame, owner }) => {
  const [prInfo, setPRInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `${owner}/${reponame}`;

      if (cache.has(cacheKey)) {
        setPRInfo(cache.get(cacheKey));
        return;
      }
      try {
        let API = new APIService(owner, reponame);
        let response = await API.getPullRequests();
        cache.set(cacheKey, response);
        setPRInfo(response);
      } catch (err) {
        console.error("Error fetching pull requests:", err);
      }
    };

    fetchData();
  }, [reponame, owner]);

  if (!prInfo) return <LoadingIcon />;

  return <PullRequests pullrequests={prInfo} />;
};

const PullRequests = ({ pullrequests }) => {
  return (
    <div className="pb-2">
      {pullrequests.length === 0 ? (
        <p className="text-gray-300">No open pull requests found.</p>
      ) : (
        <ul className="space-y-2">
          {pullrequests.map((pr) => (
            <li key={pr.id} className="pl-4">
              <a
                href={pr.html_url}
                target="_blank"
                rel="noopener noreferrer"
                  className="text-krakblue hover:underline text-sm"
              >
                #{pr.number}: {pr.title}
              </a>
              <p className="text-xs text-gray-300">
                Opened by {pr.user.login} on{" "}
                {new Date(pr.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {pr.body
                  ? pr.body.slice(0, 100) + (pr.body.length > 100 ? "..." : "")
                  : null}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PullRequestsContent;
