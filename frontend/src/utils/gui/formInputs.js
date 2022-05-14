import { Form } from "react-bootstrap";
import camelToCapitalize from "../input/camelToCapitalize";

const FormInputWithError = ({ error, ...styles }) => {
  return (
    <>
      {styles.type === "textarea" ? (
        <Form.Control {...styles} isInvalid={error} as="textarea" />
      ) : (
        <Form.Control {...styles} isInvalid={error} />
      )}
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

const FormSelectWithError = ({ error, children, ...styles }) => {
  return (
    <>
      <Form.Select {...styles} isInvalid={error}>
        {children}
      </Form.Select>
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

export { FormRowHeader, FormInputWithError, FormSelectWithError };
