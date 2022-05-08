class BaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}
class InternalServerError extends BaseError {}
class UsernameError extends BaseError {}
class PasswordError extends BaseError {}
class InvalidRefreshTokenError extends BaseError {}
class InvalidAccessTokenError extends BaseError {}
class RefreshTokenExpiredError extends BaseError {}
class AccessTokenExpiredError extends BaseError {}
class UnauthorizationError extends BaseError {}
class UnknownError extends BaseError {}
class DatabaseError extends BaseError {}
class MethodNotAllowedError extends BaseError {}

module.exports = {
  InternalServerError,
  UsernameError,
  PasswordError,
  InvalidRefreshTokenError,
  InvalidAccessTokenError,
  RefreshTokenExpiredError,
  AccessTokenExpiredError,
  UnauthorizationError,
  UnknownError,
  DatabaseError,
  MethodNotAllowedError,
};
