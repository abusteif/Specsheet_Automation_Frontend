import React from "react";
import ReactDOM from "react-dom";
import TextArea from "../../theme/textArea";
import FormItem from "../../theme/formItem";
import LongFormItem from "../../theme/longFormItem";

const JiraDefectForm = ({ createDefect, resetCreationStatus }) => {
  return (
    <div className="jira-work-section-body">
      <div className="jira-work-section-options-section">
        <FormItem style={{ height: "120px" }}>
          <span className="item-selection-headings">
            Copy and Paste the URL into the box below
          </span>
          <div style={{ width: "100%", height: "100%" }}>
            <TextArea
              disabled={false}
              onRead={resetCreationStatus}
              onBlur={(text) => {
                createDefect({}, text);
              }}
              resetValue={false}
            />
          </div>
        </FormItem>
      </div>
    </div>
  );
};

export default JiraDefectForm;
