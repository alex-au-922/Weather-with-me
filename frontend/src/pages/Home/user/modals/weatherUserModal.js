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
import { FavouriteLocationWeatherUserModal } from "../button/favouriteLocationWeatherUserModal";
import { registerWindowListener } from "../../../../utils/listeners/windowListener.js";


const CommentCard = (props) => {
  return (
    <Card className="card" style={{ marginTop: "1%", marginBotton: "1%", fontFamily: 'Trebuchet MS', backgroundColor: '#FAFAFA' }}>
      <Card.Body>
        <Card.Title>
          <p style={{fontStyle: "italic", fontWeight: 'bold', fontSize: "1.2em"}}>{props.commenter}</p>
        </Card.Title>
        <Card.Text>{props.comment}</Card.Text>
        <div style={{position: "absolute", bottom: 0, right: "1%"}}>
          <small className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.7em' }}>{props.time}</small>
        </div>
      </Card.Body>
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

  const checkFavouriteLocation = () => {
    const check =  user.favouriteLocation.filter(
      (currLocName) =>
        currLocName === props.data.name
    )
    return (check.length > 0);
  }

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
            backgroundColor: "#FFFFFF",
            borderRadius: "4px"
          }}
        >
          <Modal.Header style={{ height: "10%", border: 'none', padding: 0 }} closeButton>
            <Container
                style={{
                  display: 'flex',
                  height: "100%",
                  overflow: "hidden",
                  justifyContent: "space-around",
                  alignItems: "center"
                }}
              >
                <h1 style={{fontFamily: 'Trebuchet MS', color: 'black'}}>Comments</h1>
              </Container>
            <div style={{position: 'absolute', display: 'flex', right: "5%"}}>
              <FavouriteLocationWeatherUserModal isFavourite={checkFavouriteLocation()} name={props.data.name}></FavouriteLocationWeatherUserModal>
            </div>
          </Modal.Header>
          <Modal.Body
            style={{ height: "90%", padding: "2%", backgroundColor: "#FFFFFF", paddingTop: 0 }}
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
              <div style={{ width: "90%", height: "95%" }}>
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
                height: "15%",
                display: "flex",
                alignItems: "center",
                marginTop: "3%",
                justifyContent: "space-around",
              }}
            >
              <div className="sendMessageAreaCol1">
                <textarea
                  style={{ height: "80%", width: "97%" }}
                  onChange={handleInputChange}
                  value={buffers[props.uniqueKey]}
                />
              </div>
            </Container>
          </Modal.Body>
        </div>
      </div>
    </Modal>
  );
};

export { WeatherUserLocationViewModal };
