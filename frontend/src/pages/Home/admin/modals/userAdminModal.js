import camelToCapitalize from "../../../../utils/input/camelToCapitalize";
import { FormRowHeader } from "../../../../utils/gui/formInputs";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import UnsavedModal from "../../../../utils/gui/modals/unsavedModal";

const SelectFormModalRow = (props) => {
  const originalValue = props.chosenOption;
  const [updateValue, setUpdateValue] = useState(originalValue);
  const [valueChanged, setValueChanged] = useState(
    updateValue === originalValue
  );

  const handleChangeValue = (event) => {
    setUpdateValue(event.target.value);
  };

  useEffect(() => {
    setValueChanged(updateValue !== originalValue);
  }, [updateValue]);

  useEffect(() => {
    props.onChange(props.field, valueChanged);
  }, [valueChanged]);

  return (
    <>
      <FormRowHeader
        originalBlank={false}
        updated={updateValue !== props.chosenOption}
        field={props.field}
      />
      <Form.Select defaultValue={updateValue} onChange={handleChangeValue}>
        {props.options.map((option, index) => (
          <option key={index}>{option}</option>
        ))}
      </Form.Select>
    </>
  );
};

const InputFormModalRow = (props) => {
  const originalValue = props.blank ? "" : props.value;
  const [updateValue, setUpdateValue] = useState(originalValue);
  const [valueChanged, setValueChanged] = useState(
    updateValue === originalValue
  );
  const handleChangeValue = (event) => {
    setUpdateValue(event.target.value);
  };

  useEffect(() => {
    setValueChanged(updateValue !== originalValue);
  }, [updateValue]);

  useEffect(() => {
    props.onChange(props.field, valueChanged);
  }, [valueChanged]);

  return (
    <>
      <FormRowHeader
        field={props.field}
        updated={updateValue !== originalValue}
      />

      <input
        className="form-control"
        type={props.type}
        placeholder={props.placeholder}
        value={updateValue}
        onChange={handleChangeValue}
      />
    </>
  );
};

const UserDataFormModal = (props) => {
  const [unsaved, setUnsaved] = useState(
    Object.keys(props.data).reduce((obj, key) => ((obj[key] = false), obj), {})
  );
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  const resetUnsaved = () => {
    const resetUnsaved = Object.keys(props.data).reduce(
      (obj, key) => ((obj[key] = false), obj),
      {}
    );
    setUnsaved(resetUnsaved);
  };

  const handleChangeFields = (field, changed) => {
    let newUnsaved = { ...unsaved };
    newUnsaved[field] = changed;
    setUnsaved(newUnsaved);
  };

  const handleShowUnsavedModal = () => setShowUnsavedModal(true);
  const handleCloseUnsavedModal = () => setShowUnsavedModal(false);

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
                      key={`${props.modalIndex},${field}`}
                      field={field}
                      options={props.modalConfig[field].selectOptions}
                      chosenOption={props.data[field]}
                      onChange={handleChangeFields}
                    />
                  ) : (
                    <InputFormModalRow
                      key={`${props.modalIndex},${field}`}
                      field={field}
                      type={props.modalConfig[field].type}
                      placeholder={camelToCapitalize(field)}
                      blank={props.modalConfig[field].blank}
                      value={props.data[field]}
                      onChange={handleChangeFields}
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
        show={showUnsavedModal}
        onHide={handleCloseUnsavedModal}
        title={"Unsaved Data"}
        body={"You have unsaved data. Are you sure you want to close the form?"}
        forceClose={handleInnerCloseModal}
      />
    </>
  );
};

const userModalOptions = {
  username: {
    mutable: true,
    blank: false,
    type: "text",
  },
  password: {
    mutable: true,
    blank: true,
    type: "text",
  },
  email: {
    mutable: true,
    blank: false,
    type: "email",
  },
  viewMode: {
    mutable: true,
    type: "select",
    selectOptions: ["default", "dark"],
  },
};

export { UserDataFormModal, userModalOptions };
