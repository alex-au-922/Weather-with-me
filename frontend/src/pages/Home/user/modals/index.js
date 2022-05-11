import { useState, useEffect } from "react";
import { FormRowHeader } from "../../../../utils/gui/formInputs";
import { Modal, Button, Form } from "react-bootstrap";

const renderModals = (ModalComponent) => {
  return (data, modalConfig, show, onHide, uniqueKey) => {
    return (
      <ModalComponent
        key={uniqueKey}
        modalConfig = {modalConfig}
        data={data}
        show={show}
        onHide={onHide}
        uniqueKey={uniqueKey}
      />
    );
  };
};

export { renderModals };
