//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
