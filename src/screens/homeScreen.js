import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { HiOutlineDocumentReport } from "react-icons/hi";
import { GiBulldozer } from "react-icons/gi";
import { SiJira } from "react-icons/si";

import AppHeader from "../components/appHeader";
import Screen from "./screenTemplate";
import Button from "../theme/button";

import { apiErrorMessage } from "../configs/staticData";
import "../styling/appBody.css";
import "../styling/commonStyles.css";

const HomeScreen = (props) => {
  return (
    <Screen
      subMessage={
        !props.common.status && apiErrorMessage + props.common.errorMessage
      }
    >
      <div className="home-screen-body">
        {
          // <Link
          //   to="/reporting"
          //   style={{ color: "inherit", textDecoration: "inherit" }}
          // >
          //   <Button className="home-screen-button">
          //     <HiOutlineDocumentReport size={50} />
          //     <div style={{ marginLeft: 20 }}> Reporting </div>
          //   </Button>
          // </Link>
        }

        <Link
          to="/jira"
          style={{ color: "inherit", textDecoration: "inherit" }}
        >
          <Button className="home-screen-button">
            <SiJira size={50} />
            <div style={{ marginLeft: 20 }}> Jira </div>
          </Button>
        </Link>
        <Link
          to="/automation"
          style={{ color: "inherit", textDecoration: "inherit" }}
        >
          <Button className="home-screen-button">
            <GiBulldozer size={50} />
            <div style={{ marginLeft: 20 }}> Automation </div>
          </Button>
        </Link>
      </div>
    </Screen>
  );
};
const mapStateToProps = (state) => {
  return {
    common: state.common,
  };
};
export default connect(mapStateToProps, {})(HomeScreen);
