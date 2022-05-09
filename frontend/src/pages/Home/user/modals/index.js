import { useState, useEffect } from "react";
import { FormRowHeader } from "../../../../utils/gui/formInputs";
import { Modal, Button, Form } from "react-bootstrap";

const renderModals = (ModalComponent) => {
  return (data, show, onHide, uniqueKey) => {
    return (
      <ModalComponent
        key={uniqueKey}
        data={data}
        show={show}
        onHide={onHide}
        uniqueKey={uniqueKey}
      />
    );
  };
};

export { renderModals };
