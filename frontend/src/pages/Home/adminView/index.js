import { useState, useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import AdminUserView from "./userView";
import AdminWeatherView from "./weatherView";
import {
  UserWebSocketContext,
  WeatherWebSocketContext,
} from "../../../middleware/websocket";
import { BACKEND_WEBSERVER_HOST } from "../../../frontendConfig";
import parseUserDataFrontendView from "../../../utils/data/user";
import parseWeatherDataFrontendView from "../../../utils/data/weather";
import { registerMessageListener } from "../../../utils/websocket/listener";
import DropDownButton from "../../../utils/gui/dropDown";

// a component that fetchs all the user and weather data at the top level
// then pass the data to the lower level view
// listen to update of user and weather data on respective websockets
const AdminView = (props) => {
  const [view, setView] = useState("User");
  const [userList, setUserList] = useState();
  const [weatherList, setWeatherList] = useState();
  const { username, email, logout } = props;
  const { webSocket: userWebSocket } = useContext(UserWebSocketContext);
  const { webSocket: weatherWebSocket } = useContext(WeatherWebSocketContext);
  const handleViewSelect = (event) => setView(event);

  const updateUserData = (resultJson) => {
    const newUserList = parseUserDataFrontendView(resultJson);
    setUserList(newUserList);
  };

  const updateWeatherData = (resultJson) => {
    const newWeatherList = parseWeatherDataFrontendView(resultJson);
    setWeatherList(newWeatherList);
  };

  useEffect(() => {
    //initial fetch user data
    (async () => {
      const url = `${BACKEND_WEBSERVER_HOST}/user/all`;
      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
      };
      const fetchResult = await fetch(url, payload);
      const { success, result } = await fetchResult.json();
      if (success) updateUserData(result);
    })();
  }, []);

  useEffect(() => {
    //user data update
    const handler = (event) => {
      const { success, result } = JSON.parse(event.data);
      if (success) updateUserData(result);
    };
    return registerMessageListener(userWebSocket, handler);
  }, [userWebSocket]);

  useEffect(() => {
    //initial fetch weather data
    (async () => {
      const url = `${BACKEND_WEBSERVER_HOST}/weather/all`;
      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
      };
      const fetchResult = await fetch(url, payload);
      const { success, result } = await fetchResult.json();
      if (success) updateWeatherData(result);
    })();
  }, []);

  useEffect(() => {
    //weather data update
    const handler = (event) => {
      const { success, result } = JSON.parse(event.data);
      if (success) updateWeatherData(result);
    };
    return registerMessageListener(weatherWebSocket, handler);
  }, [weatherWebSocket]);

  return (
    <>
      <DropDownButton
        handleSelect={handleViewSelect}
        buttonName={view}
        options={["User", "Weather"]}
      />
      {view === "User" ? (
        <AdminUserView dataList={userList} />
      ) : (
        <AdminWeatherView dataList={weatherList} />
      )}{" "}
    </>
  );
};

export default AdminView;
