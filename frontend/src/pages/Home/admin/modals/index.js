import { useState, useEffect } from "react";
import {
  FormRowHeader,
  FormSelectWithError,
} from "../../../../utils/gui/formInputs";
import { Form } from "react-bootstrap";
import { FormInputWithError } from "../../../../utils/gui/formInputs";

const renderModals = (ModalComponent) => {
  return (data, modalConfig, show, onHide, uniqueKey) => {
    if (modalConfig !== undefined && modalConfig !== null) {
      return (
        <ModalComponent
          key={uniqueKey}
          modalConfig={modalConfig}
          data={data}
          show={show}
          onHide={onHide}
          uniqueKey={uniqueKey}
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
    const newValue = event.target.value;
    setUpdateValue(newValue);
    props.onChangeValue(props.field, newValue);
  };

  useEffect(() => {
    setValueChanged(updateValue !== originalValue);
  }, [updateValue]);

  useEffect(() => {
    props.onChangeUnsaved(props.field, valueChanged);
  }, [valueChanged]);

  return (
    <>
      <FormRowHeader
        field={props.field}
        updated={updateValue !== originalValue}
      />
      <FormInputWithError
        error={props.error ?? ""}
        type={props.type}
        placeholder={props.placeholder}
        value={updateValue}
        readOnly={!props.mutable}
        onChange={handleChangeValue}
      />
    </>
  );
};

const SelectFormModalRow = (props) => {
  const originalValue = props.chosenOption;
  const [updateValue, setUpdateValue] = useState(originalValue);
  const [valueChanged, setValueChanged] = useState(
    updateValue === originalValue
  );

  const handleChangeValue = (event) => {
    const newValue = event.target.value;
    setUpdateValue(newValue);
    props.onChangeValue(props.field, newValue);
  };

  useEffect(() => {
    setValueChanged(updateValue !== originalValue);
  }, [updateValue]);

  useEffect(() => {
    props.onChangeUnsaved(props.field, valueChanged);
  }, [valueChanged]);

  return (
    <>
      <FormRowHeader
        originalBlank={false}
        updated={updateValue !== props.chosenOption}
        field={props.field}
      />
      <FormSelectWithError
        defaultValue={updateValue}
        onChange={handleChangeValue}
        error={props.error}
      >
        {props.options.map((option, index) => (
          <option key={index}>{option}</option>
        ))}
      </FormSelectWithError>
    </>
  );
};

export { renderModals, InputFormModalRow, SelectFormModalRow };
