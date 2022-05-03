import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import AppHeader from "../components/appHeader";

import "../styling/appBody.css";
import "../styling/commonStyles.css";

const Screen = ({
  subMessage,
  login,
  logout,
  children,
  style,
  loadingOverlayActive,
  spinnerText,
}) => {
  const [loadingStatus, setLoadingStatus] = useState(loadingOverlayActive);

  useEffect(() => {
    setLoadingStatus(loadingOverlayActive);
  }, [loadingOverlayActive]);

  return (
    <LoadingOverlay
      active={loadingStatus}
      spinner
      className="loading-overlay-main"
      text={spinnerText}
    >
      <div className="page">
        <AppHeader subMessage={subMessage} login={login} logout={logout} />
        <div className="body-main" style={{ ...style }}>
          {children}
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default Screen;
