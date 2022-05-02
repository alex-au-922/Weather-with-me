const { Modal, Button, Form } = require("react-bootstrap");

const WeatherDataFormModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      centered
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Weather Data
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form></Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

const weatherModalOptions = [
  {
    name: "username",
    display: true,
    mutable: true,
    blank: false,
    style: "text",
  },
  {
    name: "password",
    display: true,
    mutable: true,
    blank: true,
    style: "text",
  },
  {
    name: "email",
    display: true,
    mutable: true,
    blank: false,
    style: "text",
  },
  {
    name: "viewMode",
    display: true,
    mutable: true,
    blank: false,
    style: "dropdown",
    dropdownOptions: ["default", "dark"],
  },
];

export { WeatherDataFormModal, weatherModalOptions };
