import { useState, useContext, useEffect } from "react";
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
  BlankLogDataFormModal,
  LogAdminDataFormModal,
  logModalOptions,
} from "./modals/logAdminModal";
import SwitchComponents from "../switchView";
import DropDownButton from "../../../utils/gui/dropDown";
import CreateButton from "../../../utils/gui/create";
import parseCommentDataFrontendView from "../../../utils/data/comments";
import ResourceManagementTable from "../../../utils/gui/resourceManageSystem/table";
import { WebSocketContext } from "../../../middleware/websocket";

// a component that fetchs all the user and weather data at the top level
// then pass the data to the lower level view
// listen to update of user and weather data on respective websockets
const AdminView = (props) => {
  const [dataLists, setDataLists] = useState({
    User: null,
    Location: null,
    Log: null,
  });
  const [table, setTable] = useState("User");
  const { username } = props.user;
  const { webSocket } = useContext(WebSocketContext);
  const { fetchFactory } = useContext(FetchStateContext);
  const dataFetch = fetchFactory(
    {
      success: false,
      error: true,
      loading: false,
    },
    null,
    true
  );

  const handleTableSelect = (event) => setTable(event);
  const switchViewOptions = {
    handleSelect: handleTableSelect,
    buttonName: table,
    options: Object.keys(dataLists),
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

  const addLogButtonOptions = {
    renderModal: renderModals(BlankLogDataFormModal),
    data: { method: "", userAgent: "", date: "", ip: "" },
    modalConfigs: logModalOptions,
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
    setDataLists((dataLists) => {
      return { ...dataLists, User: newUserList };
    });
  };

  const updateWeatherData = (weatherJson, commentJson) => {
    const newWeatherList = parseWeatherDataFrontendView(
      weatherJson,
      commentJson
    );
    setDataLists((dataLists) => {
      return { ...dataLists, Location: newWeatherList };
    });
  };

  const updateLogData = (resultJson) => {
    const newLogList = parseLogDataFrontendView(resultJson);
    setDataLists((dataLists) => {
      return { ...dataLists, Log: newLogList };
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
      const { success, result, fetching } = await dataFetch(url, payload);
      if (success && !fetching) updateUserData(result);
    })();
  }, []);

  useEffect(() => {
    //user data update
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
    if (success && !fetching) return result;
  };

  const mergeWeather = async () => {
    const weatherJson = await fetchWeatherData();
    const commentJson = await fetchComments();
    if (weatherJson !== undefined && commentJson !== undefined)
      updateWeatherData(weatherJson, commentJson);
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
    <SwitchComponents active={table}>
      <ResourceManagementTable
        key="user"
        name="User"
        dataUniqueKey={"username"}
        dataList={dataLists.User}
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
        dataList={dataLists.Location}
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
        dataList={dataLists.Log}
        switchViewOptions={switchViewOptions}
        renderSwitchView={renderSwitchView}
        modalConfig={logModalOptions}
        renderModals={renderLogModal}
        options={["method", "userAgent", "date", "ip"]}
        optionsType={{
          name: String,
          userAgent: String,
          date: String,
          ip: String,
        }}
        renderAddButton={renderAddButton}
        addButtonOptions={addLogButtonOptions}
      />
    </SwitchComponents>
  );
};

export default AdminView;
