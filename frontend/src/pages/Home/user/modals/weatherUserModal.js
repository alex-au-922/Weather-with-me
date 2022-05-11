import { useState, useEffect, useRef, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./weatherUserModal.css";
import LocationMapView from "./locationMap";
import { AuthContext } from "../../../../middleware/auth";
import { CommentBufferContext } from "../contexts/commentBufferProvider";
import { FormInputWithError } from "../../../../utils/gui/formInputs";
import { FetchStateContext } from "../../../../middleware/fetch";
import { BACKEND_WEBSERVER_HOST } from "../../../../frontendConfig";
import resourceFetch from "../../../../utils/authUtils/resourceFetch";

const WeatherUserLocationViewModal = (props) => {
  const { user } = useContext(AuthContext);
  const [unsaved, setUnsaved] = useState(
    Object.keys(props.data).reduce((obj, key) => ((obj[key] = false), obj), {})
  );
  const [value, setValue] = useState(props.data);
  const { buffers, setBuffers } = useContext(CommentBufferContext);
  const { fetchFactory } = useContext(FetchStateContext);
  const commentFetch = fetchFactory({
    success: false,
    error: true,
    loading: true,
  });
  const handleProperCloseModal = () => {
    const formUnsaved = Object.keys(unsaved).reduce(
      (accum, key) => accum || unsaved[key],
      false
    );
    props.onHide();
  };

  useEffect(() => {
    if (!buffers[props.uniqueKey]) {
      const newBuffers = { ...buffers };
      newBuffers[props.uniqueKey] = "";
      setBuffers(newBuffers);
    }
  }, []);

  const handleInputChange = (event) => {
    const newBuffers = { ...buffers };
    newBuffers[props.uniqueKey] = event.target.value;
    setBuffers(newBuffers);
  };

  const handleSubmit = async () => {
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/user/comment`;
    const payload = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("accessToken"),
        username: user.username,
      },
      body: JSON.stringify({
        name: props.data.name,
        comment: buffers[props.uniqueKey],
      }),
    };
    const { success: submitSuccess, fetching: submitFetching } =
      await resourceFetch(commentFetch, url, payload);
  };

  return (
    <Modal
      show={props.show}
      onHide={handleProperCloseModal}
      centered
      dialogClassName="modal-90w"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      animation={false}
    >
      <div className="row">
        <div
          className="column nopadding-right"
          style={{ width: "60%", borderRadius: "4px", overflow: "hidden" }}
        >
          <LocationMapView
            style={{ borderRadius: 5 }}
            weatherData={props.data}
          />
        </div>
        <div className="column nopadding-left" style={{ width: "40%" }}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <>
              <div
                className="column"
                style={{
                  // width: "40%",
                  "overflow-y": "auto",
                  "overflow-x": "hidden",
                }}
              >
                <textarea
                  onChange={handleInputChange}
                  value={buffers[props.uniqueKey]}
                />
                <Button onClick={handleSubmit}>Submit</Button>
              </div>
            </>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleProperCloseModal}>Close</Button>
          </Modal.Footer>
        </div>
      </div>
    </Modal>
  );
};

export { WeatherUserLocationViewModal };
