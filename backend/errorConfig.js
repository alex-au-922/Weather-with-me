class BaseError extends Error {
  constructor(message, ip) {
    super(message);
    this.name = this.constructor.name;
    this.ip = ip;
  }
}
class InternalServerError extends BaseError {}
class UsernameError extends BaseError {}
class PasswordError extends BaseError {}
class EmailError extends BaseError {}
class LocationNameError extends BaseError {}
class ValueError extends BaseError {}
class InvalidRefreshTokenError extends BaseError {}
class InvalidAccessTokenError extends BaseError {}
class RefreshTokenExpiredError extends BaseError {}
class AccessTokenExpiredError extends BaseError {}
class UnauthorizationError extends BaseError {}
class UnknownError extends BaseError {}
class DatabaseError extends BaseError {}
class NotFoundError extends BaseError {}

module.exports = {
  InternalServerError,
  UsernameError,
  PasswordError,
  EmailError,
  InvalidRefreshTokenError,
  InvalidAccessTokenError,
  RefreshTokenExpiredError,
  AccessTokenExpiredError,
  UnauthorizationError,
  UnknownError,
  LocationNameError,
  ValueError,
  DatabaseError,
  NotFoundError,
};
