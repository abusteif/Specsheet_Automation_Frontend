import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import DropdownMenu from "../theme/dropdownMenu";

const DeviceSelectionSection = ({
  disableAll,
  devices,
  deviceText,
  onSelectDevice,
  selectedDevice,
  iotCycles,
  iotCycleText,
  onSelectIotCycle,
  resetSelectedIotCycle,
  selectedIotCycle,
  allRatSIMItems,
  messageTypeText,
  onSelectMessagetType,
  selectedRATSIM,
  messageTypeDisabled,
  iotCycleMenuDisabled,
  deviceMenuDisabled,
  resetRATSIM,
  style,
}) => {
  const [resetValue, setResetValue] = useState(false);
  return (
    <div className="device-selection-section border-shadow-right" style={style}>
      <span className="device-selection-headings">{deviceText}</span>
      <DropdownMenu
        itemList={devices.map((device) => {
          return { name: device.name, value: device.id };
        })}
        onSelect={(id) => {
          onSelectDevice(id);
          setResetValue(true);
        }}
        placeholder="Device"
        disabled={devices.length === 0 || deviceMenuDisabled || disableAll}
        initialValue={selectedDevice.id}
      />

      <span className="device-selection-headings">{iotCycleText}</span>
      <DropdownMenu
        itemList={iotCycles.map((iotCycle) => {
          return { name: iotCycle.name, value: iotCycle.id };
        })}
        onSelect={(id) => {
          onSelectIotCycle(id);
          setResetValue(false);
        }}
        placeholder="IOT Cycle"
        resetValue={resetSelectedIotCycle}
        disabled={iotCycles.length === 0 || iotCycleMenuDisabled || disableAll}
        resetValue={resetValue}
        initialValue={selectedIotCycle.id}
      />
      <span className="device-selection-headings">{messageTypeText}</span>
      <DropdownMenu
        itemList={
          //   messageTypeItems.map((messageType) => {
          //   return { name: messageType.name, value: messageType.name };
          // })
          allRatSIMItems
        }
        onSelect={onSelectMessagetType}
        placeholder="RAT and SIM"
        disabled={
          Object.keys(selectedIotCycle).length === 0 ||
          messageTypeDisabled ||
          disableAll
        }
        initialValue={selectedRATSIM}
        resetValue={resetRATSIM}
      />
    </div>
  );
};
export default DeviceSelectionSection;
