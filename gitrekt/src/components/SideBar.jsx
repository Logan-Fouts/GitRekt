/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import SectionContent from "./SectionContent";

const ListItem = (props) => {
  const [isActive, setActive] = useState(false);

  function toggleActive() {
    setActive(!isActive);
  }

  return (
    <>
      <li
        className="flex border-t border-t-slate-300 items-center w-full p-2 text-sm"
        onClick={toggleActive}
      >
        <img
          src={props.imgsrc}
          className="w-4 h-4 mr-2"
          alt={props.name + " icon"}
        />
        <p className="flex-grow text-start text-slate-300">{props.name}</p>
        {isActive ? (
          <img
            src="icons/arrow.png"
            className="w-2 h-2 ml-auto"
            alt="Expand arrow"
          />
        ) : (
          <img
            src="icons/right-arrow.png"
            className="w-2 h-2 ml-auto"
            alt="Expand arrow"
          />
        )}
      </li>
      {isActive ? (
        <div>
          <SectionContent
            name={props.name}
            reponame={props.reponame}
            owner={props.owner}
          />
        </div>
      ) : null}
    </>
  );
};

export default function SideBar(props) {
  const Sections = [
    { name: "Info", imgsrc: "icons/info.png" },
    { name: "Local", imgsrc: "icons/monitor.png" },
    { name: "Remote", imgsrc: "icons/cloud.png" },
    { name: "Pull Requests", imgsrc: "icons/pull-request.png" },
    { name: "Issues", imgsrc: "icons/issues.png" },
    { name: "Tags", imgsrc: "icons/tags.png" },
  ];
  return (
    <div className="flex flex-col bg-kraklgrey w-2/12 h-screen">
      <a className="p-2 text-3xl font-bold">{props.reponame}</a>
      <ul className="flex flex-col w-full h-full mt-2">
        {Sections.map((section, index) => (
          <ListItem
            key={index}
            name={section.name}
            imgsrc={section.imgsrc}
            reponame={props.reponame}
            owner={props.owner}
          />
        ))}
      </ul>
      <p className="p-2">By: Logan Fouts</p>
    </div>
  );
}
