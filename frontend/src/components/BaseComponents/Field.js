import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Form from "react-bootstrap/Form";
export default function Field({ Name, Label, Type, value, setter}) {
  return (
    <Form.Group size="lg" controlId={Name}>
      <Form.Label>{Label}</Form.Label>
      <Form.Control
        autoFocus
        type={Type}
        value={value}
        required={true}
        onChange={(e) => setter(e.target.value)}
      />
    </Form.Group>
  );
}
