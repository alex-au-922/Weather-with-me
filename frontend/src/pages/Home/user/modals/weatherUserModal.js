
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./weatherUserModal.css"
import LocationMapView from "./locationMap";

const WeatherUserLocationViewModal = (props) => {
  const [unsaved, setUnsaved] = useState(
    Object.keys(props.data).reduce((obj, key) => ((obj[key] = false), obj), {})
  );
  const [value, setValue] = useState(props.data);

  const handleProperCloseModal = () => {
    const formUnsaved = Object.keys(unsaved).reduce(
      (accum, key) => accum || unsaved[key],
      false
    );
    props.onHide();
  };

  return (
      <Modal
      show={props.show}
      onHide={handleProperCloseModal}
      centered
      dialogClassName="modal-90w"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
    >
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <>
          <div className="row">
            <div className="column" style={{ width: "70%"}}>
            <LocationMapView
              weatherData={props.data}
            />
            </div>
            <div className="column overflow" style={{ width: "30%"}}>
            </div>
          </div>
        </> 
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleProperCloseModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};


export { WeatherUserLocationViewModal };
