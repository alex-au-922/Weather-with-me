//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import { useState, useEffect, useRef } from "react";
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
          key={`${uniqueKey}, modals`}
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

  const handleChangeValue = (event) => {
    const newValue = event.target.value;
    setUpdateValue(newValue);
    props.onChangeValue(props.field, newValue);
  };

  return (
    <>
      <FormRowHeader field={props.field} updated={props.updated} />
      <FormInputWithError
        error={props.error ?? ""}
        type={props.type}
        placeholder={props.placeholder}
        value={updateValue ?? ""}
        readOnly={!props.mutable}
        onChange={handleChangeValue}
      />
    </>
  );
};

const SelectFormModalRow = (props) => {
  const originalValue = props.chosenOption;
  const [updateValue, setUpdateValue] = useState(originalValue);

  const handleChangeValue = (event) => {
    const newValue = event.target.value;
    setUpdateValue(newValue);
    props.onChangeValue(props.field, newValue);
  };

  return (
    <>
      <FormRowHeader
        originalBlank={false}
        updated={props.updated}
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
