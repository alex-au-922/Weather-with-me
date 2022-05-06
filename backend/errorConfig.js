class InternalServerError extends Error { }
class UsernameError extends Error { }
class PasswordError extends Error { }
class InvalidRefreshTokenError extends Error { }
class InvalidAccessTokenError extends Error { }
class UnauthorizationError extends Error { }
class UnknownError extends Error { }
class DatabaseError extends Error { }

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
