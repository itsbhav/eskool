import React from "react";
import useTitle from "../hooks/useTitle";

const DataNotFound = () => {
  useTitle("404 Not Found");
  return (
    <h1 className="errmsg public">
      The resource you are looking for does not exist!!
    </h1>
  );
};

export default DataNotFound;
