import { useContext, useEffect, useState } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { WeatherWebSocketContext } from "../../middleware/websocket";
import { registerMessageListener } from "../../utils/listeners/webSocketMessage";
import parseWeatherDataFrontendView from "../../utils/data/weather";
import { Typeahead } from "react-bootstrap-typeahead";
import ListGroup from 'react-bootstrap/ListGroup';
import { GoogleMap, LoadScript, InfoBox, OverlayView } from '@react-google-maps/api';
import { Marker } from '@react-google-maps/api';
import GOOGLE_API_KEY from "../../keys/googleAPI";
import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";

// MAP SIZE ON SCREEN
const containerStyle = {
  width: '98vw',
  height: '98vh'
};

// MAP CENTER LOCATION
const center = {
  lat: 22.30,
  lng: 114.177216
};

const position = {
  lat: 24.4,
  lng: 115.1231
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
  const { username } = props.user;
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

  useEffect(() => {
    //initial fetch weather data
    (async () => {
      const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/user/weathers`;
      const payload = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("accessToken"),
          username,
        },
      };
      const fetchResult = await fetch(url, payload);
      const { success, result } = await fetchResult.json();
      if (success) updateWeatherData(result);
    })();
  }, []);  

  const updateWeatherData = (resultJson) => {
    const newWeatherList = parseWeatherDataFrontendView(resultJson);
    setWeatherList(newWeatherList);
  };  

  const onMouseOverMarker = () => {
    console.log(weatherList);
  }

  const position = {
    lat: 24.4,
    lng: 115.1231
  };
  

  const renderMarker = () => {
    weatherList.map((items) => {
      console.log(items.latitude, items.longitude);
      // return (
      //   <Marker onMouseOver={onMouseOverMarker} position={ {lat: items.latitude, lng: items.longitude} }/>
      // )
    });    
    // return (
    // // //   weatherList.map((items) => {
    // // //     <Marker onMouseOver={onMouseOverMarker} position={ {lat: items.latitude, lng: items.longitude} }/>
    // // //   })
      <Marker
      onLoad={onLoad}
      onMouseOver={onMouseOverMarker}
      position={position}
      />         
    // );
  }

  const onLoad = marker => {
    console.log('marker: ', marker)
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_API_KEY}>
        {/* <Row>
          <div> Hello {username}!</div>
        </Row> */}
        <GoogleMap mapContainerStyle={containerStyle}
          center={center}
          zoom={10} >
            {/* {weatherList !== undefined && weatherList.map((items, i) => {
                <Marker key={i} onMouseOver={onMouseOverMarker} position={ {lat: items.latitude, lng: items.longitude} }/>
            })
            } */}
            {renderMarker()}
        </GoogleMap>
    </LoadScript>
  );
};

export default UserView;
