import React, { useState, useEffect, useRef, useContext } from "react";
import { FileContext } from "../contexts/FileContext";
import { Button } from "@mui/material";

const uploadAudio = ({ history }) => {
  const inputFile = useRef(null);
  const { fileURL, setFileURL } = useContext(FileContext);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (file) {
      setFileURL(file);
      history.push("/edit");
    }
  }, [file, setFileURL, history]);

  const handleButtonClick = () => {
    inputFile.current.click();
  };

  const handleFileUpload = (e) => {
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <>
      <div className="upload-audio">
        <Button
          component="label"
          variant="contained"
          onClick={handleButtonClick}
        >
          Upload file
        </Button>
        <input
          type="file"
          id="file"
          ref={inputFile}
          style={{ display: "none" }}
          accept="audio/*"
          onChange={handleFileUpload}
        />
      </div>
    </>
  );
};

export default uploadAudio;
