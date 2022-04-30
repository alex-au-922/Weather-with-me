import { useContext, useEffect, useState } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { WeatherWebSocketContext } from "../../middleware/websocket";
import { registerMessageListener } from "../../utils/websocket/listener";
import parseWeatherDataFrontendView from "../../utils/data/weather";
import { Typeahead } from "react-bootstrap-typeahead";
const UserView = (props) => {
  const { username, logout } = props;
  const [weatherList, setWeatherList] = useState();
  const [descending, setDescending] = useState({
    name: false,
    longitude: false,
    latitude: false,
  });
  const [searchField, setSearchField] = useState({
    name: "name",
    input: "",
  });
  const { webSocket } = useContext(WeatherWebSocketContext);
  useEffect(() => {
    const handler = (event) => {
      const newWeatherJson = JSON.parse(event.data).result;
      const newWeatherList = parseWeatherDataFrontendView(newWeatherJson);
      setWeatherList(newWeatherList);
    };
    return registerMessageListener(webSocket, handler);
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

export default UserView;
