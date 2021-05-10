import React, { useState } from "react";
import ReactDOM from "react-dom";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

const TabView = ({ tabs, activeTab, onSelectTab }) => {
  activeTab = activeTab || tabs[0].name;
  const [key, setKey] = useState(activeTab);

  return (
    <Tabs
      activeKey={key}
      onSelect={(k) => {
        setKey(k);
        onSelectTab();
      }}
    >
      {tabs.map((tab) => {
        return (
          <Tab
            className="comaprison-tabs"
            eventKey={tab.name}
            title={tab.title}
            key={tab.name}
          >
            {tab.content}
          </Tab>
        );
      })}
    </Tabs>
  );
};

export default TabView;
