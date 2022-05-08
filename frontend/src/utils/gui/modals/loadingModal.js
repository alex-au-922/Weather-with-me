import { Modal, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const LoadingModal = (props) => {
  return (
    <>
      {
        // TODO: review the UI of the spinner
        props.show && <Spinner animation="border" variant="dark" />
      }
    </>
  );
};
export default LoadingModal;
