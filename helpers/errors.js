class UnsuppliedParameterError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnsuppliedParameterError";
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

module.exports = {
  UnsuppliedParameterError,
  ValidationError,
};
