import { useContext, useEffect, useState, useRef } from "react";
import { WeatherWebSocketContext } from "../../../middleware/websocket";
import { registerMessageListener } from "../../../utils/listeners/webSocketMessage";
import parseWeatherDataFrontendView from "../../../utils/data/weather";
import MapView from "./mapView";
import { renderModals } from "./modals";
import { WeatherUserLocationViewModal } from "./modals/weatherUserModal";
import { BACKEND_WEBSERVER_HOST } from "../../../frontendConfig";
import { FetchStateContext } from "../../../middleware/fetch";
import DropDownButton from "../../../utils/gui/dropDown";
import ResourceManagementTable from "../../../utils/gui/resourceManageSystem/table";
import SwitchComponents from "../switchView";

const UserView = (props) => {
  const { username, favouriteLocation } = props.user;
  const [dataLists, setDataLists] = useState({
    weather: null,
    favourite: null,
  });
  const [showDataList, setShowDataList] = useState(null);
  const [view, setView] = useState("Map");
  const { fetchFactory } = useContext(FetchStateContext);
  const dataFetch = fetchFactory({
    loading: false,
    success: false,
    error: false,
  });
  const { webSocket: weatherWebSocket } = useContext(WeatherWebSocketContext);
  const handleViewSelect = (event) => {
    setView(event);
  };
  const switchViewOptions = {
    handleSelect: handleViewSelect,
    buttonName: view,
    options: ["Map", "Table", "Favourite"],
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

  useEffect(() => {
    if (props.showFavourite) {
      const newShowDataList = dataLists.weather?.filter(
        (weather) => favouriteLocation.indexOf(weather.name) !== -1
      );
      setShowDataList(newShowDataList);
    } else {
      setShowDataList(dataLists.weather);
    }
  }, [favouriteLocation, props.showFavourite, dataLists]);

  const renderWeatherModal = renderModals(WeatherUserLocationViewModal);

  const updateWeatherData = (resultJson) => {
    const newWeatherList = parseWeatherDataFrontendView(resultJson);
    setDataLists({
      ...dataLists,
      weather: newWeatherList,
      favourite: newWeatherList.filter(
        (weather) => favouriteLocation.indexOf(weather.name) !== -1
      ),
    });
  };

  return (
    <SwitchComponents active={view}>
      <MapView
        name="Map"
        weatherList={dataLists.weather}
        showFavourite={props.showFavourite}
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
      <ResourceManagementTable
        name="Table"
        dataUniqueKey={"name"}
        dataList={showDataList}
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
      <ResourceManagementTable
        name="Favourite"
        dataUniqueKey={"name"}
        dataList={dataLists.favourite}
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
    </SwitchComponents>
  );
};

export default UserView;
