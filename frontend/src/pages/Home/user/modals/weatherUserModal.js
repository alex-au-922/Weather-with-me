import { useState, useEffect, useRef, useContext } from "react";
import { Modal, Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import "./weatherUserModal.css";
import LocationMapView from "./locationMap";
import { AuthContext } from "../../../../middleware/auth";
import { CommentBufferContext } from "../contexts/commentBufferProvider";
import { FormInputWithError } from "../../../../utils/gui/formInputs";
import { FetchStateContext } from "../../../../middleware/fetch";
import { BACKEND_WEBSERVER_HOST } from "../../../../frontendConfig";
import resourceFetch from "../../../../utils/authUtils/resourceFetch";

const CommentCard = (props) => {
  return (
    <Card style={{ marginTop: '1%', marginBotton: '1%' }}>
        <Card.Body>
          <Card.Title>
            {props.commenter}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {props.time}
          </Card.Subtitle>
          <Card.Text>
            {props.comment}
          </Card.Text>
        </Card.Body>
      </Card>
  )
}

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

  const handleSubmit = async (event) => {
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
    
      if (submitSuccess) {
        buffers[props.uniqueKey] = "";
      }
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
        <div className="column nopadding-left" style={{ width: "40%", maxHeight: "90vh" }}>
          <Modal.Header style={{height: "5%"}} closeButton></Modal.Header>
          <Modal.Body style={{ height: "85%" }}>
              <Container style={{ overflowY: "scroll", overflowX: "hidden", height: "80%" }}>
                {props.data.comments.map((commentData) => {
                    <CommentCard
                      commenter={commentData.username}
                      time={commentData.createTime}
                      comment={commentData.message}>
                    </CommentCard>
                })}
              </Container>
              <Container style={{ height: "10%"}}>
                <textarea
                  style={{ height: '100%', maxHeight: '100%', width: '100%', marginTop: '1%'}}
                  onChange={handleInputChange}
                  value={buffers[props.uniqueKey]}
                />
                <Button className='btn-success' onClick={handleSubmit}>Submit</Button>
              </Container>
          </Modal.Body>
        </div>
      </div>
    </Modal>
  );
};

export { WeatherUserLocationViewModal };
