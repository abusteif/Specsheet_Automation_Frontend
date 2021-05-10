import React from "react";
import ReactDOM from "react-dom";

import SideMenu from "../../theme/sideMenu";
import "../../styling/automationScreen.css";

const MessageTypeSection = (props) => {
  return (
    <div className="message-type-menu">
      <SideMenu
        itemList={props.itemList}
        onSelect={(selectedMessage) => {
          return selectedMessage.itemId !== "UECapabilityInfo"
            ? props.onSelect(selectedMessage)
            : null;
        }}
      />
    </div>
  );
};

export default MessageTypeSection;
