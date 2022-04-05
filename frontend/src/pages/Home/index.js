import { Button } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../../middleware/auth";
import { Container, Row } from "react-bootstrap";

const Home = () => {
  const {
    user: { username, role, email, viewMode },
    logout,
  } = useContext(AuthContext);
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
