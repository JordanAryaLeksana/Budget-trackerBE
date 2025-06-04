const HttpError = require("./HttpError");


class ForbiddedError extends HttpError {
  constructor(message) {
    super(message, 403);
    this.name = "ForbiddedError";
  }
}

module.exports = ForbiddedError;