import { useRef } from "react";
import { Dropdown } from "react-bootstrap";
const DropDownButton = (props) => {
  const ref = useRef();
  return (
    <Dropdown onSelect={props.handleSelect} ref={ref}>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {props.buttonName}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {props.options.map((key, index) => (
          <DropDownButtonRow
            key={index}
            eventKey={`${key}`}
            display={`${key}`}
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
