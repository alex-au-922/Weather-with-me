import { Modal, Button } from "react-bootstrap";
const ErrorModal = (props) => {
  return (
    <>
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
            {props.errorType}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ErrorModal;
