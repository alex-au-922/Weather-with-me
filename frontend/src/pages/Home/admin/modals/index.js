const { Modal, Button, Form } = require("react-bootstrap");
const renderModals = (ModalComponent) => {
  return (data, modalConfig, show, onHide, modalIndex) => {
    if (modalConfig !== undefined && modalConfig !== null) {
      return (
        <ModalComponent
          modalConfig={modalConfig}
          data={data}
          show={show}
          onHide={onHide}
          modalIndex={modalIndex}
        />
      );
    }
  };
};

const BasicModal = (props) => {
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
          {props.modalTitle}
        </Modal.Title>
      </Modal.Header>
      {props.children}
    </Modal>
  );
};

export { renderModals, BasicModal };
