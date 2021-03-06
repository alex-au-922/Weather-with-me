//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import React, { useEffect, useState, useRef, useContext } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { registerMarkerListener } from "../../../utils/listeners/googleMapMarkerListener";
import TableTitleBar from "../../../utils/gui/resourceManageSystem/tableTitleBar";
import GOOGLE_API_KEY from "../../../keys/googleAPI";
import { objectEqual } from "../../../utils/object";
import { AuthContext } from "../../../middleware/auth";
import useForceUpdate from "../../../utils/forceUpdate";

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
        <li>Temperature: ${weatherData.temperature == null ? null : weatherData.temperature + "°C"}</li>
        <li>Relative Humidity: ${weatherData.relativeHumidity == null ? null : weatherData.relativeHumidity + "%"}</li>
        <li>Updated Time: ${weatherData.time}</li>
    </ul>`;
};

const Marker = (props) => {
  const [marker, setMarker] = useState(null);
  const [markerOption, setMarkerOption] = useState(null);
  const [infoWindow, setInfoWindow] = useState({
    infoWindow: null,
    content: null,
  });
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleMouseOver = () => {
    infoWindow.infoWindow.setContent(infoWindow.content);
    infoWindow.infoWindow.open(props.googleMap, marker);
  };

  const handleMouseOut = () => {
    infoWindow.infoWindow.close(props.googleMap, marker);
  };

  useEffect(() => {
    if (props.google !== null && props.data) {
      let visibility;
      if (props.visible && props.isFavourite) visibility = true;
      else if (props.visible && !props.isFavourite && !props.showFavourite)
        visibility = true;
      else visibility = false;
      const newOption = {
        position: new props.google.maps.LatLng(
          props.data.latitude,
          props.data.longitude
        ),
        optimized: false,
        visible: visibility,
      };
      setMarkerOption(newOption);
    }
  }, [
    props.google,
    props.data,
    props.isFavourite,
    props.visible,
    props.showFavourite,
  ]);
  useEffect(() => {
    if (props.googleMap && props.data) {
      if (markerOption?.visible) {
        if (marker === null) {
          setMarker(new props.google.maps.Marker(markerOption));
          setInfoWindow({
            infoWindow: new props.google.maps.InfoWindow(),
            content: WeatherContent(props.data),
          });
        }
      } else {
        marker?.setMap(null);
        setMarker(null);
      }
    }
  }, [props.googleMap, props.data, markerOption]);

  useEffect(() => {
    if (marker) {
      marker.setMap(props.googleMap);
      const unregisterMouseOver = registerMarkerListener(
        props.google,
        marker,
        "mouseover",
        handleMouseOver
      );
      const unregisterMouseOut = registerMarkerListener(
        props.google,
        marker,
        "mouseout",
        handleMouseOut
      );

      const unregisterMouseClick = registerMarkerListener(
        props.google,
        marker,
        "click",
        handleShowModal
      );

      return () => {
        unregisterMouseOver();
        unregisterMouseOut();
        unregisterMouseClick();
      };
    }
  }, [marker]);
  return (
    <>
      {showModal &&
        props.renderModals &&
        props.renderModals(
          props.data,
          null,
          showModal,
          handleCloseModal,
          props.data.name
        )}{" "}
    </>
  );
};

const Map = (props) => {
  const { user } = useContext(AuthContext);
  const ref = useRef(null);
  const [googleMap, setGoogleMap] = useState(null);
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    if (ref.current && googleMap === null && props.google !== null) {
      // set google map
      setGoogleMap(new props.google.maps.Map(ref.current, defaultMapOptions));
    }
  }, [ref, props.google, googleMap]);

  useEffect(() => {
    forceUpdate();
  }, [props.filteredWeatherList]);
  return (
    <div ref={ref} style={{ width: "100vw", height: "100vh" }}>
      {props.weatherList?.map((weatherData) => (
        <Marker
          renderModals={props.renderModals}
          google={props.google}
          googleMap={googleMap}
          key={weatherData.name}
          showFavourite={props.showFavourite}
          isFavourite={user.favouriteLocation.indexOf(weatherData.name) !== -1}
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
        renderModals={props.renderModals}
        showFavourite={props.showFavourite}
        weatherList={props.weatherList}
        filteredWeatherList={filteredWeatherList}
      />
    </>
  );
};

export default MapView;
