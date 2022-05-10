import React, { useEffect, useState, useRef, useContext } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { registerMarkerListener } from "../../../utils/listeners/googleMapMarkerListener";
import TableTitleBar from "../../../utils/gui/resourceManageSystem/tableTitleBar";
import GOOGLE_API_KEY from "../../../keys/googleAPI";
import { objectEqual } from "../../../utils/object";
import TimeSeries from "./plotGraph";

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
            props.data.longitude,
            props.data.latitude
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
    if (props.visible) {
      if (marker.marker) {
        marker.marker.setMap(props.googleMap);
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
          console.log("remove!");
          unregisterMouseOver();
          unregisterMouseOut();
          unregisterMouseClick();
        };
      }
    } else {
      console.log("remove due to visibility!");
      marker.marker?.setMap(null);
    }
  }, [marker.marker, props.visible]);
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
    return () => console.log("removed map!");
  }, [ref, props.google, googleMap]);
  return (
    <div ref={ref} style={{ width: "100vw", height: "100vh" }}>
      {props.weatherList?.map((weatherData) => (
        <Marker
          google={props.google}
          googleMap={googleMap}
          key={weatherData.name}
          data={weatherData}
          visible={props.filteredWeatherList?.reduce(
            (prevBool, currWeatherData) =>
              objectEqual(currWeatherData, weatherData) || prevBool,
            false
          )}
        />
      ))}
    </div>
  );
};

const MapView = (props) => {
  const [filteredWeatherList, setFilteredWeatherList] = useState(
    props.weatherList
  );
  const [google, setGoogle] = useState(null);
  useEffect(() => {
    // initial load google
    loader.load().then((google) => {
      setGoogle(google);
    });
  }, []);

  return (
    <>
      <TimeSeries/>
      <TableTitleBar
        dataList={props.weatherList}
        filteredDataList={filteredWeatherList}
        setFilteredDataList={setFilteredWeatherList}
        options={props.options}
        optionsType={
          props.optionsType &&
          props.options.reduce(
            (obj, key) => ((obj[key] = props.optionsType[key]), obj),
            {}
          )
        }
        optionsAllowedTypes={[String]}
        switchViewOptions={props.switchViewOptions}
        renderSwitchView={props.renderSwitchView}
      />
      <Map
        google={google}
        weatherList={props.weatherList}
        filteredWeatherList={filteredWeatherList}
      />
    </>
  );
};

export default MapView;
