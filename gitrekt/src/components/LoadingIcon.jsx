import React from "react";

const LoadingIcon = () => {
  return (
    <div className="flex space-x-4 justify-center">
      <img
        src="icons/loading.png"
        alt="loading image"
        className="animate-spin"
      ></img>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingIcon;
