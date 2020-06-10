const jwt = require("jsonwebtoken");
// middleware that checks if JWT token exists and verifies it if it does exist.
// In all private routes, this helps to know if the request is authenticated or not.
const authMiddleware = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers["authorization"];
  if (!token) return next(); //if no token, continue

  token = token.replace("Bearer ", "");
  try {
    var decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode; //set the user to req so other routes can use it
    next();
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: "Usuario Invalido.",
    });
  }
};

module.exports = authMiddleware;
