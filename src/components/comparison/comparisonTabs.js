import React from "react";
import ReactDOM from "react-dom";

import TabView from "../../theme/tabView";
import IndividualIETab from "./individualIETab";
import AttachRequestTab from "./attachRequestTab";
import BandCombinationsTab from "./bandCombinationsTab";

import "../../styling/comparisonScreen.css";

const ComparisonTabs = ({
  mainInfo,
  secondaryInfo,
  mainError,
  mainRetry,
  secondaryError,
  secondaryRetry,
  fields,
  mainData,
  secondaryData,
  mainRATSIM,
  secondaryRATSIM,
}) => {
  const tabs = [
    {
      name: "IndividualIE",
      title: "UECapabilityInformation",
      content: (
        <IndividualIETab
          mainInfo={mainInfo}
          secondaryInfo={secondaryInfo}
          mainError={mainError}
          mainRetry={mainRetry}
          secondaryError={secondaryError}
          secondaryRetry={secondaryRetry}
          fields={fields}
          mainData={
            mainData.uecapabilityInformation
              ? mainData.uecapabilityInformation.individualIE
              : null
          }
          secondaryData={
            secondaryData.uecapabilityInformation
              ? secondaryData.uecapabilityInformation.individualIE
              : null
          }
          mainRATSIM={mainRATSIM}
          secondaryRATSIM={secondaryRATSIM}
        />
      ),
    },
    {
      name: "bandCombinations",
      title: "Band Combinations",
      content: (
        <BandCombinationsTab
          mainInfo={mainInfo}
          secondaryInfo={secondaryInfo}
          mainError={mainError}
          mainRetry={mainRetry}
          secondaryError={secondaryError}
          secondaryRetry={secondaryRetry}
          mainData={
            mainData.uecapabilityInformation
              ? mainData.uecapabilityInformation.bandCombinations
              : null
          }
          secondaryData={
            secondaryData.uecapabilityInformation
              ? secondaryData.uecapabilityInformation.bandCombinations
              : null
          }
          secondaryRATSIM={secondaryRATSIM}
        />
      ),
    },
    {
      name: "attachRequest",
      title: "Attach Request",
      content: (
        <AttachRequestTab
          mainInfo={mainInfo}
          secondaryInfo={secondaryInfo}
          mainError={mainError}
          mainRetry={mainRetry}
          secondaryError={secondaryError}
          secondaryRetry={secondaryRetry}
          mainData={mainData ? mainData.bandCombinations : null}
          secondaryData={secondaryData ? secondaryData.bandCombinations : null}
          secondaryRATSIM={secondaryRATSIM}
        />
      ),
    },
  ];

  return (
    <div className="comparison-tabs-container">
      {<TabView tabs={tabs} onSelectTab={() => {}} />}
    </div>
  );
};

export default ComparisonTabs;
