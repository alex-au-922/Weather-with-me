import { useContext, useEffect, useState, useRef } from "react";
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
import parseCommentDataFrontendView from "../../../utils/data/comments";
import { WebSocketContext } from "../../../middleware/websocket";

const UserView = (props) => {
  const { username, favouriteLocation } = props.user;
  const [dataLists, setDataLists] = useState({
    favourite: null,
    weather: null,
  });
  const [showDataList, setShowDataList] = useState(null);
  const [view, setView] = useState("Map");
  const { fetchFactory } = useContext(FetchStateContext);
  const dataFetch = fetchFactory(
    {
      loading: false,
      success: false,
      error: false,
    },
    null,
    true
  );
  const { webSocket } = useContext(WebSocketContext);
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
      console.log(JSON.parse(event.data));
    };
    return registerMessageListener(webSocket, handler);
  }, [webSocket]);

  const fetchComments = async () => {
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/user/comment`;
    const payload = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("accessToken"),
        username: username,
      },
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

  const mergeWeather = async () => {
    const weatherJson = await fetchWeatherData();
    const commentJson = await fetchComments();
    if (weatherJson !== undefined && commentJson !== undefined)
      updateWeatherData(weatherJson, commentJson);
  };

  const updateWeatherData = (weatherJson, commentJson) => {
    const newWeatherList = parseWeatherDataFrontendView(
      weatherJson,
      commentJson
    );
    setDataLists((dataLists) => {
      return {
        ...dataLists,
        favourite: newWeatherList.filter(
          (weather) => favouriteLocation.indexOf(weather.name) !== -1
        ),
        weather: newWeatherList,
      };
    });
  };

  useEffect(() => {
    //initial fetch weather data
    (async () => {
      await mergeWeather();
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
  }, [dataLists.weather, props.showFavourite, favouriteLocation]);

  const renderWeatherModal = renderModals(WeatherUserLocationViewModal);

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
