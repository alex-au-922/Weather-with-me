import { Form } from "react-bootstrap";
import camelToCapitalize from "../input/camelToCapitalize";

const FormInputWithError = ({ error, ...styles }) => {
  return (
    <>
      <Form.Control {...styles} isInvalid={error} />
      {error && (
        <Form.Control.Feedback
          type="invalid"
          style={{ color: "red", opacity: 0.5 }}
        >
          {error}
        </Form.Control.Feedback>
      )}
    </>
  );
};

const FormRowHeader = (props) => {
  const displayString = props.updated ? " *" : "";
  return (
    <Form.Label>
      {camelToCapitalize(props.field)}
      <span style={{ color: "red" }}> {displayString}</span>
    </Form.Label>
  );
};

export default FormInputWithError;
export { FormRowHeader };
