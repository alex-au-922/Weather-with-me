import { useState, useContext, useEffect, useLayoutEffect } from "react";
import { FetchStateContext } from "../../../middleware/fetch";
import { BACKEND_WEBSERVER_HOST } from "../../../frontendConfig";
import parseUserDataFrontendView from "../../../utils/data/user";
import parseWeatherDataFrontendView from "../../../utils/data/weather";
import parseLogDataFrontendView from "../../../utils/data/log";
import { registerMessageListener } from "../../../utils/listeners/webSocketMessage";
import { renderModals } from "./modals";
import { ReactComponent as AddIcon } from "./file-earmark-plus.svg";
import {
  UserDataFormModal,
  userModalOptions,
  BlankUserDataFormModal,
} from "./modals/userAdminModal";
import {
  BlankLocationDataFormModal,
  LocationAdminDataFormModal,
  locationModalOptions,
} from "./modals/locationAdminModal";
import {
  LogAdminDataFormModal,
  logModalOptions,
} from "./modals/logAdminModal";
import SwitchComponents from "../switchView";
import DropDownButton from "../../../utils/gui/dropDown";
import CreateButton from "../../../utils/gui/create";
import parseCommentDataFrontendView from "../../../utils/data/comments";
import ResourceManagementTable from "../../../utils/gui/resourceManageSystem/table";
import { WebSocketContext } from "../../../middleware/websocket";
import { AuthContext } from "../../../middleware/auth";
import { FullScreenLoading } from "../../../utils/gui/loading";
// a component that fetchs all the user and weather data at the top level
// then pass the data to the lower level view
// listen to update of user and weather data on respective websockets
const AdminView = (props) => {
  const [rendering, setRendering] = useState(false);
  const [userLists, setUserLists] = useState(null);
  const [locationLists, setLocationLists] = useState(null);
  const [bufferLocationLists, setBufferLocationLists] = useState(null);
  const [logLists, setLogLists] = useState(null);
  const [bufferCommentLists, setBufferCommentLists] = useState(null);
  const [table, setTable] = useState("User");
  const { user } = useContext(AuthContext);
  const { username } = user;
  const { webSocket } = useContext(WebSocketContext);
  const { fetchFactory } = useContext(FetchStateContext);
  const dataFetch = fetchFactory(
    {
      success: false,
      error: true,
      loading: false,
    },
    null,
    true,
    ["InvalidAccessTokenError"]
  );

  const handleTableSelect = (event) => setTable(event);
  const switchViewOptions = {
    handleSelect: handleTableSelect,
    buttonName: table,
    options: ["User", "Location", "Log"],
  };

  const renderSwitchView = (switchViewOptions) => {
    if (switchViewOptions !== undefined && switchViewOptions !== null) {
      return <DropDownButton {...switchViewOptions} />;
    }
  };
  const addUserButtonOptions = {
    renderModal: renderModals(BlankUserDataFormModal),
    data: { username: "", password: "", email: "", viewMode: "default" },
    modalConfigs: userModalOptions,
  };

  const addLocationButtonOptions = {
    renderModal: renderModals(BlankLocationDataFormModal),
    data: { name: "", latitude: "", longitude: "" },
    modalConfigs: locationModalOptions,
  };

  const renderAddButton = (addButtonOptions) => {
    if (addButtonOptions !== undefined && addButtonOptions !== null) {
      return (
        <CreateButton {...addButtonOptions}>
          <AddIcon />
          Create
        </CreateButton>
      );
    }
  };

  const renderUserModal = renderModals(UserDataFormModal);
  const renderWeatherModal = renderModals(LocationAdminDataFormModal);
  const renderLogModal = renderModals(LogAdminDataFormModal);

  const updateUserData = (resultJson) => {
    const newUserList = parseUserDataFrontendView(resultJson);
    setUserLists(newUserList);
  };

  useLayoutEffect(() => {
    if (bufferCommentLists !== null && bufferLocationLists !== null) {
      const newLocationList = parseWeatherDataFrontendView(
        bufferLocationLists,
        bufferCommentLists
      );
      setLocationLists(newLocationList);
    }
  }, [bufferCommentLists, bufferLocationLists]);

  const updateLogData = (resultJson) => {
    const newLogList = parseLogDataFrontendView(resultJson);
    setLogLists(newLogList);
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
      const { success, result, fetching } = await dataFetch(url, payload);
      if (success && !fetching) updateUserData(result);
    })();
  }, []);

  useEffect(() => {
    if (webSocket) {
      const userDataHandler = (newUserData) => {
        updateUserData(newUserData);
      };
      return () =>
        registerMessageListener(webSocket, "updatedUserData", userDataHandler);
    }
  }, [webSocket, userLists]);
  useEffect(() => {
    if (webSocket) {
      const weatherDataHandler = (newWeatherJson) => {
        const newBufferWeatherList = [...newWeatherJson];
        setBufferLocationLists(newBufferWeatherList);
      };
      return registerMessageListener(
        webSocket,
        "updatedWeatherData",
        weatherDataHandler
      );
    }
  }, [webSocket, locationLists]);

  useEffect(() => {
    if (webSocket) {
      const commentDataHandler = (newCommentData) => {
        const newCommentJson = {
          ...parseCommentDataFrontendView(newCommentData),
        };
        setBufferCommentLists(newCommentJson);
      };
      return registerMessageListener(
        webSocket,
        "updatedCommentData",
        commentDataHandler
      );
    }
  }, [webSocket, bufferCommentLists]);

  useEffect(() => {
    if (webSocket) {
      const logDataHandler = (newLogData) => {
        updateLogData(newLogData);
      };
      return registerMessageListener(
        webSocket,
        "updateLogData",
        logDataHandler
      );
    }
  }, [webSocket, logLists]);

  useEffect(() => {
    if (userLists && locationLists && bufferCommentLists && logLists) {
      setRendering(false);
    }
  }, [userLists, locationLists, bufferCommentLists, logLists]);

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
        setBufferCommentLists(newCommentJson);
        return newCommentJson;
      }
    }
  };

  const fetchWeatherData = async () => {
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/admin/locations`;
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
      setBufferLocationLists(result);
      return result;
    }
  };

  const mergeWeather = async () => {
    const weatherJson = await fetchWeatherData();
    const commentJson = await fetchComments();
    if (weatherJson !== undefined) setBufferLocationLists(weatherJson);
    if (commentJson !== undefined) setBufferCommentLists(commentJson);
  };

  useEffect(() => {
    //initial fetch weather data
    (async () => {
      await mergeWeather();
    })();
  }, []);

  useEffect(() => {
    //initial fetch log data
    (async () => {
      const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/admin/logs`;
      const payload = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("accessToken"),
          username,
        },
      };
      const { success, result, fetching } = await dataFetch(url, payload);
      if (success && !fetching) updateLogData(result);
    })();
  }, []);

  return (
    <>
      {rendering ? (
        <FullScreenLoading />
      ) : (
        <SwitchComponents active={table}>
          <ResourceManagementTable
            key="user"
            name="User"
            dataUniqueKey={"username"}
            dataList={userLists}
            switchViewOptions={switchViewOptions}
            renderSwitchView={renderSwitchView}
            modalConfig={userModalOptions}
            renderModals={renderUserModal}
            options={["username", "email", "viewMode"]}
            renderAddButton={renderAddButton}
            addButtonOptions={addUserButtonOptions}
          />
          <ResourceManagementTable
            key="location"
            name="Location"
            dataUniqueKey={"name"}
            dataList={locationLists}
            switchViewOptions={switchViewOptions}
            renderSwitchView={renderSwitchView}
            modalConfig={locationModalOptions}
            renderModals={renderWeatherModal}
            options={["name", "latitude", "longitude"]}
            optionsType={{ name: String, latitude: Number, longitude: Number }}
            renderAddButton={renderAddButton}
            addButtonOptions={addLocationButtonOptions}
          />
          <ResourceManagementTable
            key="log"
            name="Log"
            dataUniqueKey={"_id"}
            dataList={logLists}
            switchViewOptions={switchViewOptions}
            renderSwitchView={renderSwitchView}
            modalConfig={logModalOptions}
            renderModals={renderLogModal}
            options={["api", "method", "userAgent", "date", "ip"]}
            optionsType={{
              api: String,
              method: String,
              userAgent: String,
              date: String,
              ip: String,
            }}
          />
        </SwitchComponents>
      )}
    </>
  );
};

export default AdminView;
