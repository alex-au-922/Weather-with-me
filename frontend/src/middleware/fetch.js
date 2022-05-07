import { useState, createContext } from "react";
import { ErrorModal } from "../utils/gui/modals/errorModal.js";
import { SuccessfulModal } from "../utils/gui/modals/successfulModal.js";
import { LoadingModal } from "../utils/gui/modals/loadingModal.js";
import setAll from "../utils/setAll";
const StateContext = createContext({});

const StateProvider = (props) => {
  const [fetchState, setFetchState] = useState({
    success: false,
    error: false,
    fetching: false,
  });
  const [fetchSuccessInfo, setFetchSuccessInfo] = useState({
    title: "",
    body: "",
  });
  const [fetchErrorInfo, setFetchErrorInfo] = useState({
    errorType: "",
    errorMessage: "",
  });

  const handleSuccessfulClose = () => {
    setFetchState({
      ...fetchState,
      success: false,
    });
  };
  const handleErrorClose = () => {
    setFetchState({
      ...fetchState,
      error: false,
    });
  };
  const setOpenSuccessModal = (title, body) => {
    setFetchSuccessInfo({
      title,
      body,
    });
    const newFetchState = setAll(fetchState, false);
    newFetchState.success = true;
    setFetchState(newFetchState);
  };
  const setOpenErrorModal = (errorType, errorMessage) => {
    setFetchErrorInfo({
      errorType,
      errorMessage,
    });
    const newFetchState = setAll(fetchState, false);
    newFetchState.error = true;
    setFetchState(newFetchState);
  };

  return (
    <StateContext.Provider
      value={{
        setOpenSuccessModal,
        handleSuccessfulClose,
        setOpenErrorModal,
        handleErrorClose,
      }}
    >
      <SuccessfulModal
        show={fetchState.success}
        onHide={handleSuccessfulClose}
        title={fetchSuccessInfo.title}
        body={fetchSuccessInfo.body}
      />
      <ErrorModal
        show={fetchState.error}
        onHide={handleErrorClose}
        errorType={fetchErrorInfo.errorType}
        errorMessage={fetchErrorInfo.errorMessage}
      />
      <LoadingModal show={fetchState.fetching} />
      {props.children}
    </StateContext.Provider>
  );
};

export { StateContext, StateProvider };
