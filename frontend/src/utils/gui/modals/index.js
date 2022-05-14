//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import "./index.css";

const BasicInfoModal = (props) => {
  return (
    <Modal
      scrollable={true}
      show={props.show}
      onHide={props.onHide}
      centered
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      animation={false}
      style={{
        zIndex: 1000000,
      }}
      {...props.style}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>{props.children}</Modal.Footer>
    </Modal>
  );
};

const LoadingSpinner = (props) => {
  if (!props.show) {
    return <div></div>;
  }
  return (
    <div className="row">
      <div className="loader"></div>
    </div>
  );
};

const ActionAlertModal = (props) => {
  return (
    <BasicInfoModal
      show={props.show}
      onHide={props.onHide}
      title={props.title}
      body={props.body}
      {...props.style}
    >
      {props.yesPriority ? (
        <>
          <Button active variant="primary" onClick={props.onHide}>
            No
          </Button>

          <Button
            variant={props.yesButtonVariant}
            onClick={() => {
              props.onHide();
              props.action();
            }}
          >
            Yes
          </Button>
        </>
      ) : (
        <>
          <Button
            variant={props.yesButtonVariant}
            onClick={() => {
              props.onHide();
              props.action();
            }}
          >
            Yes
          </Button>
          <Button active variant="primary" onClick={props.onHide}>
            No
          </Button>
        </>
      )}
    </BasicInfoModal>
  );
};

const InfoModal = (props) => {
  return (
    <BasicInfoModal
      show={props.show}
      onHide={props.onHide}
      title={props.title}
      body={props.body}
      {...props.style}
    >
      <Button active variant="primary" onClick={props.onHide}>
        Close
      </Button>
    </BasicInfoModal>
  );
};

const UnsavedModal = (props) => {
  return (
    <ActionAlertModal
      show={props.show}
      onHide={props.onHide}
      title={props.title}
      body={props.body}
      yesButtonVariant={"secondary"}
      yesPriority={false}
      action={props.forceClose}
      {...props.style}
    />
  );
};

const DeleteModal = (props) => {
  return (
    <ActionAlertModal
      show={props.show}
      onHide={props.onHide}
      title={props.title}
      body={props.body}
      yesButtonVariant={"danger"}
      yesPriority={false}
      action={props.delete}
      {...props.style}
    />
  );
};

const ErrorModal = (props) => {
  return (
    <InfoModal
      show={props.show}
      onHide={props.onHide}
      title={props.errorType}
      body={props.errorMessage}
      {...props.style}
    />
  );
};

const SuccessModal = (props) => {
  return (
    <InfoModal
      show={props.show}
      onHide={props.onHide}
      title={"Success"}
      body={props.body}
      {...props.style}
    />
  );
};

export { UnsavedModal, DeleteModal, ErrorModal, SuccessModal, LoadingSpinner };
