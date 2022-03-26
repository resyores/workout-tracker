import Modal from "../BaseComponents/Modal";
import Button from "react-bootstrap/esm/Button";
import React, { useState, useEffect } from "react";
export default function ImageModal({
  isOpen,
  setIsOpen,
  CurrentFile,
  upload,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [FileUrl, setFileUrl] = useState(CurrentFile);
  useEffect(() => {
    setFileUrl(CurrentFile);
    setSelectedFile(null);
  }, [isOpen]);
  useEffect(() => {
    if (selectedFile) {
      setFileUrl(URL.createObjectURL(selectedFile));
      console.log(URL.createObjectURL(selectedFile));
    }
  }, [selectedFile]);

  return (
    <Modal open={isOpen} width={25}>
      <div>
        <span className="d-flex justify-content-center mb-2">
          <img width={180} height={180} src={FileUrl} className="rounded" />
        </span>

        <input
          type="file"
          accept="image/*"
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
