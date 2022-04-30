import { Form } from "react-bootstrap";

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

export default FormInputWithError;
