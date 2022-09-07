
class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const getStatusCode = (errorName) => {
  switch (errorName) {
    case "TokenExpiredError": {
      return 403
    }
    case "JsonWebTokenError": {
      return 401
    }
    default: {
      return 500;
    }
  }
}

const handleError = (err, res, next) => {
  let { statusCode, message, name } = err;
  if (!statusCode) {
    statusCode = getStatusCode(name)
  }
  try {
    res.statusMessage = message;
    res.status(res.statusCode).send({ msg: res.statusMessage });
    res.end();
  } catch (error) {
    res.statusMessage = "Internal Server Error";
    res.status(statusCode);
    res.end();
  }

};

module.exports = {
  ErrorHandler,
  handleError
}