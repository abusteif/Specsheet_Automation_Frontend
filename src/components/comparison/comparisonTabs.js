import React from "react";
import ReactDOM from "react-dom";

import TabView from "../../theme/tabView";
import IndividualIETab from "./individualIETab";
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
      title: "Individual IE",
      content: (
        <IndividualIETab
          mainInfo={mainInfo}
          secondaryInfo={secondaryInfo}
          mainError={mainError}
          mainRetry={mainRetry}
          secondaryError={secondaryError}
          secondaryRetry={secondaryRetry}
          fields={fields}
          mainData={mainData ? mainData.individualIE : null}
          secondaryData={secondaryData ? secondaryData.individualIE : null}
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
