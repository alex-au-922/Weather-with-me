import { useRef } from "react";
import { Dropdown, ButtonGroup, Button } from "react-bootstrap";
import camelToCapitalize from "../input/camelToCapitalize";
import getTitleHeader from "../input/getTableLongHeader";
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
        {getTitleHeader(props.buttonName)}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {props.optionsType // if the user specify the type of options
          ? props.options // as in the table search bar only string type data can be chosen
              .filter(
                (key) =>
                  props.optionsAllowedTypes.indexOf(props.optionsType[key]) !==
                  -1
              )
              .map((key, index) => (
                <DropDownButtonRow
                  key={index}
                  eventKey={`${key}`}
                  display={`${getTitleHeader(key)}`}
                />
              ))
          : props.options.map(
              (
                key,
                index //If the user doesn't specify the type of options
              ) => (
                <DropDownButtonRow //either use in normal drop down button where the type of data doesn't really matter or all are in string type
                  key={index}
                  eventKey={`${key}`}
                  display={`${getTitleHeader(key)}`}
                />
              )
            )}
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
