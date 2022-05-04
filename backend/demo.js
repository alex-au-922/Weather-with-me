class BasicError {
  constructor(errorMessage) {
    this.message = errorMessage;
    this.name = this.constructor.name;
  }
}

class DatabaseEntryNotFoundError extends BasicError {}
class NotAllowedError extends BasicError {}
class UnknownError extends BasicError {}

const asyncApiDecorator = (func) => {
  const wrapperFunc = async (...params) => {
    const response = {
      success: false,
      error: null,
      errorType: null,
      result: null,
    };
    try {
      response.result = await func(...params);
      response.success = true;
    } catch (error) {
      response.error = error.message;
      response.errorType = error.name;
    } finally {
      return response;
    }
  };
  return wrapperFunc;
};

const checkDB = async () => {
  const result = await asyncApiDecorator(async () => {
    throw new ReferenceError("Unknown error occurs!");
  })();
  console.log(JSON.stringify(result));
};

checkDB();
