import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "../styling/theme/textArea.css";
const TextArea = ({
  placeholder,
  onRead,
  textProcessor,
  initialValue,
  disabled,
}) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (textProcessor) setValue(textProcessor(initialValue));
    else {
      setValue(initialValue);
    }
  }, [initialValue]);

  return (
    <textarea
      type="textarea"
      className="text-area"
      placeholder={placeholder}
      disabled={disabled}
      value={value}
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
