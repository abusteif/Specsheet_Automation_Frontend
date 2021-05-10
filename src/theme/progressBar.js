import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import PB from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";

const ProgressBar = ({ now }) => {
  const [currentProgess, setCurrentProgress] = useState(now);
  useEffect(() => {
    setCurrentProgress(now);
  }, [now]);
  return <PB animated now={now} label={`${now}%`} />;
};

export default ProgressBar;
