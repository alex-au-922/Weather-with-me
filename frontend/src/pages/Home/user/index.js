import { useContext, useEffect, useState, useRef } from "react";
import {
  WeatherWebSocketContext,
  UserWebSocketContext,
} from "../../../middleware/websocket";
import { registerMessageListener } from "../../../utils/listeners/webSocketMessage";
import parseWeatherDataFrontendView from "../../../utils/data/weather";
import MapView from "./mapView";
import { renderModals } from "./modals";
import { WeatherUserLocationViewModal } from "./modals/weatherUserModal";
import { BACKEND_WEBSERVER_HOST } from "../../../frontendConfig";
import { FetchStateContext } from "../../../middleware/fetch";
import DropDownButton from "../../../utils/gui/dropDown";
import ResourceManagementTable from "../../../utils/gui/resourceManageSystem/table";
import parseCommentDataFrontendView from "../../../utils/data/comments";

const UserView = (props) => {
  const { username } = props.user;
  const [dataLists, setDataLists] = useState({
    Weather: null
  });
  const [view, setView] = useState("Map");
  const [weatherList, setWeatherList] = useState();
  const { fetchFactory } = useContext(FetchStateContext);
  const dataFetch = fetchFactory({
    loading: false,
    success: false,
    error: false,
  });
  const { webSocket: userWebSocket } = useContext(UserWebSocketContext);
  const { webSocket: weatherWebSocket } = useContext(WeatherWebSocketContext);
  const handleViewSelect = (event) => {
    setView(event);
  };
  const switchViewOptions = {
    handleSelect: handleViewSelect,
    buttonName: view,
    options: ["Map", "Table"],
  };

  const renderSwitchView = (switchViewOptions) => {
    if (switchViewOptions !== undefined && switchViewOptions !== null) {
      return <DropDownButton {...switchViewOptions} />;
    }
  };

  useEffect(() => {
    const handler = (event) => {
      const result = JSON.parse(event.data);
      updateWeatherData(result);
    };
    return registerMessageListener(weatherWebSocket, handler);
  }, [weatherWebSocket]);

  const fetchComments = async() => {
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/user/comment`;
    const payload = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("accessToken"),
        username: username,
      }
    };
    const { success, result, fetching } = await dataFetch(url, payload);
    if (success && !fetching) return parseCommentDataFrontendView(result);
  };

  const fetchWeatherData = async () => {
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/user/weathers`;
    const payload = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("accessToken"),
        username,
      },
    };
    const { success, result, fetching } = await dataFetch(url, payload);
    if (success && !fetching) return result;
  };

  const mergeWeather = async() => {
    const weatherJson = await fetchWeatherData();
    const commentJson = await fetchComments();
    if (weatherJson !== undefined && commentJson !== undefined) updateWeatherData(weatherJson, commentJson);
  }

  const updateWeatherData = (weatherJson, commentJson) => {
    const newWeatherList = parseWeatherDataFrontendView(weatherJson, commentJson);
    setWeatherList(newWeatherList);
    setDataLists((dataLists) => {
      return { ...dataLists, Weather: newWeatherList };
    });
  };

  useEffect(() => {
    //initial fetch weather data
    (async() => {
      await mergeWeather();
    })();
  }, []);

  const renderWeatherModal = renderModals(WeatherUserLocationViewModal);

  return (
    <>
      {view === "Map" ? (
        <MapView
          weatherList={weatherList}
          switchViewOptions={switchViewOptions}
          renderModals={renderWeatherModal}
          renderSwitchView={renderSwitchView}
          options={[
            "name",
            "latitude",
            "longitude",
            "temperature",
            "relativeHumidity",
            "tenMinMaxGust",
            "tenMinMeanWindDir",
            "tenMinMeanWindSpeed",
            "time",
          ]}
          optionsType={{
            name: String,
            latitude: Number,
            longitude: Number,
            temperature: Number,
            relativeHumidity: Number,
            tenMinMaxGust: Number,
            tenMinMeanWindDir: String,
            tenMinMeanWindSpeed: Number,
            time: String,
          }}
        />
      ) : (
        <>
          <ResourceManagementTable
            key="weather"
            dataUniqueKey={"name"}
            dataList={dataLists.Weather}
            switchViewOptions={switchViewOptions}
            renderSwitchView={renderSwitchView}
            // modalConfig={weatherModalOptions}
            renderModals={renderWeatherModal}
            options={[
              "name",
              "latitude",
              "longitude",
              "temperature",
              "relativeHumidity",
              "tenMinMaxGust",
              "tenMinMeanWindDir",
              "tenMinMeanWindSpeed",
              "time",
            ]}
            optionsType={{
              name: String,
              latitude: Number,
              longitude: Number,
              temperature: Number,
              relativeHumidity: Number,
              tenMinMaxGust: Number,
              tenMinMeanWindDir: String,
              tenMinMeanWindSpeed: Number,
              time: String,
            }}
          />
        </>
      )}
    </>
  );
};

export default UserView;
