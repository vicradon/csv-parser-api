const errorHandler = (error, request, response, next) => {
  switch (error.name) {
    case "UnsuppliedParameterError": {
      return response
        .status(400)
        .json({ message: error.message, status: false });
    }
    case "ValidationError": {
      return response
        .status(400)
        .json({ message: error.message, status: false });
    }

    default: {
      return response
        .status(500)
        .json({ message: error.message, status: false });
    }
  }
};

module.exports = {
  errorHandler,
};
