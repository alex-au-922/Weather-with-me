import { Modal, Button } from "react-bootstrap";
const UnsavedModal = (props) => {
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
            {props.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.body}</Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>No</Button>
          <Button
            onClick={() => {
              props.onHide();
              props.forceClose();
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default UnsavedModal;
