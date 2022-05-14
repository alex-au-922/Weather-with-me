//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import { useState, createContext, useRef } from "react";
import { SuccessModal, ErrorModal } from "../utils/gui/modals";
import { objectSetAll } from "../utils/object";
import { LoadingSpinner } from "../utils/gui/modals";
const FetchStateContext = createContext({});

const FetchStateProvider = (props) => {
  const [fetchState, setFetchState] = useState({
    success: false,
    error: false,
    showLoading: false,
  });
  const fetching = useRef(false);
  const [fetchSuccessMessage, setFetchSuccessMessage] = useState("");
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
  const setOpenSuccessModal = (body) => {
    setFetchSuccessMessage(body);
    const newFetchState = objectSetAll(fetchState, false);
    newFetchState.success = true;
    setFetchState(newFetchState);
  };
  const setOpenErrorModal = (errorType, errorMessage) => {
    setFetchErrorInfo({
      errorType,
      errorMessage,
    });
    const newFetchState = objectSetAll(fetchState, false);
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
    successfulBody = "Successful Fetch",
    parallelFetch = false,
    errorTypeBypass = []
  ) => {
    return async (url, payload) => {
      if (!fetching.current) {
        if (!parallelFetch) fetching.current = true;
        if (showConfig.loading) setShowLoading(true);
        console.log(url, payload);
        const fetchResult = await fetch(url, payload);
        const { success, error, errorType, result } = await fetchResult.json();
        fetching.current = false;
        if (showConfig.loading) setShowLoading(false);
        if (success && showConfig.success) setOpenSuccessModal(successfulBody);
        else if (
          showConfig.error &&
          error &&
          errorTypeBypass.indexOf(errorType) === -1
        )
          setOpenErrorModal(errorType, error);
        return {
          success,
          error,
          errorType,
          result,
          fetching: fetching.current,
        };
      }
      return {
        success: null,
        error: null,
        errorType: null,
        result: null,
        fetching: true,
      };
    };
  };

  return (
    <FetchStateContext.Provider
      value={{
        fetchFactory,
        fetchState,
      }}
    >
      <SuccessModal
        show={fetchState.success}
        onHide={handleSuccessfulClose}
        body={fetchSuccessMessage}
      />
      <ErrorModal
        show={fetchState.error}
        onHide={handleErrorClose}
        errorType={fetchErrorInfo.errorType}
        errorMessage={fetchErrorInfo.errorMessage}
      />
      <LoadingSpinner show={fetching.current}></LoadingSpinner>
      {props.children}
    </FetchStateContext.Provider>
  );
};

export { FetchStateContext, FetchStateProvider };
