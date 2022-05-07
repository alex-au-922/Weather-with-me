import { useState, useContext, useEffect } from "react";
import {
  UserWebSocketContext,
  WeatherWebSocketContext,
} from "../../../middleware/websocket";
import { BACKEND_WEBSERVER_HOST } from "../../../frontendConfig";
import parseUserDataFrontendView from "../../../utils/data/user";
import parseWeatherDataFrontendView from "../../../utils/data/weather";
import { registerMessageListener } from "../../../utils/listeners/webSocketMessage";
import { renderModals } from "./modals";
import { UserDataFormModal, userModalOptions } from "./modals/userAdminModal";
import {
  WeatherDataFormModal,
  weatherModalOptions,
} from "./modals/weatherAdminModal";
import DropDownButton from "../../../utils/gui/dropDown";
import ResourceManagementTable from "../../../utils/gui/resourceManageSystem/table";

// a component that fetchs all the user and weather data at the top level
// then pass the data to the lower level view
// listen to update of user and weather data on respective websockets
const AdminView = (props) => {
  const [dataLists, setDataLists] = useState({
    User: null,
    Weather: null,
  });
  const [view, setView] = useState("User");
  const { username } = props.user;
  const { webSocket: userWebSocket } = useContext(UserWebSocketContext);
  const { webSocket: weatherWebSocket } = useContext(WeatherWebSocketContext);
  const handleViewSelect = (event) => setView(event);

  const switchViewOptions = {
    handleSelect: handleViewSelect,
    buttonName: view,
    options: Object.keys(dataLists),
  };

  const renderSwitchView = (switchViewOptions) => {
    if (switchViewOptions !== undefined && switchViewOptions !== null) {
      return <DropDownButton {...switchViewOptions} />;
    }
  };

  const renderUserModal = renderModals(UserDataFormModal);
  const renderWeatherModal = renderModals(WeatherDataFormModal);

  const updateUserData = (resultJson) => {
    const newUserList = parseUserDataFrontendView(resultJson);
    setDataLists((dataLists) => {
      return { ...dataLists, User: newUserList };
    });
  };

  const updateWeatherData = (resultJson) => {
    const newWeatherList = parseWeatherDataFrontendView(resultJson);
    setDataLists((dataLists) => {
      return { ...dataLists, Weather: newWeatherList };
    });
  };

  useEffect(() => {
    //initial fetch user data
    (async () => {
      const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/admin/users`;
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
      {view === "User" ? (
        <ResourceManagementTable
          key="user"
          dataList={dataLists.User}
          switchViewOptions={switchViewOptions}
          renderSwitchView={renderSwitchView}
          modalConfig={userModalOptions}
          renderModals={renderUserModal}
          options={["username", "email", "viewMode"]}
        />
      ) : (
        <ResourceManagementTable
          key="weather"
          dataList={dataLists.Weather}
          switchViewOptions={switchViewOptions}
          renderSwitchView={renderSwitchView}
          modalConfig={weatherModalOptions}
          renderModals={renderWeatherModal}
          options={["name", "latitude", "longitude"]}
          optionsType={{ name: String, latitude: Number, longitude: Number }}
        />
      )}{" "}
    </>
  );
};

export default AdminView;
