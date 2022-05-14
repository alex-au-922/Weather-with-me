import React, { useEffect, useState, useRef, useContext } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { registerMarkerListener } from "../../../../utils/listeners/googleMapMarkerListener";
import GOOGLE_API_KEY from "../../../../keys/googleAPI";

const loader = new Loader({
  apiKey: GOOGLE_API_KEY,
  version: "weekly",
});

const WeatherContent = (weatherData) => {
  return `<ul style = "list-style: none;">
        <li>Location: ${weatherData.name}</li>
        <li>Temperature: ${
          weatherData.temperature == null
            ? null
            : weatherData.temperature + "°C"
        }</li>
        <li>Relative Humidity: ${
          weatherData.relativeHumidity == null
            ? null
            : weatherData.relativeHumidity + "%"
        }</li>
        <li>10-min maximum gust: ${
          weatherData.tenMinMaxGust == null
            ? null
            : weatherData.tenMinMaxGust + " km/h"
        }</li>
        <li>10-min mean wind speed: ${
          weatherData.tenMinMeanWindSpeed == null
            ? null
            : weatherData.tenMinMeanWindSpeed + " km/h"
        }</li>
        <li>10-min mean wind direction: ${weatherData.tenMinMeanWindDir}</li>
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
    infoWindow.infoWindow.open(props.googleMap, marker.marker);
  };

  const handleMouseOut = () => {
    infoWindow.infoWindow.close(props.googleMap, marker.marker);
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
            props.data.latitude,
            props.data.longitude
          ),
          visible: props.visible,
          optimized: false,
        },
      });
    }
  }, [props.google, props.data]);
  useEffect(() => {
    if (props.visible) {
      if (props.googleMap !== null && marker.option) {
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
    }
  }, [props.googleMap, marker.option, props.visible]);

  useEffect(() => {
    if (marker.marker) {
      marker.marker.setMap(props.googleMap);
      infoWindow.infoWindow.setContent(infoWindow.content);
      infoWindow.infoWindow.open(props.googleMap, marker.marker);
    }
  }, [marker.marker, props.visible]);
  return null;
};

const Map = (props) => {
  const ref = useRef(null);
  const [googleMap, setGoogleMap] = useState(null);
  useEffect(() => {
    if (ref.current && googleMap === null && props.google !== null) {
      const defaultMapOptions = {
        center: {
          lat: props.weatherData.latitude,
          lng: props.weatherData.longitude,
        },
        zoom: 17,
      };
      setGoogleMap(new props.google.maps.Map(ref.current, defaultMapOptions));
    }
    return () => console.log("removed map!");
  }, [ref, props.google, googleMap]);
  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      {
        <Marker
          google={props.google}
          googleMap={googleMap}
          key={props.weatherData.name}
          data={props.weatherData}
          visible={true}
        />
      }
    </div>
  );
};

const LocationMapView = (props) => {
  const [google, setGoogle] = useState(null);
  useEffect(() => {
    // initial load google
    loader.load().then((google) => {
      setGoogle(google);
    });
  }, []);

  return (
    <>
      <Map google={google} weatherData={props.weatherData} />
    </>
  );
};

export default LocationMapView;
