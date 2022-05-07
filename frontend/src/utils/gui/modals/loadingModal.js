import { Modal, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const LoadingModal = (props) => {
  return (
    <>
      {
        // TODO: review the UI of the spinner
        props.show && <Spinner animation="border" variant="dark" />
      }
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
            Loading...
          </Modal.Title>
        </Modal.Header>
        <Spinner animation="border" variant="dark" />
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default LoadingModal;
