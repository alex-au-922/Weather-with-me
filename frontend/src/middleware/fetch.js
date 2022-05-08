import { useState, createContext, useRef } from "react";
import ErrorModal from "../utils/gui/modals/errorModal.js";
import SuccessfulModal from "../utils/gui/modals/successfulModal.js";
import LoadingModal from "../utils/gui/modals/loadingModal.js";
import setAll from "../utils/setAll";
const FetchStateContext = createContext({});

const FetchStateProvider = (props) => {
  const [fetchState, setFetchState] = useState({
    success: false,
    error: false,
    showLoading: false,
  });
  const fetching = useRef(false);
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
  const setShowLoading = (showLoadingState) => {
    setFetchState({
      ...fetchState,
      showLoading: showLoadingState,
    });
  };

  const fetchFactory = (
    showConfig = {
      loading: true,
      success: true,
      error: true,
    },
    successMessage = {
      title: "Success",
      body: "Successful Fetch",
    }
  ) => {
    return async (url, payload) => {
      if (!fetching.current) {
        fetching.current = true;
        if (showConfig.loading) setShowLoading(true);
        const fetchResult = await fetch(url, payload);
        const { success, error, errorType, result } = await fetchResult.json();
        fetching.current = false;
        if (showConfig.loading) setShowLoading(false);
        if (success && showConfig.success)
          setOpenSuccessModal(successMessage.title, successMessage.body);
        else if (showConfig.error && error) setOpenErrorModal(errorType, error);
        return { success, error, errorType, result };
      }
    };
  };

  return (
    <FetchStateProvider.Provider
      value={{
        fetchFactory,
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
    </FetchStateProvider.Provider>
  );
};

export { FetchStateContext, FetchStateProvider };
