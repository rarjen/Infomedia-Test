const { STATUS_CODES } = require("http");
// const { constants } = require("http2");
const { StatusCodes } = require("http-status-codes");

class ApiError {
  constructor(code, message, errors = {}) {
    this.code = code;
    this.message = message;
    if (errors) {
      this.errors = errors;
    }
  }

  static badRequest(message) {
    return new ApiError(StatusCodes.BAD_REQUEST, message);
  }

  static unauthorized(message = STATUS_CODES[StatusCodes.UNAUTHORIZED]) {
    return new ApiError(StatusCodes.UNAUTHORIZED, message);
  }

  static forbidden(message = STATUS_CODES[StatusCodes.FORBIDDEN]) {
    return new ApiError(StatusCodes.FORBIDDEN, message);
  }

  static notFound(message = STATUS_CODES[StatusCodes.NOT_FOUND]) {
    return new ApiError(StatusCodes.NOT_FOUND, message);
  }

  static unprocessableEntity(
    message = STATUS_CODES[StatusCodes.UNPROCESSABLE_ENTITY],
    errors = {}
  ) {
    return new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, message, errors);
  }
}

module.exports = ApiError;
