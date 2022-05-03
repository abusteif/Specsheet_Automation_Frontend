import React from "react";
import ReactDOM from "react-dom";
import ButtonsSection from "../buttonsSection";

import "../../styling/jiraLanding.css";
import "../../styling/commonStyles.css";

const JiraOperationsTab = ({ selectedOperation, selectOperation }) => {
  const getButtonVariant = (button) => {
    if (selectedOperation == "") {
      return "primary";
    } else {
      return button == selectedOperation ? "primary" : "secondary";
    }
  };

  const handleOnClick = (button) => {
    selectOperation(button);
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
