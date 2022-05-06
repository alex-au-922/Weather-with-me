import { useContext, useEffect, useState } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { WeatherWebSocketContext } from "../../middleware/websocket";
import { registerMessageListener } from "../../utils/listeners/webSocketMessage";
import parseWeatherDataFrontendView from "../../utils/data/weather";
import { Typeahead } from "react-bootstrap-typeahead";
import { GoogleMap, LoadScript, InfoBox, OverlayView } from '@react-google-maps/api';
import GOOGLE_API_KEY from "../../keys/googleAPI";

// MAP SIZE ON SCREEN
const containerStyle = {
  width: '700px',
  height: '700px'
};

// MAP CENTER LOCATION
const center = {
  lat: 22.30,
  lng: 114.177216
};

const options = { closeBoxURL: '', enableEventPropagation: true };

const onClick = () => {
  console.info('I have been clicked!')
};

const divStyle = {
  background: 'white',
  border: '1px solid #ccc',
  padding: 15
};

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
      console.log(newWeatherList);
      setWeatherList(newWeatherList);
    };
    return registerMessageListener(webSocket, handler);
  }, [webSocket]);
  return (
    <LoadScript googleMapsApiKey={GOOGLE_API_KEY}>
      <Container>
        <Row>
          <div> Hello {username}!</div>
        </Row>
        <GoogleMap mapContainerStyle={containerStyle}
          center={center}
          zoom={10} >
          <InfoBox options={options} position={center}>
            <div style={{ backgroundColor: 'yellow', opacity: 0.75, padding: 12 }}>
              <div style={{ fontSize: 16, fontColor: `#08233B` }}>
                Cloudy day!
              </div>
            </div>
          </InfoBox>
        </GoogleMap>
      </Container>
    </LoadScript>
  );
};

export default UserView;
