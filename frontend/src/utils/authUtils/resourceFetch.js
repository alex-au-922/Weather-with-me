//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import tokensRefresh from "./tokenRefresh";

const resourceFetch = async (fetchFunction, ...fetchParams) => {
  const response = {
    success: false,
    result: null,
    error: null,
    errorType: null,
    invalidated: false,
    fetching: false,
  };
  try {
    const {
      success: fetchSuccess,
      errorType: fetchErrorType,
      error: fetchError,
      result: fetchResult,
      fetching: fetchFetching,
    } = await fetchFunction(...fetchParams);

    if (fetchFetching) {
      response.fetching = true;
      return response;
    }

    if (fetchSuccess) {
      response.success = true;
      response.result = fetchResult;
      return response;
    }
    if (fetchErrorType !== "InvalidAccessTokenError") {
      response.error = fetchError;
      response.errorType = fetchErrorType;
      return response;
    }

    const {
      success: tokensRefreshSuccess,
      error: tokensRefreshError,
      errorType: tokenRefreshErrorType,
      accessToken: refreshedAccessToken,
      fetching: tokenFetching,
    } = await tokensRefresh(fetchFunction);

    if (tokenFetching) {
      response.fetching = true;
      return response;
    }

    if (!tokensRefreshSuccess) {
      response.error = tokensRefreshError;
      response.errorType = tokenRefreshErrorType;
      if (tokenRefreshErrorType === "InvalidRefreshTokenError") {
        response.invalidated = true;
      }
      return response;
    }

    fetchParams[1].headers.authorization = refreshedAccessToken;

    const {
      fetching: newFetchFetching,
      success: newFetchSuccess,
      error: newFetchError,
      errorType: newFetchErrorType,
      result: newFetchResult,
    } = await fetchFunction(...fetchParams);

    if (newFetchFetching) {
      response.fetching = true;
      return response;
    }

    if (newFetchSuccess) {
      response.success = true;
      response.result = newFetchResult;
      return response;
    }

    if (!newFetchSuccess) {
      response.error = newFetchError;
      response.errorType = newFetchErrorType;
      if (tokenRefreshErrorType === "InvalidRefreshTokenError") {
        response.invalidated = true;
      }
      return response;
    }
  } catch (error) {
    response.error = error;
    response.errorType = "UnknownError";
    return response;
  }
};

export default resourceFetch;
