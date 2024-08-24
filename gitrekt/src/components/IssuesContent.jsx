import React, { useState, useEffect } from "react";
import APIService from "./services/APIService";

const gitToken = "";
const cache = new Map();

const IssuesInfo = ({ issueInfo }) => {
  const filteredIssues = issueInfo.filter((issue) => !issue.pull_request);

  return (
    <div className="pl-4 pb-2">
      {filteredIssues.length > 0 ? (
        <ul className="space-y-2">
          {filteredIssues.map((issue) => (
            <li
              key={issue.id}
              className="border-gray-300 pb-2"
            >
              <div className="flex items-center justify-between">
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  #{issue.number}: {issue.title}
                </a>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded mr-4 ${
                    issue.state === "open"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {issue.state}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                Opened by {issue.user.login} on{" "}
                {new Date(issue.created_at).toLocaleDateString()}
              </p>
              {issue.labels.length > 0 && (
                <div className="pt-2">
                  {issue.labels.map((label) => (
                    <span
                      key={label.id}
                      className="px-2 py-1 text-xs font-semibold rounded"
                      style={{
                        backgroundColor: `#${label.color}`,
                        color: getContrastColor(label.color),
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No issues found for this repository.</p>
      )}
    </div>
  );
};

// Helper function to determine text color based on background color
const getContrastColor = (hexcolor) => {
  // If a leading # is provided, remove it
  if (hexcolor.slice(0, 1) === "#") {
    hexcolor = hexcolor.slice(1);
  }

  // Convert to RGB value
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);

  // Get YIQ ratio
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Check contrast
  return yiq >= 128 ? "black" : "white";
};

const IssuesContent = ({ reponame, owner }) => {
  const [issueInfo, setIssueInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `${owner}/${reponame}`;

      if (cache.has(cacheKey)) {
        setIssueInfo(cache.get(cacheKey));
        return;
      }
      try {
        let API = new APIService(owner, reponame, gitToken);
        let response = await API.getIssues();
        cache.set(cacheKey, response);
        console.log("using cached")
        setIssueInfo(response);
      } catch (err) {
        console.error("Error fetching issues:", err);
      }
    };

    fetchData();
  }, [reponame, owner]);

  if (!issueInfo) return <div>Loading...</div>;

  return <IssuesInfo issueInfo={issueInfo} />;
};

export default IssuesContent;
