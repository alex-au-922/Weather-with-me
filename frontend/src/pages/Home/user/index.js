import {
  useContext,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
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
  const [favouriteDataList, setFavouriteDataList] = useState(null);
  const [weatherDataList, setWeatherDataList] = useState(null);
  const [bufferWeatherDataList, setBufferWeatherDataList] = useState(null);
  const [bufferCommentDataList, setBufferCommentDataList] = useState(null);
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
    if (weatherDataList !== null) {
      setFavouriteDataList(
        weatherDataList.filter(
          (weather) => favouriteLocation.indexOf(weather.name) !== -1
        )
      );
    }
  }, [weatherDataList]);

  useLayoutEffect(() => {
    if (bufferCommentDataList !== null && bufferWeatherDataList !== null) {
      console.log("update weather list now !~");
      const newWeatherDataList = parseWeatherDataFrontendView(
        bufferWeatherDataList,
        bufferCommentDataList
      );
      setWeatherDataList(newWeatherDataList);
    }
  }, [bufferCommentDataList, bufferWeatherDataList]);

  useEffect(() => {
    const commentDataHandler = (newCommentData) => {
      const newCommentJson = {
        ...parseCommentDataFrontendView(newCommentData),
      };
      setBufferCommentDataList(newCommentJson);
      //   updateWeatherData(weatherDataList.current, newCommentJson);
    };
    return registerMessageListener(
      webSocket,
      "updatedCommentData",
      commentDataHandler
    );
  }, [webSocket, bufferCommentDataList]);

  useEffect(() => {
    const weatherDataHandler = (newWeatherData) => {
      const newBufferWeatherDataList = [...newWeatherData];
      setBufferWeatherDataList(newBufferWeatherDataList);
      //   updateWeatherData(newWeatherData, commentDataList.current);
    };
    return registerMessageListener(
      webSocket,
      "updatedWeatherData",
      weatherDataHandler
    );
  }, [webSocket, bufferWeatherDataList]);

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
    if (!fetching) {
      if (success) {
        const commentJson = parseCommentDataFrontendView(result);
        const newCommentJson = { ...commentJson };
        setBufferCommentDataList(newCommentJson);
        return commentJson;
      }
    }
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
    if (success && !fetching) {
      setBufferWeatherDataList(result);
      return result;
    }
  };

  const mergeWeather = async () => {
    const weatherJson = await fetchWeatherData();
    const commentJson = await fetchComments();
    setBufferWeatherDataList(weatherJson);
    setBufferCommentDataList(commentJson);
  };

  useEffect(() => {
    console.log("new weather list", weatherDataList);
  }, [weatherDataList]);

  useEffect(() => {
    //initial fetch weather data
    (async () => {
      await mergeWeather();
    })();
  }, []);

  useEffect(() => {
    console.log("show data list");
    if (props.showFavourite) {
      const newShowDataList = weatherDataList?.filter(
        (weather) => favouriteLocation.indexOf(weather.name) !== -1
      );
      setShowDataList(newShowDataList);
    } else {
      setShowDataList(weatherDataList);
    }
  }, [weatherDataList, props.showFavourite, favouriteLocation]);

  const renderWeatherModal = renderModals(WeatherUserLocationViewModal);

  return (
    <SwitchComponents active={view}>
      <MapView
        name="Map"
        weatherList={weatherDataList}
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
        dataList={favouriteDataList}
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
