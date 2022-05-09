import camelToCapitalize from "../../../../utils/input/camelToCapitalize";
import { FormRowHeader } from "../../../../utils/gui/formInputs";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { InputFormModalRow, SelectFormModalRow } from ".";
import { DeleteModal, UnsavedModal } from "../../../../utils/gui/modals";

const WeatherAdminDataFormModal = (props) => {
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
          <Form>
            {Object.keys(props.data).map((field) => {
              return (
                <>
                  {props.modalConfig[field].type === "select" ? (
                    <SelectFormModalRow
                      key={`${field}`}
                      field={field}
                      options={props.modalConfig[field].selectOptions}
                      chosenOption={props.data[field]}
                      onChangeUnsaved={handleChangeUnsaved}
                      onChangeValue={handleChangeValue}
                    />
                  ) : (
                    <InputFormModalRow
                      key={`${field}`}
                      field={field}
                      type={props.modalConfig[field].type}
                      mutable={props.modalConfig[field].mutable}
                      placeholder={camelToCapitalize(field)}
                      blank={props.modalConfig[field].blank}
                      value={props.data[field]}
                      onChangeUnsaved={handleChangeUnsaved}
                      onChangeValue={handleChangeValue}
                    />
                  )}
                  <div className="mb-2" />
                </>
              );
            })}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => {}}>Save</Button>
          <Button onClick={handleProperCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      <UnsavedModal
        key={`${props.uniqueKey},unsaved_modal`}
        modalIndex={`${props.uniqueKey},unsaved_modal,modal`}
        show={showUnsavedModal}
        onHide={handleCloseUnsavedModal}
        title={"Unsaved Data"}
        body={"You have unsaved data. Are you sure you want to close the form?"}
        forceClose={handleInnerCloseModal}
      />
      <DeleteModal
        key={`${props.uniqueKey},delete_modal`}
        modalIndex={`${props.uniqueKey},delete_modal,modal`}
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        title={"Notice"}
        body={`Are you sure to delete user ${props.data.username}?`}
      />
    </>
  );
};

const weatherModalOptions = {
  name: {
    mutable: true,
    blank: false,
    type: "text",
  },
  latitude: {
    mutable: true,
    blank: false,
    type: "text",
  },
  longitude: {
    mutable: true,
    blank: false,
    type: "text",
  },
  time: {
    mutable: false,
    blank: false,
    type: "text",
  },
  temperature: {
    mutable: false,
    blank: false,
    type: "text",
  },
  tenMinMaxGust: {
    mutable: false,
    blank: false,
    type: "text",
  },
  tenMinMeanWindDir: {
    mutable: false,
    blank: false,
    type: "text",
  },
  tenMinMeanWindSpeed: {
    mutable: false,
    blank: false,
    type: "text",
  },
  relativeHumidity: {
    mutable: false,
    blank: false,
    type: "text",
  },
};

export { WeatherAdminDataFormModal, weatherModalOptions };
