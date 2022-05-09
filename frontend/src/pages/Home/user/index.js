import { useContext, useEffect, useState } from "react";
import {
  WeatherWebSocketContext,
  UserWebSocketContext,
} from "../../../middleware/websocket";
import { registerMessageListener } from "../../../utils/listeners/webSocketMessage";
import parseWeatherDataFrontendView from "../../../utils/data/weather";
import MapView from "./mapView";
import { renderModals } from "../admin/modals";
import { BACKEND_WEBSERVER_HOST } from "../../../frontendConfig";
import { FetchStateContext } from "../../../middleware/fetch";
import DropDownButton from "../../../utils/gui/dropDown";
import { WeatherAdminDataFormModal, weatherModalOptions } from "../admin/modals/weatherAdminModal";
import ResourceManagementTable from "../../../utils/gui/resourceManageSystem/table";

const UserView = (props) => {
  const { username } = props.user;
  const [dataLists, setDataLists] = useState({
    Weather: null,
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

  const handleViewSelect = (event) => {setView(event)};
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

  const renderWeatherModal = renderModals(WeatherAdminDataFormModal);

  useEffect(() => {
    const handler = (event) => {
      const result = JSON.parse(event.data);
      updateWeatherData(result);
    };
    return registerMessageListener(weatherWebSocket, handler);
  }, [weatherWebSocket]);

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
      const { success, result, fetching } = await dataFetch(url, payload);
      if (success && !fetching) updateWeatherData(result);
    })();
  }, []);

  const updateWeatherData = (resultJson) => {
    const newWeatherList = parseWeatherDataFrontendView(resultJson);
    setDataLists((dataLists) => {
      return { ...dataLists, Weather: newWeatherList };
    });
  };

  const checkDataList = () => {
    console.log(dataLists.Weather);
  }

  return (
    <>
      { view == "Map" ? (<MapView
        weatherList={weatherList}
        switchViewOptions={switchViewOptions}
        renderSwitchView={renderSwitchView}
        options={[
          "name",
          "latitude",
          "longitude",
          "temperature",
          "relativeHumidity",
          "tenMinMaxGust",
          "TenMinMeanWindDir",
          "TenMinMeanWindSpeed",
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
      />) : (
        <>
        <h1 onClick={checkDataList}>Hello!</h1>
        <ResourceManagementTable
          key="weather"
          dataUniqueKey={"name"}
          dataList={dataLists.Weather}
          switchViewOptions={switchViewOptions}
          renderSwitchView={renderSwitchView}
          modalConfig={weatherModalOptions}
          renderModals={renderWeatherModal}
          options={[
            "name",
            "latitude",
            "longitude",
            "temperature",
            "relativeHumidity",
            "tenMinMaxGust",
            "TenMinMeanWindDir",
            "TenMinMeanWindSpeed",
            "time"
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
          }} />
        </>
      )
      
      }
    </>
  );
};

export default UserView;
