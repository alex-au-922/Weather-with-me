class BaseError {
  constructor(errorMessage) {
    this.message = errorMessage;
    this.name = this.constructor.name;
  }
}

class InternalServerError extends BaseError {}
class UsernameError extends BaseError {}
class PasswordError extends BaseError {}
class InvalidRefreshTokenError extends BaseError {}
class InvalidAccessTokenError extends BaseError {}
class UnauthorizationError extends BaseError {}
class UnknownError extends BaseError {}
class DatabaseError extends BaseError {}

module.exports = {
  InternalServerError,
  UsernameError,
  PasswordError,
  InvalidRefreshTokenError,
  InvalidAccessTokenError,
  UnauthorizationError,
  UnknownError,
  DatabaseError,
};
