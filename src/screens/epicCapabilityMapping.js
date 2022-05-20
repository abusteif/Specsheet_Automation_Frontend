import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import Screen from "./screenTemplate";
import FileDropZone from "../theme/fileDropZone";
import { CsvToHtmlTable } from "react-csv-to-table";
import Button from "react-bootstrap/Button";

import backend from "../apis/backend";
import { jiraProjectKey } from "../configs/staticData";
import { SUCCESS, ERROR, UNSTARTED, STARTED } from "../configs/configurations";

const EpicCapabilityMapping = (props) => {
  const [inputData, setInputData] = useState("");
  const [uploadStatus, setUploadStatus] = useState(UNSTARTED);
  const [headerLine, setHeaderLine] = useState([]);
  const [dataLines, setDataLines] = useState([]);
  const [uploadButtonStatus, setUploadButtonStatus] = useState(true);
  const [authToken, setAuthToken] = useState("");
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [usefulData, setUsefulData] = useState([]);

  useEffect(() => {
    // declare the async data fetching function
    const getToken = async () => {
      // get the data from the api
      const data = await backend(`/generateCookies`);
      setAuthToken(data.data.token);
    };
    if (!authToken) getToken();
  }, [authToken]);

  useEffect(() => {
    const upload = async () => {
      if (authToken && !uploadButtonStatus && usefulData.length !== 0) {
        let status = UNSTARTED;
        try {
          let data = usefulData[currentUploadIndex];
          let body = {
            epic: data.epic,
            capability: data.capability,
            projectId: 52075,
          };

          const result = await backend.post("epicCapabilityMapping", body, {
            headers: {
              Authorization: authToken,
            },
          });

          status = SUCCESS;
        } catch (e) {
          if (e.response) console.log(e.response);
          status = ERROR;
        } finally {
          if (currentUploadIndex === usefulData.length) return;
          let newUsefulData = [...usefulData];
          newUsefulData[currentUploadIndex] = {
            ...newUsefulData[currentUploadIndex],
            status,
          };

          let newDataLines = [...dataLines];
          newDataLines[currentUploadIndex] = {
            ...newDataLines[currentUploadIndex],
            status,
          };

          setUsefulData(newUsefulData);
          setDataLines(newDataLines);
          setCurrentUploadIndex(currentUploadIndex + 1);
        }
      }
    };

    console.log(usefulData);

    upload();
  }, [authToken, uploadButtonStatus, currentUploadIndex]);

  const getDataReady = (data) => {
    let lines = data.split("\n");
    let localHeaderLine = [...lines[0].split(","), "Status"];
    let epicIndex = localHeaderLine.indexOf("epic");
    let capabilityIndex = localHeaderLine.indexOf("capability");
    let localDataLines = lines.slice(1);

    if (epicIndex === -1 || capabilityIndex === -1) {
      alert("Epic or Capability missing");
    }

    setHeaderLine([...localHeaderLine]);
    let localUsefulData = [];
    localDataLines.forEach((item, i) => {
      localDataLines[i] = {
        data: item.split(","),
        status: UNSTARTED,
        id: i,
      };
      localUsefulData = [
        ...localUsefulData,
        {
          epic: item.split(",")[epicIndex],
          capability: item.split(",")[capabilityIndex],
          // data: item.split(","),
          status: UNSTARTED,
          id: i,
        },
      ];
    });
    console.log(localUsefulData);
    if (!localUsefulData[localUsefulData.length - 1].epic)
      localUsefulData = localUsefulData.slice(0, -1);
    localDataLines = localDataLines.slice(0, -1);
    setDataLines([...localDataLines]);
    setUsefulData([...localUsefulData]);
  };

  const tableHeader = (data) => {
    return (
      <thead>
        <tr>
          {data.map((item) => {
            return <th key={item.trim()}>{item.trim()}</th>;
          })}
        </tr>
      </thead>
    );
  };

  const bodyRows = (data) => {
    return (
      <tbody>
        {data.map((oneRow) => {
          let rowCells = [...oneRow.data, oneRow.status];
          return (
            <tr key={oneRow.id}>
              {rowCells.map((cell, i) => {
                return <td key={i}>{cell.trim()}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    );
  };

  return (
    <Screen>
      <div className="upload-section-body">
        <FileDropZone
          placeholder={"Drop Epic to Capability Mapping csv file here."}
          textProcessor={(text) => {
            return text;
          }}
          disabled={false}
          requiredFileType="text/csv"
          uploadStatus={inputData}
          messageType="test"
          onRead={(text) => {
            setInputData(text);
            getDataReady(text);
            setCurrentUploadIndex(0);
            setUploadButtonStatus(true);
          }}
        />

        <ul style={{ marginTop: "20px" }}>
          <li>The file should have at least 2 columns</li>
          <li>
            One column should contain the Epic Jira ID (eg. WDAFY20-1122), and
            should have{" "}
            <span style={{ color: "red", fontWeight: "bold" }}>epic</span> as
            column name
          </li>
          <li>
            Second column should contain the Jira ID of the Capability that Epic
            is to be linked to and it should have{" "}
            <span style={{ color: "red", fontWeight: "bold" }}>capability</span>{" "}
            as column name
          </li>
        </ul>
        <Button
          variant="primary"
          height="50px"
          width="100px"
          key="a"
          disabled={(() => {
            return !uploadButtonStatus || !authToken || dataLines.length === 0;
          })()}
          onClick={() => {
            setUploadButtonStatus(false);
          }}
        >
          Upload
        </Button>
      </div>
      <div
        style={{
          width: "60%",
          marginRight: "10px",
          overflowY: "scroll",
          height: "800px",
        }}
      >
        <table>
          {tableHeader(headerLine)}
          {bodyRows(dataLines)}
        </table>
      </div>
    </Screen>
  );
};

export default EpicCapabilityMapping;
