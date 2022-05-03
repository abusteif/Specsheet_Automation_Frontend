import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ButtonsSection from "../buttonsSection";
import { confirmAlert } from "react-confirm-alert";
import Popup from "../../theme/popup";

import "../../styling/jiraLanding.css";
import "../../styling/commonStyles.css";
const JiraAssetsTab = ({
  selectedOperation,
  selectAsset,
  selectedAsset,
  modified,
  resetAll,
}) => {
  const [buttonClicked, setButtonClicked] = useState(selectedAsset);

  useEffect(() => {
    setButtonClicked(selectedAsset);
  }, [selectedAsset]);

  useEffect(() => {
    if (modified) {
      if (buttonClicked) {
        if (buttonClicked !== selectedAsset) {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <Popup
                  title="You have unsaved data!"
                  message1="Your data will be lost if you navigate away from this page. Are you sure you want to continue?"
                  onOk={() => {
                    selectAsset(buttonClicked);
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
      selectAsset(buttonClicked);
    }
  }, [buttonClicked]);
  const getButtonVariant = (button) => {
    if (selectedAsset == "") {
      return "primary";
    } else {
      return button == selectedAsset ? "primary" : "secondary";
    }
  };

  const handleOnClick = (button) => {
    setButtonClicked(button);
  };

  return selectedOperation ? (
    <div className="jira-options-section border-shadow-right">
      <span className="jira-options-headings">Choose Target</span>

      <ButtonsSection
        sectionClassName="jira-options-button-container"
        buttons={[
          {
            variant: getButtonVariant("Device"),
            className: "jira-options-button",
            size: "sm",
            disabled: false,
            key: "Device",
            onClick: () => {
              setButtonClicked("Device");
            },
            label: "Device",
          },
          {
            variant: getButtonVariant("Release"),
            className: "jira-options-button",
            size: "sm",
            disabled: false,
            key: "Release",
            onClick: () => {
              handleOnClick("Release");
            },
            label: "Release",
          },
          {
            variant: getButtonVariant("IOT Cycle"),
            className: "jira-options-button",
            size: "sm",
            disabled: true,
            key: "IOT Cycle",
            onClick: () => {
              handleOnClick("IOT Cycle");
            },
            label: "IOT Cycle",
          },
        ]}
      />
    </div>
  ) : (
    <div />
  );
};

export default JiraAssetsTab;
