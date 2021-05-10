import { errorMessage, spinner } from "../helpers/table";
import Spinner from "react-bootstrap/Spinner";

const resultsNotUploadedMessage = "Results not uploaded to Jira";
export const useComparison = (
  mainInfo,
  secondaryInfo,
  mainError,
  mainRetry,
  secondaryError,
  secondaryRetry,
  fields,
  mainData,
  secondaryData,
  secondaryRATSIM
) => {
  const prepareData = () => {
    let sortedMain;
    let sortedSecondary;
    let result = [];
    let areDifferent;
    let main;
    let secondary;
    let newItem = {};
    let summary = {};

    if (fields.length === 0) return { result: [] };
    fields[0].fields.forEach((dataField, dataFieldIndex) => {
      newItem = {};
      newItem.headerColumn = dataField;
      areDifferent = false;
      sortedMain = null;
      sortedSecondary = null;

      if (!mainData && !mainError) newItem.mainData = spinner;
      if (!mainData && mainError) newItem.mainData = errorMessage(mainRetry);
      if (mainData && !mainError) {
        newItem.mainData = mainData[dataField];
        main = true;
      }
      if (mainData && !mainError && Object.keys(mainData).length === 0)
        newItem.mainData = resultsNotUploadedMessage;

      if (
        !secondaryData &&
        !secondaryError &&
        secondaryRATSIM
        // Object.keys(secondaryInfo.iotCycle).length !== 0
      )
        newItem.secondaryData = spinner;
      if (
        !secondaryData &&
        secondaryError &&
        secondaryRATSIM
        // Object.keys(secondaryInfo.iotCycle).length !== 0
      )
        newItem.secondaryData = errorMessage(secondaryRetry);
      if (
        secondaryData &&
        !secondaryError &&
        Object.keys(secondaryData).length !== 0
      ) {
        newItem.secondaryData = secondaryData[dataField];
        secondary = true;
      }
      if (
        secondaryData &&
        !secondaryError &&
        Object.keys(secondaryData).length === 0
      )
        newItem.secondaryData = resultsNotUploadedMessage;

      if (main) {
        if (Array.isArray(newItem.mainData)) {
          if (secondary && Array.isArray(newItem.secondaryData)) {
            sortedMain = [...newItem.mainData.sort()];
            sortedSecondary = [...newItem.secondaryData.sort()];
            areDifferent =
              JSON.stringify(sortedMain) !== JSON.stringify(sortedSecondary);

            newItem.secondaryData = newItem.secondaryData.join(", ");
          }
          newItem.mainData = newItem.mainData.join(", ");
        } else {
          if (secondary) {
            areDifferent = newItem.mainData !== newItem.secondaryData;
          }
        }
      }
      result.push({
        ...newItem,
        mainData: areDifferent ? (
          <span style={{ color: "red" }}> {newItem.mainData}</span>
        ) : (
          <span> {newItem.mainData}</span>
        ),
        changedUnchanged: areDifferent ? "Changed" : "Unchanged",
      });
    });
    return { result, summary };
  };
  return [prepareData];
};
