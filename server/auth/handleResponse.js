// const { clearTokens } = require("./cookie");

function handleResponse(req, res, statusCode, data, message) {
  let isError = false;
  let errorMessage = message;
  switch (statusCode) {
    case 204:
      return res.sendStatus(204);
    case 400:
      isError = true;
      break;
    case 401:
      isError = true;
      errorMessage = message || "Usuario Invalido.";
      // clearTokens(req, res);
      break;
    case 403:
      isError = true;
      errorMessage = message || "No tienes acceso a este recurso.";
      // clearTokens(req, res);
      break;
    default:
      break;
  }
  const resObj = data || {};
  if (isError) {
    resObj.error = true;
    resObj.message = errorMessage;
  }
  json = {
    statusCode: statusCode,
    resObj: resObj,
  };
  return res.status(statusCode).json(resObj);
}

module.exports = handleResponse;
