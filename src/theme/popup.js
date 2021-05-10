import React from "react";
import ReactDOM from "react-dom";

import Button from "react-bootstrap/Button";
import "../styling/theme/popup.css";

import "bootstrap/dist/css/bootstrap.min.css";

const Popup = ({ onOk, onCancel, title, message1, message2 }) => {
  return (
    <div className="main-popup-container">
      <h2 className="popup-header">{title}</h2>
      <p className="popup-message">{message1}</p>
      <p className="popup-message">{message2}</p>

      <div className="popup-buttons-container">
        <Button
          onClick={onOk}
          variant="primary"
          className="popup-button"
          size="lg"
        >
          OK
        </Button>
        <Button
          onClick={onCancel}
          variant="danger"
          className="popup-button"
          size="lg"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
export default Popup;
