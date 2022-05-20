import React, { useCallback, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDropzone } from "react-dropzone";

import "../styling/theme/fileDropZone.css";

const FileDropZone = (props) => {
  const [fileType, setFileType] = useState(props.requiredFileType);
  const [uploadStatus, setUploadStatus] = useState(props.uploadStatus);
  const [dropZoneText, setDropZoneText] = useState("");
  const [messageType, setMessageType] = useState(props.messageType);

  useEffect(() => {
    if (fileType !== props.requiredFileType) {
      setDropZoneText(
        `Incorrect file type. Only ${props.requiredFileType} files are allowed`
      );
    }
    if (uploadStatus === true) setDropZoneText("File uploaded successfully.");
    if (!props.uploadStatus) setDropZoneText("");
  }, [uploadStatus, fileType, props.uploadStatus]);

  useEffect(() => {
    setMessageType(props.messageType);
  }, [props.messageType]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (props.disabled) return;
      acceptedFiles.forEach((file) => {
        setFileType(file.type);
        setUploadStatus(false);
        if (file.type !== props.requiredFileType) return;
        const reader = new FileReader();
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          const binaryStr = reader.result;
          props.onRead(props.textProcessor(binaryStr));
        };
        setUploadStatus(true);
        reader.readAsBinaryString(file);
      });
    },
    [messageType]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={props.disabled ? "file-dropzone-disabled" : "file-dropzone"}
    >
      <input {...getInputProps()} />
      <p className="drop-zone-text">{props.placeholder}</p>
      <p
        className="drop-zone-upload-status"
        style={{ color: uploadStatus ? "green" : "red" }}
      >
        {dropZoneText}
      </p>
    </div>
  );
};

export default FileDropZone;
