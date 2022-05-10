import { useState } from "react";
import { Button } from "react-bootstrap";
const CreateButton = (props) => {
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  return (
    <>
      {props.renderModal(
        props.data,
        props.modalConfigs,
        showModal,
        handleCloseModal,
        "create"
      )}
      <Button variant="success" onClick={handleShowModal}>
        {props.children}
      </Button>
    </>
  );
};

export default CreateButton;
