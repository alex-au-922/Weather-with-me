import { useState, useEffect } from "react";
import { FormRowHeader } from "../../../../utils/gui/formInputs";
import { Modal, Button, Form } from "react-bootstrap";

const renderModals = (ModalComponent) => {
  return (data, modalConfig, show, onHide, modalIndex) => {
    if (modalConfig !== undefined && modalConfig !== null) {
      return (
        <ModalComponent
          modalConfig={modalConfig}
          data={data}
          show={show}
          onHide={onHide}
          modalIndex={modalIndex}
        />
      );
    }
  };
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
        readOnly = {!props.mutable}
        onChange={handleChangeValue}
      />
    </>
  );
};

export { renderModals, InputFormModalRow };
