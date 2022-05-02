import { useRef } from "react";
import { Dropdown, ButtonGroup, Button } from "react-bootstrap";
import camelToCapitalize from "../input/camelToCapitalize";
const DropDownButton = (props) => {
  const ref = useRef();
  return (
    <Dropdown as={ButtonGroup} onSelect={props.handleSelect} ref={ref}>
      {props.renderSplitButton && (
        <Button variant="success" {...props.splitButtonOptions}>
          {props.splitButtonChild}
        </Button>
      )}
      <Dropdown.Toggle split variant="success" id="dropdown-basic">
        {camelToCapitalize(props.buttonName)}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {props.optionsType
          ? props.options
              .filter(
                (key) =>
                  props.optionsAllowedTypes.indexOf(props.optionsType[key]) !==
                  -1
              )
              .map((key, index) => (
                <DropDownButtonRow
                  key={index}
                  eventKey={`${key}`}
                  display={`${camelToCapitalize(key)}`}
                />
              ))
          : props.options.map((key, index) => (
              <DropDownButtonRow
                key={index}
                eventKey={`${key}`}
                display={`${camelToCapitalize(key)}`}
              />
            ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const DropDownButtonRow = (props) => {
  const ref = useRef();
  return (
    <Dropdown.Item
      eventKey={props.eventKey}
      ref={ref}
      onClick={() => ref.current.blur()}
    >
      {props.display}
    </Dropdown.Item>
  );
};

export default DropDownButton;
