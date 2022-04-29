import { Button } from "react-bootstrap";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../middleware/auth";
import { WebSocketContext } from "../../middleware/websocket";
import { Container, Row } from "react-bootstrap";

const Home = () => {
  const {
    user: { username, role, email, viewMode },
    logout,
  } = useContext(AuthContext);
  const { webSocket } = useContext(WebSocketContext);
  useEffect(() => {
    if (webSocket !== null) {
      webSocket.addEventListener("message", (event) => {
        console.log(event.data);
      });
      return () =>
        webSocket.removeEventListener("message", (event) => {
          console.log(event.data);
        });
    }
  }, [webSocket]);
  return (
    <Container>
      <Row>
        <div> Hello {username}!</div>
        <Button onClick={logout}> Logout</Button>
      </Row>
    </Container>
  );
};

export default Home;
