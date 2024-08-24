import React from "react";

const Button = ({ label, onClick, imgsrc }) => (
  <div className="flex flex-col items-center">
    <button
      onClick={onClick}
      className="px-4 py-2 text-gray-200 text-sm font-light hover:bg-gray-600 transition-colors duration-200 flex flex-col items-center"
    >
      <span>{label}</span>
      <img src={imgsrc} alt="action button" className="w-5 h-5 object-contain mb-1 mt-1" />
    </button>
  </div>
);

export default function TopBar({ reponame }) {
  return (
    <div className="pl-2 bg-kraktopgrey flex items-center">
      <div className="text-gray-200 font-semibold text-2xl w-1/4">
        {reponame}
      </div>
      <div className="flex-grow flex justify-center space-x-4">
        <Button label="Pull" imgsrc="icons/pull.png" />
        <Button label="Push" imgsrc="icons/push.png" />
      </div>
      <div className="w-1/4"></div>
    </div>
  );
}
