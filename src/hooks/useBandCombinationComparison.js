import { errorMessagem, spinner } from "../helpers/table";

var _ = require("lodash");

const errorMessage = (retryFunction) => (
  <div
    style={{ fontSize: "13px", color: "blue", cursor: "pointer" }}
    onClick={retryFunction}
  >
    {`Error occurred while getting results from Jira. Click Here to try again`}
  </div>
);

const resultsNotUploadedMessage = "Results not uploaded to Jira";
export const useBandCombinationComparison = (
  mainInfo,
  secondaryInfo,
  mainError,
  mainRetry,
  secondaryError,
  secondaryRetry,
  mainData,
  secondaryData,
  columns,
  secondaryRATSIM
) => {
  const makeCustomResult = (customResult) => {
    let result = {};
    columns.forEach((item, i) => {
      result[item.accessor] = customResult;
    });
    return [result];
  };
  const replaceMissingCarriers = (arrayToFix) => {
    return arrayToFix.map((bandComb) => {
      if(!bandComb.ulBands[0]){
        return {...bandComb, ulBands: ["None"]}
      } else {
        return bandComb
      }
    })
  }
  const sortArray = (arrayToSort) => {
    let sortedBandCOmbinations = arrayToSort.map((bandComb) => {
      return {
        ...bandComb,
        dlBands: _.sortBy(bandComb.dlBands, [
          (element) => {
            return parseInt(element.slice(0, element.length - 1));
          },
          (element) => {
            return parseInt(element[element.length - 1]);
          },
        ]),
      };
    });
    return _.sortBy(sortedBandCOmbinations, [
      (element) => {
        return element.dlCarriers;
      },
      (element) => {
        if(!element.ulBands[0]) return []
        return parseInt(
          element.ulBands[0].slice(0, element.ulBands[0].length - 1)
        );
      },
      (element) => {
        if(!element.ulBands[0]) return []
        return element.ulBands[0][element.ulBands[0].length - 1];
      },
      (element) => {
        return element.dlLayers;
      },
    ]);
  };

  const makeResult = (dataSource, statusMessage) => {
    let result = [];
    let newBandCombItem;
    let dlBands;
    let ulBands;
    let newItem = {};

    let sortedArray = sortArray(dataSource);
    sortedArray.forEach((bandCombItem, bandCombItemIndex) => {
      newBandCombItem = {};
      newItem = {};
      dlBands = bandCombItem.dlBands.join("-");
      ulBands = bandCombItem.ulBands.join("-");
      newBandCombItem = { ...bandCombItem, dlBands, ulBands };
      columns.forEach((columnItem, columnItemIndex) => {
        newItem[columnItem.accessor] = newBandCombItem[columnItem.accessor];
      });
      if (statusMessage) {
        newItem["status"] = statusMessage;
      }

      result.push(newItem);
    });
    return result;
  };
  const prepareData = () => {
    let statusMessage = "";
    let summary = { missingFromDut: 0, missingFromRef: 0, bcs: 0 };
    if (!mainData && !mainError) {
      return { result: makeCustomResult("Loading DUT results") };
    }
    if (!mainData && mainError) {
      return { result: makeCustomResult(errorMessage(mainRetry)) };
    }
    if (mainData && !mainError && Object.keys(mainData).length === 0)
      return {
        result: makeCustomResult(
          "Either device does not support Band Combinations or results of \
        selected reference device and IOT cycle were not uploaded to Jira"
        ),
      };
    if (mainData) {
      mainData = replaceMissingCarriers([...mainData])
      if (
        !secondaryData &&
        !secondaryError &&
        // Object.keys(secondaryInfo.iotCycle).length !== 0
        secondaryRATSIM
      ) {
        statusMessage = "Loading reference device's data";
      }
      if (
        !secondaryData &&
        !secondaryError &&
        !secondaryRATSIM
      ) {
        statusMessage = "Select reference device to compare";
      }
      if (
        !secondaryData &&
        secondaryError &&
        secondaryRATSIM
        // Object.keys(secondaryInfo.iotCycle).length !== 0
      ) {
        statusMessage = errorMessage(secondaryRetry);
      }
      if (
        secondaryData &&
        !secondaryError &&
        Object.keys(secondaryData).length === 0
      ) {
        statusMessage = "Ref doesn't support CA or results not uploaded";
      }
    }
    if (
      secondaryData &&
      !secondaryError &&
      Object.keys(secondaryData).length !== 0
    ) {
      secondaryData = replaceMissingCarriers([...secondaryData])

      summary = {
        ...summary,
        dut: {
          device: mainInfo.device.name,
          iotCycle: mainInfo.iotCycle.name,
        },
        ref: {
          device: secondaryInfo.device.name,
          iotCycle: secondaryInfo.iotCycle.name,
        },
      };

      var BreakException = {};

      let mainResult = sortArray(mainData);
      let secondaryResult = sortArray(secondaryData);
      let fullResult = [];
      let status;
      let found = false;
      mainResult.forEach((mainResultItem, mainResultIndex) => {
        status = "";
        found = false;
        secondaryResult.forEach((secondaryResultItem, secondaryResultIndex) => {
          try {
            if (
              JSON.stringify(mainResultItem.dlBands) ===
                JSON.stringify(secondaryResultItem.dlBands) &&
              JSON.stringify(mainResultItem.ulBands) ===
                JSON.stringify(secondaryResultItem.ulBands)
            ) {
              found = true;
              if (mainResultItem.bcs === secondaryResultItem.bcs) {
                status = "Unchanged";
              } else {
                mainResultItem.bcs = (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>{`DUT: ${mainResultItem.bcs}`}</span>
                    <span>{`REF: ${secondaryResultItem.bcs}`}</span>
                  </div>
                );
                status = "BCS Changed";
                summary.bcs++;
              }
              secondaryResult.splice(secondaryResultIndex, 1);
              throw BreakException;
            }
          } catch (e) {
            if (e !== BreakException) throw e;
          }
        });
        if (!found) {
          // status = `Missing from ${secondaryInfo.device.name} - ${secondaryInfo.iotCycle.name}`;
          status = "Missing from reference device";
          summary.missingFromDut++;
        }

        fullResult.push({ ...mainResultItem, status });
      });
      summary.missingFromRef = secondaryResult.length;

      secondaryResult.forEach((item, i) => {
        // item.status = `Missing from ${mainInfo.device.name} - ${mainInfo.iotCycle.name}`;
        item.status = "Missing from DUT";
      });

      mainData = [...fullResult, ...secondaryResult];
    }

    let result = makeResult(mainData, statusMessage);
    return { result, summary };
  };
  return [prepareData];
};
