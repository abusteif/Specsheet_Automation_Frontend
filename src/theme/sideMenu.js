import React from "react";

import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import "../styling/theme/sideMenu.css";

const SideMenu = ({ itemList, onSelect }) => {
  return (
    <>
      <Navigation onSelect={onSelect} items={itemList} />
    </>
  );
};

export default SideMenu;
