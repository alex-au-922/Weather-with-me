import camelToCapitalize from "../../../../utils/input/camelToCapitalize";
import { useState, useContext, useLayoutEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { InputFormModalRow, SelectFormModalRow } from ".";
import { UnsavedModal } from "../../../../utils/gui/modals";
import { objectAny, objectSetAll } from "../../../../utils/object";
import { FetchStateContext } from "../../../../middleware/fetch";
import { FormBufferContext } from "../contexts/formBufferProvider";

const BlankLogDataFormModal = (props) => {
  const [unsaved, setUnsaved] = useState(objectSetAll(props.data, false));
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [logInfoError, setLocationInfoError] = useState(
    objectSetAll(props.data, "")
  );
  const { formBuffer, setFormBuffer, resetBuffer } =
    useContext(FormBufferContext);
  useLayoutEffect(() => {
    setFormBuffer((formBuffer) => objectSetAll(props.data));
  }, []);

  useLayoutEffect(() => {
    const newBuffer = Object.keys(unsaved).reduce(
      (prevBuffer, currKey) => (
        (prevBuffer[currKey] = unsaved[currKey]
          ? formBuffer[currKey]
          : props.data[currKey]),
        prevBuffer
      ),
      {}
    );
    setFormBuffer(newBuffer);
  }, [props.data]);

  const handleChangeUnsaved = (field, changed) => {
    const newUnsaved = { ...unsaved };
    newUnsaved[field] = changed;
    setUnsaved(newUnsaved);
  };

  const handleChangeValue = (field, changedBuffer) => {
    const newBuffer = { ...formBuffer };
    newBuffer[field] = changedBuffer;
    setFormBuffer(newBuffer);
  };

  const resetUnsaved = () => {
    const resetUnsaved = objectSetAll(props.data, false);
    setUnsaved(resetUnsaved);
  };

  const handleShowUnsavedModal = () => setShowUnsavedModal(true);
  const handleCloseUnsavedModal = () => setShowUnsavedModal(false);

  const handleInnerCloseModal = () => {
    resetBuffer();
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
        style={{
          opacity: props.show ? (showUnsavedModal ? 0.8 : 1) : 0,
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">New Log</Modal.Title>
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
                      readOnly={props.modalConfig[field].unmutable}
                      chosenOption={props.data[field]}
                      error={logInfoError[field]}
                      onChangeUnsaved={handleChangeUnsaved}
                      onChangeValue={handleChangeValue}
                    />
                  ) : (
                    <InputFormModalRow
                      key={`${field}`}
                      field={field}
                      type={props.modalConfig[field].type}
                      mutable={props.modalConfig[field].unmutable}
                      placeholder={camelToCapitalize(field)}
                      blank={props.modalConfig[field].blank}
                      value={props.data[field]}
                      error={logInfoError[field]}
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
          <Button variant="secondary" onClick={handleProperCloseModal}>
            Close
          </Button>
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
    </>
  );
};

const LogAdminDataFormModal = (props) => {
  const logData = Object.keys(props.data)
    .filter((key) => props.modalConfig[key].unmutable)
    .reduce((obj, key) => ((obj[key] = props.data[key]), obj), {});
  const logName = props.data.name;
  const [unsaved, setUnsaved] = useState(objectSetAll(logData, false));
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { formBuffer, setFormBuffer, resetBuffer } =
    useContext(FormBufferContext);
  useLayoutEffect(() => {
    setFormBuffer((formBuffer) => logData);
  }, []);

  useLayoutEffect(() => {
    const newBuffer = Object.keys(unsaved).reduce(
      (prevBuffer, currKey) => (
        (prevBuffer[currKey] = unsaved[currKey]
          ? formBuffer[currKey]
          : props.data[currKey]),
        prevBuffer
      ),
      {}
    );
    setFormBuffer(newBuffer);
  }, [props.data]);

  const { fetchState } = useContext(FetchStateContext);

  const resetUnsaved = () => {
    const resetUnsaved = objectSetAll(logName, false);
    setUnsaved(resetUnsaved);
  };

  const handleChangeUnsaved = (field, changed) => {
    const newUnsaved = { ...unsaved };
    newUnsaved[field] = changed;
    setUnsaved(newUnsaved);
  };

  const handleChangeValue = (field, changedBuffer) => {
    const newBuffer = { ...formBuffer };
    newBuffer[field] = changedBuffer;
    setFormBuffer(newBuffer);
  };

  const handleShowUnsavedModal = () => setShowUnsavedModal(true);
  const handleCloseUnsavedModal = () => setShowUnsavedModal(false);

  const handleInnerCloseModal = () => {
    resetBuffer();
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
        animation={false}
        style={{
          opacity: props.show
            ? showUnsavedModal || showDeleteModal || objectAny(fetchState, true)
              ? 0.7
              : 1
            : 0,
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Log Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {Object.keys(props.data)
              .filter((key) => props.modalConfig[key].display)
              .map((field) => {
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
                        mutable={props.modalConfig[field].unmutable}
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
          <Button variant="secondary" onClick={handleProperCloseModal}>
            Close
          </Button>
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
    </>
  );
};

const logModalOptions = {
  _id: {
    mutable: false,
    blank: false,
    type: "text",
    display: false,
  },
  method: {
    mutable: false,
    blank: false,
    type: "text",
    display: true,
  },
  userAgent: {
    mutable: false,
    blank: false,
    type: "textarea",
    display: true,
  },
  date: {
    mutable: false,
    blank: false,
    type: "text",
    display: true,
  },
  ip: {
    mutable: false,
    blank: false,
    type: "text",
    display: true,
  },
};

export { BlankLogDataFormModal, LogAdminDataFormModal, logModalOptions };
