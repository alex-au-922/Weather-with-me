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
    } = await tokensRefresh();
    console.log("tokenRefreshSuccess", tokensRefreshSuccess);
    console.log("Refreshing the token due to expired access token!");
    console.log(localStorage.getItem("accessToken"));

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

    console.log("got new fetch!");

    fetchParams.headers.authorization = refreshedAccessToken;
    console.log("token refresh", fetchParams);

    const {
      fetching: newFetchFetching,
      success: newFetchSuccess,
      error: newFetchError,
      errorType: newFetchErrorType,
      result: newFetchResult,
    } = await fetchFunction(...fetchParams);
    console.log(
      newFetchFetching,
      newFetchSuccess,
      newFetchError,
      newFetchErrorType,
      newFetchResult
    );
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
