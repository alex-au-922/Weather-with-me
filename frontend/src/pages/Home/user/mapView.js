import { useEffect, useState, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { registerMarkerListener } from "../../../utils/listeners/googleMapMarkerListener";
import GOOGLE_API_KEY from "../../../keys/googleAPI";

const loader = new Loader({
  apiKey: GOOGLE_API_KEY,
  version: "weekly",
});

const defaultMapOptions = {
  center: {
    lat: 22.3,
    lng: 114.177216,
  },
  zoom: 11,
};

const WeatherContent = (weatherData) => {
  return `<ul style = "list-style: none;">
        <li>Location: ${weatherData.name}</li>
        <li>Temperature: ${weatherData.temperature}</li>
        <li>Relative Humidity: ${weatherData.relativeHumidity} </li>
        <li>Updated Time: ${weatherData.time}</li>
    </ul>`;
};

const Marker = (props) => {
  const [marker, setMarker] = useState({
    marker: null,
    option: null,
  });
  const [infoWindow, setInfoWindow] = useState({
    infoWindow: null,
    content: null,
  });

  const handleMouseOver = () => {
    infoWindow.infoWindow.setContent(infoWindow.content);
    infoWindow.infoWindow.open(props.map, marker.marker);
  };

  const handleMouseOut = () => {
    infoWindow.infoWindow.close(props.map, marker.marker);
  };

  const handleMouseClick = () => {
    //TODO: change the handle mouse click to render a consistent data view
    console.log(marker.option);
  };

  useEffect(() => {
    if (props.google !== null && props.data) {
      setMarker({
        ...marker,
        option: {
          position: new props.google.maps.LatLng(
            props.data.longitude,
            props.data.latitude
          ),
        },
      });
    }
  }, [props.google, props.data]);
  useEffect(() => {
    if (props.map !== null && marker.option) {
      if (!marker.marker) {
        setMarker({
          ...marker,
          marker: new props.google.maps.Marker(marker.option),
        });
        setInfoWindow({
          infoWindow: new props.google.maps.InfoWindow(),
          content: WeatherContent(props.data),
        });
      }
    }
  }, [props.map, marker.option]);

  useEffect(() => {
    if (marker.marker) {
      marker.marker.setMap(props.map);
      const unregisterMouseOver = registerMarkerListener(
        props.google,
        marker.marker,
        "mouseover",
        handleMouseOver
      );
      const unregisterMouseOut = registerMarkerListener(
        props.google,
        marker.marker,
        "mouseout",
        handleMouseOut
      );

      const unregisterMouseClick = registerMarkerListener(
        props.google,
        marker.marker,
        "click",
        handleMouseClick
      );

      return () => {
        unregisterMouseOver();
        unregisterMouseOut();
        unregisterMouseClick();
      };
    }
  }, [marker.marker]);
  return null;
};

const Map = (props) => {
  const ref = useRef(null);
  const [googleMap, setGoogleMap] = useState(null);
  useEffect(() => {
    if (ref.current && googleMap === null && props.google !== null) {
      // set google map
      setGoogleMap(new props.google.maps.Map(ref.current, defaultMapOptions));
    }
  }, [ref, props.google, googleMap]);
  return (
    <div ref={ref} style={{ width: "100vw", height: "100vh" }}>
      {props.weatherList?.map((weatherData, index) => (
        <Marker
          key={index}
          google={props.google}
          map={googleMap}
          data={weatherData}
        />
      ))}
    </div>
  );
};

const MapView = (props) => {
  const [google, setGoogle] = useState(null);
  useEffect(() => {
    // initial load google
    loader.load().then((google) => {
      setGoogle(google);
    });
  }, []);

  return <Map google={google} weatherList={props.weatherList} />;
};

export default MapView;
