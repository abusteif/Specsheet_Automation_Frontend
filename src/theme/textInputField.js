import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const TextInputField = ({
  placeholder,
  onRead,
  textProcessor,
  initialValue,
  disabled,
  onBlur,
  onKeyPress,
  className,
  readOnly,
}) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (textProcessor) setValue(textProcessor(initialValue));
    else {
      setValue(initialValue);
    }
  }, [initialValue]);
  return (
    <div>
      <input
        onKeyPress={(e) => {
          onKeyPress && onKeyPress(e, value);
        }}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onBlur={(e) => {
          onBlur && onBlur(e.target.value);
        }}
        onChange={(e) => {
          let newText = e.target.value;
          if (textProcessor) {
            newText = textProcessor(newText);
          }
          setValue(newText);
          onRead && onRead(newText);
        }}
        readOnly={readOnly}
      />
    </div>
  );
};

export default TextInputField;
