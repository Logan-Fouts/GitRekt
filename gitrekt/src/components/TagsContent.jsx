import React, { useState, useEffect } from "react";
import APIService from "./services/APIService";
import LoadingIcon from "./LoadingIcon";

const cache = new Map();

const TagsInfo = ({ owner, tagsInfo }) => {
  return (
    <div className="pl-4">
      {tagsInfo && tagsInfo.length > 0 ? (
        <ul className="space-y-3">
          {tagsInfo.map((tag) => (
            <li key={tag.name} className="border-gray-200">
              <div className="flex items-center">
                <span className="text-sm font-semibold text-krakblue">
                  {tag.name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-300">No tags found for this repository.</p>
      )}
    </div>
  );
};

const TagsContent = ({ reponame, owner }) => {
  const [tagsInfo, setTagsInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `${owner}/${reponame}`;

      if (cache.has(cacheKey)) {
        setTagsInfo(cache.get(cacheKey));
        return;
      }
      try {
        let API = new APIService(owner, reponame);
        let response = await API.getTags();
        cache.set(cacheKey, response);
        setTagsInfo(response);
      } catch (err) {
        console.error("Error fetching repo info:", err);
      }
    };

    fetchData();
  }, [reponame, owner]);

  if (!tagsInfo) return <LoadingIcon />;

  return <TagsInfo owner={owner} tagsInfo={tagsInfo} />;
};

export default TagsContent;
