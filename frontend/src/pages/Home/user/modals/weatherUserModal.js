import { useState, useEffect, useRef, useContext } from "react";
import {
  Modal,
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import "./weatherUserModal.css";
import LocationMapView from "./locationMap";
import { AuthContext } from "../../../../middleware/auth";
import { CommentBufferContext } from "../contexts/commentBufferProvider";
import { FormInputWithError } from "../../../../utils/gui/formInputs";
import { FetchStateContext } from "../../../../middleware/fetch";
import { BACKEND_WEBSERVER_HOST } from "../../../../frontendConfig";
import resourceFetch from "../../../../utils/authUtils/resourceFetch";
import { useReducer } from "react";
import { registerWindowListener } from "../../../../utils/listeners/windowListener.js";
import { ReactComponent as StarIcon } from "./star.svg";
import { ReactComponent as ProfileIcon } from "./profilePicture.svg";
import { ReactComponent as SendIcon } from "./send.svg";

// const formatTimeString = (timeString) => {
//   const date = Date.parse(timeString);
//   const day = date.
// }

const CommentCard = (props) => {
  return (
    <Card style={{ marginTop: "1%", marginBotton: "1%" }}>
      <Card.Body>
        <Card.Title>
          {/* <ProfileIcon style={{width: "50", height: "50", marginRight: "5%"}}>
              </ProfileIcon>  */}
          {props.commenter}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
        <Card.Text>{props.comment}</Card.Text>
      </Card.Body>
      <Card.Footer>{props.time}</Card.Footer>
    </Card>
  );
};

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

  const enterKeyHandler = async (event) => {
    if (event.key == "Enter") await handleSubmit();
  };

  useEffect(() => {
    return registerWindowListener("keyup", enterKeyHandler);
  }, [buffers[props.uniqueKey]]);

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
      const newBuffers = { ...buffers };
      newBuffers[props.uniqueKey] = "";
      setBuffers(newBuffers);
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
        <div
          className="column nopadding-left"
          style={{
            width: "40%",
            maxHeight: "90vh",
            backgroundColor: "#F5F5DC",
          }}
        >
          <Modal.Header style={{ height: "10%" }} closeButton>
            <div
              style={{
                cursor: "pointer",
                position: "relative",
                left: "85%",
                top: "0%",
              }}
            >
              {true ? (
                <StarIcon
                  data-toggle="tooltip"
                  title="Show Normal"
                  // onClick={handleClick}
                  style={{ color: "#FFCC00" }}
                />
              ) : (
                <StarIcon
                  data-toggle="tooltip"
                  title="Show Favourite Locations"
                  // onClick={handleClick}
                  style={{ color: "#777" }}
                />
              )}
            </div>
          </Modal.Header>
          <Modal.Body
            style={{ height: "90%", padding: "2%", backgroundColor: "#F5F5DC" }}
          >
            <Container
              style={{
                display: "flex",
                height: "80%",
                overflow: "auto",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div style={{ width: "90%" }}>
                {props.data.comments?.map((commentData) => (
                  <CommentCard
                    key={commentData.createTime + commentData.username}
                    commenter={commentData.username}
                    time={commentData.createTime}
                    comment={commentData.message}
                  ></CommentCard>
                ))}
              </div>
            </Container>
            <Container
              style={{
                width: "100%",
                height: "15%",
                display: "flex",
                alignItems: "center",
                marginTop: "3%",
                justifyContent: "space-around",
              }}
            >
              <div className="sendMessageAreaCol1">
                <textarea
                  style={{ height: "80%", width: "100%" }}
                  onChange={handleInputChange}
                  value={buffers[props.uniqueKey]}
                />
              </div>
            </Container>
          </Modal.Body>
          {/* <Modal.Footer style={{ height: "10%" }}>
            <Button variant="secondary" onClick={handleProperCloseModal}>
              Close
            </Button>
          </Modal.Footer> */}
        </div>
      </div>
    </Modal>
  );
};

export { WeatherUserLocationViewModal };
