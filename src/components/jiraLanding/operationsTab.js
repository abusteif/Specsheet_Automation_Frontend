import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ButtonsSection from "../buttonsSection";
import { confirmAlert } from "react-confirm-alert";
import Popup from "../../theme/popup";

import "../../styling/jiraLanding.css";
import "../../styling/commonStyles.css";

const JiraOperationsTab = ({
  selectedOperation,
  selectOperation,
  modified,
  resetAll,
}) => {
  const [buttonClicked, setButtonClicked] = useState(selectedOperation);

  useEffect(() => {
    setButtonClicked(selectedOperation);
  }, [selectedOperation]);

  useEffect(() => {
    if (modified) {
      if (buttonClicked) {
        if (buttonClicked !== selectedOperation) {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <Popup
                  title="You have unsaved data!"
                  message1="Your data will be lost if you navigate away from this page. Are you sure you want to continue?"
                  onOk={() => {
                    selectOperation(buttonClicked);
                    resetAll();
                    onClose();
                  }}
                  onCancel={() => {
                    setButtonClicked("");
                    onClose();
                  }}
                />
              );
            },
            closeOnEscape: true,
          });
        }
      }
    } else {
      selectOperation(buttonClicked);
    }
  }, [buttonClicked]);

  const getButtonVariant = (button) => {
    if (selectedOperation == "") {
      return "primary";
    } else {
      return button == selectedOperation ? "primary" : "secondary";
    }
  };

  const handleOnClick = (button) => {
    setButtonClicked(button);
  };

  return (
    <div className="jira-options-section border-shadow-right">
      <span className="jira-options-headings">Choose Action</span>

      <ButtonsSection
        sectionClassName="jira-options-button-container"
        buttons={[
          {
            variant: getButtonVariant("Create"),
            className: "jira-options-button",
            size: "sm",
            disabled: false,
            key: "Create",
            onClick: () => {
              handleOnClick("Create");
            },
            label: "Create",
          },
          {
            variant: getButtonVariant("Modify"),
            className: "jira-options-button",
            size: "sm",
            disabled: true,
            key: "Modify",
            onClick: () => {
              handleOnClick("Modify");
            },
            label: "Modify",
          },
          {
            variant: getButtonVariant("Delete"),
            className: "jira-options-button",
            size: "sm",
            disabled: true,
            key: "Delete",
            onClick: () => {
              handleOnClick("Delete");
            },
            label: "Delete",
          },
        ]}
      />
    </div>
  );
};

export default JiraOperationsTab;
