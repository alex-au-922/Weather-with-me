import camelToCapitalize from "../../../../utils/input/camelToCapitalize";
import { FormRowHeader } from "../../../../utils/gui/formInputs";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { InputFormModalRow, SelectFormModalRow } from ".";
import { DeleteModal, UnsavedModal } from "../../../../utils/gui/modals";

const WeatherUserLocationViewModal = (props) => {
  const [unsaved, setUnsaved] = useState(
    Object.keys(props.data).reduce((obj, key) => ((obj[key] = false), obj), {})
  );
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [value, setValue] = useState(props.data);

  const resetUnsaved = () => {
    const resetUnsaved = Object.keys(props.data).reduce(
      (obj, key) => ((obj[key] = false), obj),
      {}
    );
    setUnsaved(resetUnsaved);
  };

  const handleChangeUnsaved = (field, changed) => {
    const newUnsaved = { ...unsaved };
    newUnsaved[field] = changed;
    setUnsaved(newUnsaved);
  };

  const handleChangeValue = (field, changedValue) => {
    const newValue = { ...value };
    newValue[field] = changedValue;
    setValue(newValue);
  };

  const handleShowUnsavedModal = () => setShowUnsavedModal(true);
  const handleCloseUnsavedModal = () => setShowUnsavedModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleInnerCloseModal = () => {
    resetUnsaved();
    props.onHide();
  };

  const handleProperCloseModal = () => {
    const formUnsaved = Object.keys(unsaved).reduce(
      (accum, key) => accum || unsaved[key],
      false
    );
    if (formUnsaved) {
      handleShowUnsavedModal();
    } else {
      handleInnerCloseModal();
    }
  };
  return (
    <>
      <Modal
        show={props.show}
        onHide={handleProperCloseModal}
        centered
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        style={{ opacity: props.show ? (showUnsavedModal ? 0.8 : 1) : 0 }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            User Data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1>Message!</h1>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => {}}>Save</Button>
          <Button onClick={handleProperCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};


export { WeatherUserLocationViewModal };
