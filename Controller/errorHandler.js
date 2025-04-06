// Error handler middleware
import CustomError from "../utils/customError.js";

const devError = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const prodError = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const castErrorHandler = (err) => {
  const msg = `Invalid value ${err.value} for field ${err.path}`;
  return new CustomError(msg, 400);
};

const duplicateKeyErrorHandler = (err) => {
  const key = Object.keys(err.keyValue)[0]; // Retrieve the duplicate key name
  const value = err.keyValue[key]; // Retrieve the duplicate key value
  const msg = `There is already a ${key} with value "${value}". Please use another ${key}.`;
  return new CustomError(msg, 400); // Changed status code to 400
};


const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map(val => val.message);
  const errorMessage = errors.join('. ');
  const msg = `Invalid input data: ${errorMessage}`;
  return new CustomError(msg, 400);
};

const handleExpireJWT = (err) => {
  return new CustomError('Login Timeout. Please log in again!', 401);
};

const handleJWTError = (err) => {
  return new CustomError('Invalid token. Please log in again.', 401);
};

export default (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV === "development") {
    devError(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === 'CastError') error = castErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);
    if (error.name === 'ValidationError') error = validationErrorHandler(error);
    if (error.name === 'TokenExpiredError') error = handleExpireJWT(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);

    prodError(res, error);
  }
};
// our mongoose error was not operational error that why we make these function  castErrorHandler ,  duplicatekeyerror ,  validationErrorHandler   for send proper error messag to client 

 