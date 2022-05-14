//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
