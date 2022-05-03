import tokensRefresh from "./tokenRefresh";

const resourceFetch = async (...fetchParams) => {
  const response = {
    success: false,
    result: null,
    error: null,
    errorType: null,
    invalidated: false,
  };
  try {
    const result = await fetch(...fetchParams);
    const {
      success: fetchSuccess,
      errorType: fetchErrorType,
      error: fetchError,
      result: fetchResult,
    } = await result.json();

    if (fetchSuccess) {
      response.success = true;
      response.result = fetchResult;
      return response;
    }
    if (fetchErrorType !== "ACCESS_TOKEN_EXPIRED_ERROR") {
      response.error = fetchError;
      response.errorType = fetchErrorType;
      return response;
    }

    const {
      success: tokensRefreshSuccess,
      error: tokensRefreshError,
      errorType: tokenRefreshErrorType,
    } = await tokensRefresh();

    if (!tokensRefreshSuccess) {
      response.error = tokensRefreshError;
      response.errorType = tokenRefreshErrorType;
      if (tokenRefreshErrorType === "INVALID_TOKEN_ERROR") {
        response.invalidated = true;
      }
      return response;
    }
    const newResult = await fetch(...fetchParams);
    return await newResult.json();
  } catch (error) {
    response.error = error;
    response.errorType = "UNKNOWN_ERROR";
    return response;
  }
};

export default resourceFetch;
