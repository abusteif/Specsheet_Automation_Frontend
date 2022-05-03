import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "../styling/theme/textArea.css";
const TextArea = ({
  placeholder,
  onRead,
  textProcessor,
  initialValue,
  disabled,
  maxLength,
  onBlur,
  resetValue,
  style,
}) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (textProcessor) setValue(textProcessor(initialValue));
    else {
      setValue(initialValue);
    }
  }, [initialValue]);
  useEffect(() => {
    if (resetValue) setValue("");
  }, [resetValue]);
  return (
    <textarea
      type="textarea"
      className="text-area"
      style={style}
      placeholder={placeholder}
      onBlur={(event) => {
        onBlur && onBlur(event.target.value);
      }}
      disabled={disabled}
      value={value}
      maxLength={maxLength}
      onChange={(event) => {
        let newText = event.target.value;
        if (textProcessor) {
          newText = textProcessor(newText);
        }
        setValue(newText);
        onRead && onRead(newText);
      }}
    />
  );
};

export default TextArea;
