import Modal from "../BaseComponents/Modal";
import Button from "react-bootstrap/esm/Button";
import React, { useState, useEffect } from "react";
import axios from "axios";
export default function ImageModal({ isOpen, setIsOpen, CurrentImage }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(CurrentImage);
  useEffect(() => {
    setImageUrl(CurrentImage);
    setSelectedFile(null);
  }, [isOpen]);
  useEffect(() => {
    if (selectedFile) setImageUrl(URL.createObjectURL(selectedFile));
  }, [selectedFile]);
  function upload(File) {
    const formData = new FormData();
    formData.append("ProfilePicture", File);
    axios
      .post("http://10.0.0.19:4000/user/addPicture", formData)
      .then(() => setIsOpen(false));
  }
  return (
    <Modal open={isOpen} width={25}>
      <div>
        <span className="d-flex justify-content-center mb-2">
          <img width={180} height={180} src={imageUrl} className="rounded" />
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
