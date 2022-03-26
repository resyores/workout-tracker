import Modal from "../../../BaseComponents/Modal";
import Button from "react-bootstrap/esm/Button";
import React, { useState, useEffect } from "react";
export default function InputVideo({ isOpen, setIsOpen, upload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [FileUrl, setFileUrl] = useState("");
  useEffect(() => {
    setFileUrl("");
    setSelectedFile(null);
  }, [isOpen]);
  useEffect(() => {
    if (selectedFile) {
      setFileUrl(URL.createObjectURL(selectedFile));
    }
  }, [selectedFile]);
  console.log(FileUrl);
  return (
    <Modal open={isOpen} width={25}>
      <div>
        <span className="d-flex justify-content-center mb-2">
          {FileUrl && (
            <video
              width="270"
              height="180"
              controls
              className="rounded"
              src={FileUrl}
            />
          )}
        </span>

        <input
          type="file"
          accept="video/*"
          className="w-100"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <Button onClick={() => setIsOpen(false)} className="btn-danger me-4">
          Close
        </Button>

        <Button className="btn-success" onClick={() => upload(selectedFile)}>
          Upload
        </Button>
      </div>
    </Modal>
  );
}
