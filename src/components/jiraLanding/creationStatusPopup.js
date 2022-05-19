import React from "react";
import ReactDOM from "react-dom";
import KeyValueLine from "../../theme/keyValueLine";
import Button from "react-bootstrap/Button";

const CreationStatusPopup = ({
  status,
  color,
  title,
  lineItems,
  footerTextLink,
  footerTextNonLink,
  footerLink,
  onOk,
  okText,
  onCancel,
  cancelText,
}) => {
  return (
    <div className="main-popup-container">
      <span className="creation-status-popup-status" style={{ color }}>
        {status}
      </span>
      <span className="creation-status-popup-title">{title}</span>
      {lineItems?.map((lineItem) => {
        return (
          <KeyValueLine
            keyProp={lineItem.fieldName}
            valueProp={lineItem.fieldValue}
            keyColor={lineItem.keyColor}
            valueColor={lineItem.valueColor}
            key={lineItem.fieldName}
          />
        );
      })}
      <span className="creation-status-popup-footer">
        <a href={footerLink} rel="noreferrer" target="_blank">
          {footerTextLink}
        </a>
      </span>
      <span className="creation-status-popup-footer">{footerTextNonLink}</span>

      {onOk && (
        <div className="popup-buttons-container">
          <Button
            onClick={onOk}
            variant="primary"
            className="popup-button"
            size="lg"
          >
            {okText || "OK"}
          </Button>

          <Button
            onClick={onCancel}
            variant="danger"
            className="popup-button"
            size="lg"
          >
            {cancelText || "Cancel"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreationStatusPopup;
